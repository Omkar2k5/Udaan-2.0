"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { ParticleBackground } from "@/components/ui/particle-background"
import { NavBar } from "@/app/components/NavBar"

export default function HomePage() {
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleGetStarted = () => {
    router.push("/SmartSearch")
  }

  useEffect(() => {
    // Load Spline script if needed
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/@splinetool/viewer@0.9.369/build/spline-viewer.js'
    script.async = true
    document.body.appendChild(script)
    
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      {/* Navigation Bar */}
      <NavBar showBackButton={false} />

      {/* 3D Spline Object */}
      <div className="absolute inset-0 z-0">
        <div dangerouslySetInnerHTML={{ 
          __html: '<spline-viewer url="https://prod.spline.design/pY4CEJVxSZ9x753F/scene.splinecode" class="w-full h-full"></spline-viewer>' 
        }} />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-screen w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="relative overflow-hidden rounded-full"
          >
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="relative bg-black/50 border-0 hover:bg-black/30 text-white px-10 py-6 text-lg rounded-full overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-500/60 to-purple-500/60 opacity-70 group-hover:opacity-100 transition-opacity"></span>
              <span className="relative z-10 bg-gradient-to-r from-indigo-200 to-purple-100 bg-clip-text text-transparent font-semibold">
                Get Started
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated Particles */}
      <ParticleBackground />
    </div>
  )
}
