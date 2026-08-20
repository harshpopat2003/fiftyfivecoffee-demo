import Benefits from "@/components/Benefits";
import Branches from "@/components/Branches";
import Compare from "@/components/Compare";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Loader from "@/components/Loader";
import Nav from "@/components/Nav";
import Order from "@/components/Order";
import Origins from "@/components/Origins";
import Proof from "@/components/Proof";
import Roastery from "@/components/Roastery";
import ScrollFilm from "@/components/ScrollFilm";
import Signature from "@/components/Signature";
import SmoothScroll from "@/components/SmoothScroll";
import Ticker from "@/components/Ticker";

/**
 * Section order is a motion decision as much as an editorial one.
 * The four pinned scenes — hero, flavour rail, film and roastery — are
 * spaced so no two land back to back; each is followed by a section
 * that scrolls normally, which stops the page feeling like it keeps
 * grabbing the scrollbar out of the visitor's hands.
 */
export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Loader />
      <Nav />
      <main>
        <Hero />
        <Ticker />
        <Benefits />
        <Proof />
        <Signature />
        <Compare />
        <ScrollFilm />
        <Origins />
        <Roastery />
        <Branches />
        <Order />
      </main>
      <Footer />
    </>
  );
}
