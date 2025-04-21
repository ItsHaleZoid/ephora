import Hero from "@/components/Hero";
import Header from "@/components/Header";
import FeaturesSection from "@/components/FeaturesSection";
import Problem from "@/components/Problem";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
export default function Home() {
  return (
<main>
  <div>
    <Header />
    <Hero />
    <FeaturesSection items={[]} />
    <Problem />
    <FAQ />
    <Footer />
  </div>
</main>
  )
}