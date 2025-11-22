import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { WhyChooseSection } from "@/components/landing/why-choose-section"
import { ProgramsSection } from "@/components/landing/programs-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { Footer } from "@/components/landing/footer"
import { Navigation } from "@/components/landing/navigation"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <WhyChooseSection />
      <ProgramsSection />
      <TestimonialsSection />
      <Footer />
    </main>
  )
}
