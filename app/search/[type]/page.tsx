"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Search, LogOut, Building, Trees } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SplineViewer } from "@/components/ui/spline-viewer"
import { ParticleBackground } from "@/components/ui/particle-background"

interface FormData {
  locality: string
  party_type: "first" | "second"
  party_name: string
  sro: string
  reg_year: string
}

export default function SearchPage() {
  const router = useRouter()
  const params = useParams()
  const { logout } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const propertyType = params.type as string
  const isUrban = propertyType === "urban"

  const [formData, setFormData] = useState<FormData>({
    locality: "",
    party_type: "first",
    party_name: "",
    sro: "",
    reg_year: "",
  })

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

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Encode the form data to pass as URL parameters
    const params = new URLSearchParams({
      ...formData,
      property_type: propertyType,
    }).toString()

    // Navigate to results page with search parameters
    router.push(`/results?${params}`)
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
        <spline-viewer 
          url="https://prod.spline.design/fKCmgDdSMnN7Ekd4/scene.splinecode"
          class="w-full h-full"
        />
      </div>

      {/* Logout Button */}
      <div className="absolute top-4 right-4 z-20">
        <Button variant="ghost" size="sm" onClick={logout} className="text-white hover:bg-white/10">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      <div className="relative z-10">
        <Button variant="ghost" className="text-white mb-6" onClick={() => router.push("/property-type")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Property Type Selection
        </Button>

        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-2xl mx-auto">
          <motion.div variants={itemVariants}>
            <Card className="bg-black/70 border-gray-800 backdrop-blur-md shadow-xl">
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-center mb-2">
                  {isUrban ? (
                    <div className="bg-blue-600/20 p-3 rounded-full">
                      <Building className="h-6 w-6 text-blue-400" />
                    </div>
                  ) : (
                    <div className="bg-green-600/20 p-3 rounded-full">
                      <Trees className="h-6 w-6 text-green-400" />
                    </div>
                  )}
                </div>
                <CardTitle className="text-2xl text-white flex items-center justify-center">
                  {isUrban ? "Urban" : "Rural"} Property Information Finder
                </CardTitle>
                <CardDescription className="text-gray-400 text-center">
                  Enter {isUrban ? "urban" : "rural"} property details to retrieve comprehensive information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Common Fields */}
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="locality" className="text-white">Locality</Label>
                    <Input
                      id="locality"
                      name="locality"
                      value={formData.locality}
                      onChange={handleChange}
                      placeholder="Enter locality"
                      className="bg-black/50 border-gray-800 text-white"
                      required
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="party_type" className="text-white">Select Party</Label>
                    <Select
                      name="party_type"
                      value={formData.party_type}
                      onValueChange={(value) => handleSelectChange("party_type", value)}
                    >
                      <SelectTrigger className="bg-black/50 border-gray-800 text-white">
                        <SelectValue placeholder="Select party type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="first">First Party</SelectItem>
                        <SelectItem value="second">Second Party</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="party_name" className="text-white">
                      {formData.party_type === "first" ? "First" : "Second"} Party Name
                    </Label>
                    <Input
                      id="party_name"
                      name="party_name"
                      value={formData.party_name}
                      onChange={handleChange}
                      placeholder="Enter party name"
                      className="bg-black/50 border-gray-800 text-white"
                      required
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="sro" className="text-white">SRO</Label>
                    <Input
                      id="sro"
                      name="sro"
                      value={formData.sro}
                      onChange={handleChange}
                      placeholder="Enter SRO"
                      className="bg-black/50 border-gray-800 text-white"
                      required
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="reg_year" className="text-white">Registration Year</Label>
                    <Input
                      id="reg_year"
                      name="reg_year"
                      value={formData.reg_year}
                      onChange={handleChange}
                      placeholder="Enter registration year"
                      className="bg-black/50 border-gray-800 text-white"
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                      required
                    />
                  </motion.div>
                </form>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Search className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Search Property
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated Particles */}
      <ParticleBackground />
    </div>
  )
}
