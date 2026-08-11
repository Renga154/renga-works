"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export type Tier = { nodes: number; links: number };

/**
 * Nodes drift on a deterministic path derived from their rest position, a
 * per-node seed and time. The line shader runs the *same* function, so the
 * links follow their endpoints exactly with no per-frame CPU work — the
 * geometry is uploaded once and never touched again.
 */
const DRIFT = /* glsl */ `
  vec3 drift(vec3 p, float seed, float t) {
    float a = t * 0.13 + seed * 6.2831853;
    return p + vec3(
      sin(a) * 0.42,
      cos(a * 0.87 + seed * 3.1) * 0.34,
      sin(a * 0.71 + seed * 5.7) * 0.28
    );
  }
`;

const nodeVert = /* glsl */ `
  attribute float aSeed;
  attribute float aSize;
  uniform float uTime;
  uniform float uScale;
  varying float vMix;
  ${DRIFT}
  void main() {
    vec3 p = drift(position, aSeed, uTime);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vMix = clamp((-mv.z - 4.0) / 9.0, 0.0, 1.0);
    gl_Position = projectionMatrix * mv;
    // Nodes in a diagram behind the text, not a bokeh field. At the default
    // camera distance this is roughly 5px for ordinary nodes and 17px for
    // hubs. Raise INTENSITY below to make the field more prominent.
    gl_PointSize = aSize * uScale * (60.0 / -mv.z);
  }
`;

const nodeFrag = /* glsl */ `
  // No precision qualifier here on purpose: three prepends a matching one to
  // both stages, and overriding it only in the fragment shader makes shared
  // uniforms (uTime) disagree across stages, which fails to link.
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  varying float vMix;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = dot(c, c);
    if (d > 0.25) discard;
    // Tight core with a short halo. Additive blending stacks, so this stays
    // deliberately dim — the text in front has to remain the brightest thing.
    float a = 1.0 - d * 4.0;
    a = a * a;
    vec3 col = mix(uColorA, uColorB, vMix);
    gl_FragColor = vec4(col, a * uOpacity * 0.6);
  }
`;

const lineVert = /* glsl */ `
  attribute float aSeed;
  attribute float aT;
  attribute float aPair;
  uniform float uTime;
  varying float vT;
  varying float vPair;
  varying float vMix;
  ${DRIFT}
  void main() {
    vec3 p = drift(position, aSeed, uTime);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vT = aT;
    vPair = aPair;
    vMix = clamp((-mv.z - 4.0) / 9.0, 0.0, 1.0);
    gl_Position = projectionMatrix * mv;
  }
`;

const lineFrag = /* glsl */ `
  // No precision qualifier here on purpose: three prepends a matching one to
  // both stages, and overriding it only in the fragment shader makes shared
  // uniforms (uTime) disagree across stages, which fails to link.
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  varying float vT;
  varying float vPair;
  varying float vMix;
  void main() {
    // A pulse travelling from one end of the link to the other.
    float phase = fract(uTime * 0.22 + vPair * 0.1372);
    float d = abs(vT - phase);
    d = min(d, 1.0 - d);
    float pulse = smoothstep(0.10, 0.0, d);
    vec3 col = mix(uColorA, uColorB, vMix);
    // The links carry the idea, so they keep more of the budget than the
    // nodes do — but the resting web still sits close to invisible.
    float a = (0.09 + pulse * 0.55) * uOpacity;
    gl_FragColor = vec4(col, a);
  }
`;

/** Small deterministic PRNG so the layout is identical on every load. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SPAN = { x: 7.5, y: 4.6, z: 3.2 };

function buildGeometry(tier: Tier) {
  const rand = rng(20260811);
  const count = tier.nodes;

  const pos = new Float32Array(count * 3);
  const seeds = new Float32Array(count);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    pos[i * 3] = (rand() * 2 - 1) * SPAN.x;
    pos[i * 3 + 1] = (rand() * 2 - 1) * SPAN.y;
    pos[i * 3 + 2] = (rand() * 2 - 1) * SPAN.z;
    seeds[i] = rand();
    // A few nodes read as hubs; most stay small.
    sizes[i] = rand() < 0.1 ? 1.8 + rand() * 0.8 : 0.85 + rand() * 0.8;
  }

  const nodeGeo = new THREE.BufferGeometry();
  nodeGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  nodeGeo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
  nodeGeo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));

  // Link each node to its nearest neighbours, capped at the tier budget.
  const pairs: [number, number][] = [];
  const maxDistSq = 2.9 * 2.9;
  outer: for (let i = 0; i < count; i++) {
    let made = 0;
    for (let j = i + 1; j < count; j++) {
      const dx = pos[i * 3] - pos[j * 3];
      const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
      const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
      if (dx * dx + dy * dy + dz * dz > maxDistSq) continue;
      pairs.push([i, j]);
      made++;
      if (pairs.length >= tier.links) break outer;
      if (made >= 3) break;
    }
  }

  const lp = new Float32Array(pairs.length * 6);
  const ls = new Float32Array(pairs.length * 2);
  const lt = new Float32Array(pairs.length * 2);
  const lpair = new Float32Array(pairs.length * 2);

  pairs.forEach(([a, b], k) => {
    lp[k * 6] = pos[a * 3];
    lp[k * 6 + 1] = pos[a * 3 + 1];
    lp[k * 6 + 2] = pos[a * 3 + 2];
    lp[k * 6 + 3] = pos[b * 3];
    lp[k * 6 + 4] = pos[b * 3 + 1];
    lp[k * 6 + 5] = pos[b * 3 + 2];
    ls[k * 2] = seeds[a];
    ls[k * 2 + 1] = seeds[b];
    lt[k * 2] = 0;
    lt[k * 2 + 1] = 1;
    lpair[k * 2] = k;
    lpair[k * 2 + 1] = k;
  });

  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute("position", new THREE.BufferAttribute(lp, 3));
  lineGeo.setAttribute("aSeed", new THREE.BufferAttribute(ls, 1));
  lineGeo.setAttribute("aT", new THREE.BufferAttribute(lt, 1));
  lineGeo.setAttribute("aPair", new THREE.BufferAttribute(lpair, 1));

  return { nodeGeo, lineGeo, linkCount: pairs.length };
}

const COLOR_A = new THREE.Color("#3fcf8e");
const COLOR_B = new THREE.Color("#4c7dff");

export function AgentNetwork({
  tier,
  onMeasure,
}: {
  tier: Tier;
  /** Reports a rolling FPS sample so the host can downgrade or bail out. */
  onMeasure: (fps: number) => void;
}) {
  const group = useRef<THREE.Group>(null);
  // Both materials share one uniforms object, and it is only ever mutated
  // through this ref inside useFrame — never as a value returned by a hook.
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();

  const { nodeGeo, lineGeo } = useMemo(() => buildGeometry(tier), [tier]);

  useEffect(() => {
    return () => {
      nodeGeo.dispose();
      lineGeo.dispose();
    };
  }, [nodeGeo, lineGeo]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: 1 },
      uScale: { value: 1 },
      uColorA: { value: COLOR_A },
      uColorB: { value: COLOR_B },
    }),
    [],
  );

  // Pointer target, in normalized device space.
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    function onMove(e: PointerEvent) {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const frames = useRef(0);
  const acc = useRef(0);

  useFrame((_, delta) => {
    // Guard against the huge delta a backgrounded tab produces on resume.
    const dt = Math.min(delta, 0.05);

    const u = mat.current?.uniforms;
    if (u) {
      u.uTime.value += dt;

      // Scroll: the field recedes as the hero leaves the screen, so it never
      // competes with the content below it.
      const y = window.scrollY;
      const fade = 1 - Math.min(y / (window.innerHeight * 1.15), 1);
      u.uOpacity.value = 0.18 + fade * 0.52;

      // Viewport-independent dot scale, so the field reads the same everywhere.
      u.uScale.value = Math.min(size.width / 1280, 1.35);
    }

    if (group.current) {
      const g = group.current;
      g.rotation.y += (pointer.current.x * 0.16 - g.rotation.y) * 0.035;
      g.rotation.x += (pointer.current.y * 0.1 - g.rotation.x) * 0.035;
    }

    frames.current += 1;
    acc.current += dt;
    if (acc.current >= 1) {
      onMeasure(frames.current / acc.current);
      frames.current = 0;
      acc.current = 0;
    }
  });

  return (
    <group ref={group}>
      <points geometry={nodeGeo} frustumCulled={false}>
        <shaderMaterial
          ref={mat}
          vertexShader={nodeVert}
          fragmentShader={nodeFrag}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <lineSegments geometry={lineGeo} frustumCulled={false}>
        <shaderMaterial
          vertexShader={lineVert}
          fragmentShader={lineFrag}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}
