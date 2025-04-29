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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ParticleBackground } from "@/components/ui/particle-background"
import { SplineBackground } from "@/components/ui/spline-background"

interface CompanyFormData {
  companyName: string;
  cinLlpin: string;
  state: string;
  activity: string;
  searchType: "master" | "director" | "advanced";
  directorName?: string;
  fatherLastName?: string;
  dateOfBirth?: string;
  din?: string;
  registrationNumber?: string;
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
    searchType: "master",
    directorName: "",
    fatherLastName: "",
    dateOfBirth: "",
    din: "",
    registrationNumber: ""
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

  const handleSearchTypeChange = (value: "master" | "director" | "advanced") => {
    setFormData({
      ...formData,
      searchType: value,
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
                      Search for company information, charges, signatories, and director details
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <Tabs defaultValue="master" className="w-full" onValueChange={(value) => 
                      handleSearchTypeChange(value as "master" | "director" | "advanced")
                    }>
                      <TabsList className="grid grid-cols-3 mb-6">
                        <TabsTrigger value="master">Company & Charges</TabsTrigger>
                        <TabsTrigger value="director">Directors</TabsTrigger>
                        <TabsTrigger value="advanced">Advanced</TabsTrigger>
                      </TabsList>
                      
                      {/* Company/LLP Master Data Search & Index of Charges */}
                      <TabsContent value="master">
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
                      </TabsContent>
                      
                      {/* Director Master Data */}
                      <TabsContent value="director">
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <motion.div variants={itemVariants} className="space-y-2">
                            <Label htmlFor="din" className="text-white">DIN (Preferred)</Label>
                            <Input
                              id="din"
                              name="din"
                              value={formData.din}
                              onChange={handleInputChange}
                              placeholder="Enter Director Identification Number"
                              className="bg-black/50 border-gray-800 text-white"
                            />
                          </motion.div>

                          <motion.div variants={itemVariants} className="space-y-2">
                            <Label htmlFor="directorName" className="text-white">Director Name (Optional)</Label>
                            <Input
                              id="directorName"
                              name="directorName"
                              value={formData.directorName}
                              onChange={handleInputChange}
                              placeholder="Enter director's full name"
                              className="bg-black/50 border-gray-800 text-white"
                            />
                          </motion.div>
                          
                          <motion.div variants={itemVariants} className="space-y-2">
                            <Label htmlFor="fatherLastName" className="text-white">Father's Last Name (Optional)</Label>
                            <Input
                              id="fatherLastName"
                              name="fatherLastName"
                              value={formData.fatherLastName}
                              onChange={handleInputChange}
                              placeholder="Enter father's last name"
                              className="bg-black/50 border-gray-800 text-white"
                            />
                          </motion.div>
                          
                          <motion.div variants={itemVariants} className="space-y-2">
                            <Label htmlFor="dateOfBirth" className="text-white">Date of Birth (Optional)</Label>
                            <Input
                              id="dateOfBirth"
                              name="dateOfBirth"
                              value={formData.dateOfBirth}
                              onChange={handleInputChange}
                              placeholder="YYYY-MM-DD"
                              className="bg-black/50 border-gray-800 text-white"
                              type="date"
                            />
                          </motion.div>
                          
                          <div className="pt-2">
                            <p className="text-sm text-gray-400 mb-4">Output will include: Director Name, DIN, Associated Companies/LLPs, Date of Appointment, Designation</p>
                          </div>
                        </form>
                      </TabsContent>
                      
                      {/* Advanced Search */}
                      <TabsContent value="advanced">
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
                            />
                          </motion.div>

                          <motion.div variants={itemVariants} className="space-y-2">
                            <Label htmlFor="cinLlpin" className="text-white">CIN/LLPIN</Label>
                            <Input
                              id="cinLlpin"
                              name="cinLlpin"
                              value={formData.cinLlpin}
                              onChange={handleInputChange}
                              placeholder="Enter CIN or LLPIN number"
                              className="bg-black/50 border-gray-800 text-white"
                            />
                          </motion.div>
                          
                          <motion.div variants={itemVariants} className="space-y-2">
                            <Label htmlFor="registrationNumber" className="text-white">Registration Number</Label>
                            <Input
                              id="registrationNumber"
                              name="registrationNumber"
                              value={formData.registrationNumber}
                              onChange={handleInputChange}
                              placeholder="Enter registration number"
                              className="bg-black/50 border-gray-800 text-white"
                            />
                          </motion.div>
                          
                          <motion.div variants={itemVariants} className="space-y-2">
                            <Label htmlFor="state" className="text-white">State of Registration</Label>
                            <Select
                              name="state"
                              value={formData.state}
                              onValueChange={(value) => handleSelectChange("state", value)}
                            >
                              <SelectTrigger className="bg-black/50 border-gray-800 text-white">
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                              <SelectContent>
                                {stateOptions.map((state) => (
                                  <SelectItem key={state} value={state}>
                                    {state}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </motion.div>
                          
                          <motion.div variants={itemVariants} className="space-y-2">
                            <Label htmlFor="activity" className="text-white">Business Activity</Label>
                            <Input
                              id="activity"
                              name="activity"
                              value={formData.activity}
                              onChange={handleInputChange}
                              placeholder="Enter business activity or industry"
                              className="bg-black/50 border-gray-800 text-white"
                            />
                          </motion.div>
                          
                          <div className="pt-2">
                            <p className="text-sm text-gray-400 mb-4">Advanced search will provide comprehensive results from all available data sources.</p>
                          </div>
                        </form>
                      </TabsContent>
                    </Tabs>
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