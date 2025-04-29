"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Building, User, MapPin, FileText, Info, Shield, Briefcase, LogOut } from "lucide-react"
import { useAuth } from "@/context/auth-context"

interface PropertyData {
  property_id: string
  owner_name: string
  address: string
  registration_number: string
  ownership_details: {
    acquisition_date: string
    previous_owners: string[]
    ownership_type: string
    co_owners?: string[]
  }
  encumbrance_details: {
    mortgages: {
      lender: string
      amount: string
      date: string
      status: string
    }[]
    liens: {
      type: string
      amount: string
      filed_by: string
      date: string
    }[]
    legal_notices: string[]
  }
  company_details: {
    company_name: string
    registration_number: string
    directors: string[]
    incorporation_date: string
    status: string
  }
}

export default function ResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { logout } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null)
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

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      // Create mock data based on the search parameters
      const mockData: PropertyData = {
        property_id: searchParams.get("property_id") || "12345",
        owner_name: searchParams.get("owner_name") || "John Doe",
        address: searchParams.get("address") || "123 Main St, Delhi",
        registration_number: searchParams.get("registration_number") || "REG9876",
        ownership_details: {
          acquisition_date: "15-06-2018",
          previous_owners: ["Jane Smith", "Rajesh Kumar"],
          ownership_type: "Freehold",
          co_owners: ["Mary Doe"],
        },
        encumbrance_details: {
          mortgages: [
            {
              lender: "HDFC Bank",
              amount: "₹45,00,000",
              date: "20-06-2018",
              status: "Active",
            },
          ],
          liens: [
            {
              type: "Tax Lien",
              amount: "₹75,000",
              filed_by: "Municipal Corporation",
              date: "10-03-2022",
            },
          ],
          legal_notices: ["Property boundary dispute notice (2021)", "Water connection approval (2019)"],
        },
        company_details: {
          company_name: "Doe Enterprises Pvt Ltd",
          registration_number: "CIN12345678",
          directors: ["John Doe", "Mary Doe", "Robert Johnson"],
          incorporation_date: "05-01-2015",
          status: "Active",
        },
      }

      setPropertyData(mockData)
      setIsLoading(false)
    }, 2000)
  }, [searchParams])

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Spline 3D Background */}
        <div className="absolute inset-0 z-0 opacity-60">
          {isLoaded && (
            <spline-viewer url="https://prod.spline.design/fKCmgDdSMnN7Ekd4/scene.splinecode"></spline-viewer>
          )}
        </div>

        <div className="relative z-10 text-center">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <motion.div
              className="absolute inset-0 rounded-full border-t-4 border-blue-500"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-2 rounded-full border-t-4 border-blue-300"
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
          </div>
          <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-bold text-white mb-2">
            Gathering Property Information
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-400"
          >
            Searching databases and compiling comprehensive property details...
          </motion.p>
        </div>
      </div>
    )
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
        <Button variant="ghost" className="text-white mb-6" onClick={() => router.push("/search")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
        </Button>

        <AnimatePresence>
          <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-4xl mx-auto">
            <motion.div variants={itemVariants}>
              <Card className="bg-black/70 border-gray-800 backdrop-blur-md shadow-xl mb-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl text-white">Property Information</CardTitle>
                  <CardDescription className="text-gray-400">
                    Comprehensive details for the requested property
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <Building className="h-5 w-5 text-blue-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-400">Property ID</p>
                        <p className="text-white font-medium">{propertyData?.property_id}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <User className="h-5 w-5 text-blue-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-400">Owner's Name</p>
                        <p className="text-white font-medium">{propertyData?.owner_name}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-blue-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-400">Address</p>
                        <p className="text-white font-medium">{propertyData?.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <FileText className="h-5 w-5 text-blue-400 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-400">Registration Number</p>
                        <p className="text-white font-medium">{propertyData?.registration_number}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Tabs defaultValue="ownership" className="w-full">
                <TabsList className="grid grid-cols-3 mb-6 bg-gray-800/70">
                  <TabsTrigger value="ownership" className="data-[state=active]:bg-blue-600 text-white">
                    <Info className="h-4 w-4 mr-2" /> Ownership
                  </TabsTrigger>
                  <TabsTrigger value="encumbrance" className="data-[state=active]:bg-blue-600 text-white">
                    <Shield className="h-4 w-4 mr-2" /> Encumbrance
                  </TabsTrigger>
                  <TabsTrigger value="company" className="data-[state=active]:bg-blue-600 text-white">
                    <Briefcase className="h-4 w-4 mr-2" /> Company
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="ownership">
                  <Card className="bg-black/70 border-gray-800 backdrop-blur-md shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-xl text-white">Ownership Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-400">Acquisition Date</p>
                          <p className="text-white">{propertyData?.ownership_details.acquisition_date}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-400">Ownership Type</p>
                          <p className="text-white">{propertyData?.ownership_details.ownership_type}</p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm text-gray-400">Previous Owners</p>
                        <ul className="list-disc list-inside text-white">
                          {propertyData?.ownership_details.previous_owners.map((owner, index) => (
                            <li key={index}>{owner}</li>
                          ))}
                        </ul>
                      </div>

                      {propertyData?.ownership_details.co_owners && (
                        <div className="space-y-1">
                          <p className="text-sm text-gray-400">Co-Owners</p>
                          <ul className="list-disc list-inside text-white">
                            {propertyData.ownership_details.co_owners.map((owner, index) => (
                              <li key={index}>{owner}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="encumbrance">
                  <Card className="bg-black/70 border-gray-800 backdrop-blur-md shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-xl text-white">Encumbrance Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <h3 className="text-lg font-medium text-white">Mortgages</h3>
                        {propertyData?.encumbrance_details.mortgages.map((mortgage, index) => (
                          <div key={index} className="bg-gray-800/70 p-4 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <p className="text-sm text-gray-400">Lender</p>
                                <p className="text-white">{mortgage.lender}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm text-gray-400">Amount</p>
                                <p className="text-white">{mortgage.amount}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm text-gray-400">Date</p>
                                <p className="text-white">{mortgage.date}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm text-gray-400">Status</p>
                                <p className="text-white">{mortgage.status}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-lg font-medium text-white">Liens</h3>
                        {propertyData?.encumbrance_details.liens.map((lien, index) => (
                          <div key={index} className="bg-gray-800/70 p-4 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <p className="text-sm text-gray-400">Type</p>
                                <p className="text-white">{lien.type}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm text-gray-400">Amount</p>
                                <p className="text-white">{lien.amount}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm text-gray-400">Filed By</p>
                                <p className="text-white">{lien.filed_by}</p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm text-gray-400">Date</p>
                                <p className="text-white">{lien.date}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-lg font-medium text-white">Legal Notices</h3>
                        <ul className="list-disc list-inside text-white space-y-1">
                          {propertyData?.encumbrance_details.legal_notices.map((notice, index) => (
                            <li key={index}>{notice}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="company">
                  <Card className="bg-black/70 border-gray-800 backdrop-blur-md shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-xl text-white">Company Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-400">Company Name</p>
                          <p className="text-white">{propertyData?.company_details.company_name}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-400">Registration Number</p>
                          <p className="text-white">{propertyData?.company_details.registration_number}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-400">Incorporation Date</p>
                          <p className="text-white">{propertyData?.company_details.incorporation_date}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-400">Status</p>
                          <p className="text-white">{propertyData?.company_details.status}</p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm text-gray-400">Directors</p>
                        <ul className="list-disc list-inside text-white">
                          {propertyData?.company_details.directors.map((director, index) => (
                            <li key={index}>{director}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </motion.div>
        </AnimatePresence>
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
