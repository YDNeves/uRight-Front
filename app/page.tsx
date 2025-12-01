"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { translations } from "@/lib/pt-BR"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { WhyChooseSection } from "@/components/landing/why-choose-section"
import { ProgramsSection } from "@/components/landing/programs-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { Footer } from "@/components/landing/footer"
import { Navigation } from "@/components/landing/navigation"

const t = translations.auth

export default function HomePage() {
  const router = useRouter()
  const { user, loading } = useAuth()

   useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/dashboard")
      } else {
        router.push("/")
      }
    }
  }, [user, loading, router]) 

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
