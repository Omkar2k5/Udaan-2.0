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

interface FormData {
  // Common fields
  owner_name: string
  address: string
  registration_number: string

  // Urban specific fields
  property_id?: string
  building_type?: string
  floor_number?: string

  // Rural specific fields
  khasra_number?: string
  land_area?: string
  land_type?: string
  village_name?: string
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
    owner_name: "",
    address: "",
    registration_number: "",
    property_id: "",
    building_type: "",
    floor_number: "",
    khasra_number: "",
    land_area: "",
    land_type: "",
    village_name: "",
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate web scraping delay
    setTimeout(() => {
      // Encode the form data to pass as URL parameters
      const params = new URLSearchParams({
        ...formData,
        property_type: propertyType,
      } as any).toString()
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
                      placeholder="Enter registration number"
                      value={formData.registration_number}
                      onChange={handleChange}
                      required
                      className="bg-black/50 border-gray-700 text-white"
                    />
                  </motion.div>

                  {/* Urban-specific fields */}
                  {isUrban && (
                    <>
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
                        <Label htmlFor="building_type" className="text-white">
                          Building Type
                        </Label>
                        <Select
                          value={formData.building_type}
                          onValueChange={(value) => handleSelectChange("building_type", value)}
                        >
                          <SelectTrigger className="bg-black/50 border-gray-700 text-white">
                            <SelectValue placeholder="Select building type" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-700 text-white">
                            <SelectItem value="apartment">Apartment</SelectItem>
                            <SelectItem value="commercial">Commercial</SelectItem>
                            <SelectItem value="house">House</SelectItem>
                            <SelectItem value="office">Office</SelectItem>
                            <SelectItem value="mixed_use">Mixed Use</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>

                      <motion.div variants={itemVariants} className="space-y-2">
                        <Label htmlFor="floor_number" className="text-white">
                          Floor Number
                        </Label>
                        <Input
                          id="floor_number"
                          name="floor_number"
                          placeholder="Enter floor number (if applicable)"
                          value={formData.floor_number}
                          onChange={handleChange}
                          className="bg-black/50 border-gray-700 text-white"
                        />
                      </motion.div>
                    </>
                  )}

                  {/* Rural-specific fields */}
                  {!isUrban && (
                    <>
                      <motion.div variants={itemVariants} className="space-y-2">
                        <Label htmlFor="khasra_number" className="text-white">
                          Khasra Number
                        </Label>
                        <Input
                          id="khasra_number"
                          name="khasra_number"
                          placeholder="Enter khasra number"
                          value={formData.khasra_number}
                          onChange={handleChange}
                          required
                          className="bg-black/50 border-gray-700 text-white"
                        />
                      </motion.div>

                      <motion.div variants={itemVariants} className="space-y-2">
                        <Label htmlFor="land_area" className="text-white">
                          Land Area
                        </Label>
                        <Input
                          id="land_area"
                          name="land_area"
                          placeholder="Enter land area (e.g., 2.5 acres)"
                          value={formData.land_area}
                          onChange={handleChange}
                          required
                          className="bg-black/50 border-gray-700 text-white"
                        />
                      </motion.div>

                      <motion.div variants={itemVariants} className="space-y-2">
                        <Label htmlFor="land_type" className="text-white">
                          Land Type
                        </Label>
                        <Select
                          value={formData.land_type}
                          onValueChange={(value) => handleSelectChange("land_type", value)}
                        >
                          <SelectTrigger className="bg-black/50 border-gray-700 text-white">
                            <SelectValue placeholder="Select land type" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-900 border-gray-700 text-white">
                            <SelectItem value="agricultural">Agricultural</SelectItem>
                            <SelectItem value="residential">Residential</SelectItem>
                            <SelectItem value="commercial">Commercial</SelectItem>
                            <SelectItem value="forest">Forest</SelectItem>
                            <SelectItem value="barren">Barren</SelectItem>
                          </SelectContent>
                        </Select>
                      </motion.div>

                      <motion.div variants={itemVariants} className="space-y-2">
                        <Label htmlFor="village_name" className="text-white">
                          Village Name
                        </Label>
                        <Input
                          id="village_name"
                          name="village_name"
                          placeholder="Enter village name"
                          value={formData.village_name}
                          onChange={handleChange}
                          required
                          className="bg-black/50 border-gray-700 text-white"
                        />
                      </motion.div>
                    </>
                  )}
                </form>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`w-full ${
                    isUrban ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
                  } text-white`}
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
