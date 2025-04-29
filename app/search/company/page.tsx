"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, LogOut, Building2, Search, Loader2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ParticleBackground } from "@/components/ui/particle-background"
import { SplineBackground } from "@/components/ui/spline-background"

interface CompanyFormData {
  companyName: string;
  cinLlpin: string;
  state: string;
  activity: string;
  searchType: "master";
}

export default function CompanySearchPage() {
  const router = useRouter()
  const { logout } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  
  // State options for dropdown
  const stateOptions = [
    "All States", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
    "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
    "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
  ]

  // Form state
  const [formData, setFormData] = useState<CompanyFormData>({
    companyName: "",
    cinLlpin: "",
    state: "",
    activity: "",
    searchType: "master"
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSelectChange = (name: keyof CompanyFormData, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Encode the form data to pass as URL parameters
    const params = new URLSearchParams({
      ...formData,
      type: "company",
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
    <div className="min-h-screen bg-black">
      <div className="fixed inset-0 z-0">
        <SplineBackground />
      </div>

      <div className="z-10 relative">
        <div className="absolute top-4 right-4 z-20">
          <Button variant="ghost" size="sm" onClick={logout} className="text-white hover:bg-white/10">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="container mx-auto px-4 pt-16 pb-12">
          <Button
            variant="ghost"
            className="text-white mb-6"
            onClick={() => router.push("/property-type")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Property Type Selection
          </Button>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <motion.div variants={itemVariants}>
                <Card className="bg-black/70 border-gray-800 backdrop-blur-md shadow-xl mb-8">
                  <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-2">
                      <div className="bg-blue-600/20 p-3 rounded-full">
                        <Building2 className="h-6 w-6 text-blue-400" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl text-white text-center">
                      Company Property Details
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-center">
                      Search for company information, charges, and property details
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <motion.div variants={itemVariants} className="space-y-2">
                        <Label htmlFor="companyName" className="text-white">Company/LLP Name</Label>
                        <Input
                          id="companyName"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          placeholder="Enter company or LLP name"
                          className="bg-black/50 border-gray-800 text-white"
                          required
                        />
                      </motion.div>

                      <motion.div variants={itemVariants} className="space-y-2">
                        <Label htmlFor="cinLlpin" className="text-white">CIN/LLPIN (Optional)</Label>
                        <Input
                          id="cinLlpin"
                          name="cinLlpin"
                          value={formData.cinLlpin}
                          onChange={handleInputChange}
                          placeholder="Enter CIN or LLPIN number"
                          className="bg-black/50 border-gray-800 text-white"
                        />
                      </motion.div>
                      
                      <div className="pt-2">
                        <p className="text-sm text-gray-400 mb-4">Output will include: Company Name, CIN/LLPIN, Company Type, Date of Incorporation, Registered Address, Authorized Capital, Paid-up Capital, Company Status, and Property Charges Information</p>
                      </div>
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
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-4 w-4" />
                          Search Company Details
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <ParticleBackground />
    </div>
  )
} 