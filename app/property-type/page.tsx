"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Building, Home, LogOut, Trees, FileText } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { ParticleBackground } from "@/components/ui/particle-background"
import { SplineBackground } from "@/app/components/SplineBackground"

export default function PropertyTypePage() {
  const router = useRouter()
  const { logout } = useAuth()

  const handleSelectPropertyType = (type: "urban" | "rural" | "encumbrance") => {
    router.push(`/search/${type}`)
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
      <SplineBackground />

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

        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-6xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Select Property Type</h1>
            <p className="text-gray-400 max-w-md mx-auto">
              Choose the type of property you want to search for information about
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <motion.div variants={itemVariants}>
              <Card
                className="bg-black/70 border-gray-800 backdrop-blur-md shadow-xl hover:border-blue-500/50 transition-all cursor-pointer overflow-hidden group"
                onClick={() => handleSelectPropertyType("urban")}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto bg-blue-600/20 p-4 rounded-full mb-4">
                    <Building className="h-10 w-10 text-blue-400" />
                  </div>
                  <CardTitle className="text-xl text-white">Urban Property</CardTitle>
                  <CardDescription className="text-gray-400">
                    Search for properties in urban areas like cities and towns
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <ul className="text-sm text-gray-300 space-y-2 mb-4">
                    <li className="flex items-center justify-center">
                      <span className="bg-blue-500/20 p-1 rounded-full mr-2">
                        <Home className="h-3 w-3 text-blue-400" />
                      </span>
                      Apartments, Flats, Commercial Properties
                    </li>
                    <li className="flex items-center justify-center">
                      <span className="bg-blue-500/20 p-1 rounded-full mr-2">
                        <Home className="h-3 w-3 text-blue-400" />
                      </span>
                      Municipal Records & Urban Development
                    </li>
                    <li className="flex items-center justify-center">
                      <span className="bg-blue-500/20 p-1 rounded-full mr-2">
                        <Home className="h-3 w-3 text-blue-400" />
                      </span>
                      City Planning & Zoning Information
                    </li>
                  </ul>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Select Urban Property</Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card
                className="bg-black/70 border-gray-800 backdrop-blur-md shadow-xl hover:border-green-500/50 transition-all cursor-pointer overflow-hidden group"
                onClick={() => handleSelectPropertyType("rural")}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto bg-green-600/20 p-4 rounded-full mb-4">
                    <Trees className="h-10 w-10 text-green-400" />
                  </div>
                  <CardTitle className="text-xl text-white">Rural Property</CardTitle>
                  <CardDescription className="text-gray-400">
                    Search for properties in rural areas like villages and farmlands
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <ul className="text-sm text-gray-300 space-y-2 mb-4">
                    <li className="flex items-center justify-center">
                      <span className="bg-green-500/20 p-1 rounded-full mr-2">
                        <Trees className="h-3 w-3 text-green-400" />
                      </span>
                      Agricultural Land, Farms, Village Properties
                    </li>
                    <li className="flex items-center justify-center">
                      <span className="bg-green-500/20 p-1 rounded-full mr-2">
                        <Trees className="h-3 w-3 text-green-400" />
                      </span>
                      Land Revenue Records & Panchayat Data
                    </li>
                    <li className="flex items-center justify-center">
                      <span className="bg-green-500/20 p-1 rounded-full mr-2">
                        <Trees className="h-3 w-3 text-green-400" />
                      </span>
                      Agricultural Subsidies & Rural Development
                    </li>
                  </ul>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Select Rural Property</Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card
                className="bg-black/70 border-gray-800 backdrop-blur-md shadow-xl hover:border-purple-500/50 transition-all cursor-pointer overflow-hidden group"
                onClick={() => handleSelectPropertyType("encumbrance")}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto bg-purple-600/20 p-4 rounded-full mb-4">
                    <FileText className="h-10 w-10 text-purple-400" />
                  </div>
                  <CardTitle className="text-xl text-white">Encumbrance Details</CardTitle>
                  <CardDescription className="text-gray-400">
                    Search for property encumbrance and asset details
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <ul className="text-sm text-gray-300 space-y-2 mb-4">
                    <li className="flex items-center justify-center">
                      <span className="bg-purple-500/20 p-1 rounded-full mr-2">
                        <FileText className="h-3 w-3 text-purple-400" />
                      </span>
                      Movable & Immovable Assets
                    </li>
                    <li className="flex items-center justify-center">
                      <span className="bg-purple-500/20 p-1 rounded-full mr-2">
                        <FileText className="h-3 w-3 text-purple-400" />
                      </span>
                      Property Encumbrance Records
                    </li>
                    <li className="flex items-center justify-center">
                      <span className="bg-purple-500/20 p-1 rounded-full mr-2">
                        <FileText className="h-3 w-3 text-purple-400" />
                      </span>
                      Detailed Asset Information
                    </li>
                  </ul>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">View Encumbrance Details</Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Animated Particles */}
      <ParticleBackground />
    </div>
  )
}
