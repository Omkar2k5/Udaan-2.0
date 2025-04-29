"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { LogOut } from "lucide-react"
import { ParticleBackground } from "@/components/ui/particle-background"

export default function HomePage() {
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleGetStarted = () => {
    router.push("/property-type")
  }

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      {/* Logout Button */}
      <div className="absolute top-4 right-4 z-20">
        <Button variant="ghost" size="sm" onClick={logout} className="text-white hover:bg-white/10">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Welcome Message */}
      <div className="absolute top-4 left-4 z-20">
        <p className="text-white text-sm">Welcome, {user?.displayName || user?.email || "User"}</p>
      </div>

      {/* 3D Spline Object */}
      <div className="absolute inset-0 z-0">
        <spline-viewer 
          url="https://prod.spline.design/pY4CEJVxSZ9x753F/scene.splinecode" 
          class="w-full h-full"
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-screen w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-full"
            >
              Get Started
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated Particles */}
      <ParticleBackground />
    </div>
  )
}
