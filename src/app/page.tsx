import { Nav, SkipLink } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Works } from "@/components/Works";
import { Writing } from "@/components/Writing";
import { Stack } from "@/components/Stack";
import { About } from "@/components/About";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <SkipLink />
      <Nav />
      <main>
        <Hero />
        <Works />
        <Writing />
        <Stack />
        <About />
      </main>
      <Footer />
    </>
  );
}
