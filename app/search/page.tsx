"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Search, Database, LogOut } from "lucide-react"
import { useAuth } from "@/context/auth-context"

export default function SearchPage() {
  const router = useRouter()
  const { logout } = useAuth()
  const [formData, setFormData] = useState({
    property_id: "",
    owner_name: "",
    address: "",
    registration_number: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Add Spline script dynamically
    const script = document.createElement("script")
    script.type = "module"
    script.src = "https://unpkg.com/@splinetool/viewer@1.9.89/build/spline-viewer.js"
    script.onload = () => setIsLoaded(true)
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate web scraping delay
    setTimeout(() => {
      // Encode the form data to pass as URL parameters
      const params = new URLSearchParams(formData as any).toString()
      router.push(`/results?${params}`)
    }, 2000)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }

  return (
    <div className="min-h-screen bg-black p-4 md:p-8 relative overflow-hidden">
      {/* Spline 3D Background */}
      <div className="absolute inset-0 z-0 opacity-60">
        {isLoaded && <spline-viewer url="https://prod.spline.design/fKCmgDdSMnN7Ekd4/scene.splinecode"></spline-viewer>}
      </div>

      {/* Logout Button */}
      <div className="absolute top-4 right-4 z-20">
        <Button variant="ghost" size="sm" onClick={logout} className="text-white hover:bg-white/10">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      <div className="relative z-10">
        <Button variant="ghost" className="text-white mb-6" onClick={() => router.push("/")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
        </Button>

        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-2xl mx-auto">
          <motion.div variants={itemVariants}>
            <Card className="bg-black/70 border-gray-800 backdrop-blur-md shadow-xl">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-white flex items-center">
                  <Database className="mr-2 h-6 w-6 text-blue-400" />
                  Property Information Finder
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Enter property details to retrieve comprehensive information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="property_id" className="text-white">
                      Property ID
                    </Label>
                    <Input
                      id="property_id"
                      name="property_id"
                      placeholder="Enter property ID (e.g., 12345)"
                      value={formData.property_id}
                      onChange={handleChange}
                      required
                      className="bg-black/50 border-gray-700 text-white"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="owner_name" className="text-white">
                      Owner's Name
                    </Label>
                    <Input
                      id="owner_name"
                      name="owner_name"
                      placeholder="Enter owner's full name"
                      value={formData.owner_name}
                      onChange={handleChange}
                      required
                      className="bg-black/50 border-gray-700 text-white"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="address" className="text-white">
                      Address
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="Enter property address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="bg-black/50 border-gray-700 text-white"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="registration_number" className="text-white">
                      Registration Number
                    </Label>
                    <Input
                      id="registration_number"
                      name="registration_number"
                      placeholder="Enter registration number (e.g., REG9876)"
                      value={formData.registration_number}
                      onChange={handleChange}
                      required
                      className="bg-black/50 border-gray-700 text-white"
                    />
                  </motion.div>
                </form>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Searching Property Data...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Search className="mr-2 h-4 w-4" /> Search Property
                    </div>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0 z-0 opacity-30">
        <ParticleBackground />
      </div>
    </div>
  )
}

function ParticleBackground() {
  const particles = Array.from({ length: 30 }).map((_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 bg-blue-400 rounded-full"
      initial={{
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        opacity: Math.random() * 0.5 + 0.3,
      }}
      animate={{
        y: [null, Math.random() * window.innerHeight],
        x: [null, Math.random() * window.innerWidth],
      }}
      transition={{
        duration: Math.random() * 20 + 10,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      }}
      style={{
        width: `${Math.random() * 4 + 1}px`,
        height: `${Math.random() * 4 + 1}px`,
      }}
    />
  ))

  return <>{particles}</>
}
