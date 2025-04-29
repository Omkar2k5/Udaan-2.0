"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, LogOut, FileText, Search } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ParticleBackground } from "@/components/ui/particle-background"
import { SplineBackground } from "@/app/components/SplineBackground"
import { db } from "@/lib/firebase"
import { ref, get } from "firebase/database"

interface LocationData {
  states: string[];
  districtsByState: Record<string, string[]>;
  citiesByDistrict: Record<string, Record<string, string[]>>;
}

interface EncumbranceFormData {
  assetCategory: "movable";
  assetType: "residential" | "commercial" | "other";
  surveyNumber: string;
  plotNumber: string;
  houseNumber: string;
  floorNumber: string;
  projectName: string;
  locality: string;
  state: string;
  district: string;
  city: string;
  pinCode: string;
}

export default function EncumbranceSearchPage() {
  const router = useRouter()
  const { logout } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [locationData, setLocationData] = useState<LocationData | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState<EncumbranceFormData>({
    assetCategory: "movable",
    assetType: "residential",
    surveyNumber: "",
    plotNumber: "",
    houseNumber: "",
    floorNumber: "",
    projectName: "",
    locality: "",
    state: "",
    district: "",
    city: "",
    pinCode: "",
  })

  // Location options state
  const [states, setStates] = useState<string[]>([])
  const [districts, setDistricts] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted || !db) {
      return
    }

    const fetchLocationData = async () => {
      try {
        const locationsRef = ref(db, 'locations/encumbrance')
        const snapshot = await get(locationsRef)

        if (snapshot.exists()) {
          const data = snapshot.val() as LocationData
          setLocationData(data)
          setStates(data.states || [])
        } else {
          console.warn('No location data found')
          setStates([])
        }
      } catch (err) {
        console.error('Error fetching location data:', err)
        setError('Failed to load location data')
      }
    }

    fetchLocationData()
  }, [isMounted, db])

  useEffect(() => {
    if (formData.state && locationData?.districtsByState) {
      setDistricts(locationData.districtsByState[formData.state] || [])
      setCities([])
    } else {
      setDistricts([])
      setCities([])
    }
  }, [formData.state, locationData])

  useEffect(() => {
    if (formData.state && formData.district && locationData?.citiesByDistrict) {
      setCities(locationData.citiesByDistrict[formData.state]?.[formData.district] || [])
    } else {
      setCities([])
    }
  }, [formData.state, formData.district, locationData])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSelectChange = (name: keyof EncumbranceFormData, value: string) => {
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
      type: "encumbrance",
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
    <div className="bg-black">
      {/* Fixed elements */}
      <div className="fixed inset-0 -z-10">
        <SplineBackground />
      </div>
      
      <div className="fixed top-4 right-4 z-50">
        <Button variant="ghost" size="sm" onClick={logout} className="text-white hover:bg-white/10">
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
      
      {/* Scrollable content wrapper */}
      <div className="py-4 px-4 md:px-8">
        <Button variant="ghost" className="text-white mb-6" onClick={() => router.push("/property-type")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Property Type Selection
        </Button>
        
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-2xl mx-auto">
          <motion.div variants={itemVariants}>
            <Card className="bg-black/70 border-gray-800 backdrop-blur-md shadow-xl mb-20">
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-center mb-2">
                  <div className="bg-purple-600/20 p-3 rounded-full">
                    <FileText className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-white text-center">Encumbrance Details Search</CardTitle>
                <CardDescription className="text-gray-400 text-center">
                  Enter property details to search for encumbrance information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="assetCategory" className="text-white">Asset Category</Label>
                    <Input
                      id="assetCategory"
                      name="assetCategory"
                      value="movable"
                      className="bg-black/50 border-gray-800 text-white"
                      disabled
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="assetType" className="text-white">Type of Asset</Label>
                    <Select
                      name="assetType"
                      value={formData.assetType}
                      onValueChange={(value) => handleSelectChange("assetType", value)}
                    >
                      <SelectTrigger className="bg-black/50 border-gray-800 text-white">
                        <SelectValue placeholder="Select asset type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residential">Residential</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="surveyNumber" className="text-white">Survey Number / Municipal Number</Label>
                    <Input
                      id="surveyNumber"
                      name="surveyNumber"
                      value={formData.surveyNumber}
                      onChange={handleInputChange}
                      placeholder="Enter survey/municipal number"
                      className="bg-black/50 border-gray-800 text-white"
                      required
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="plotNumber" className="text-white">Plot Number</Label>
                    <Input
                      id="plotNumber"
                      name="plotNumber"
                      value={formData.plotNumber}
                      onChange={handleInputChange}
                      placeholder="Enter plot number"
                      className="bg-black/50 border-gray-800 text-white"
                      required
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="houseNumber" className="text-white">House/Flat Number</Label>
                    <Input
                      id="houseNumber"
                      name="houseNumber"
                      value={formData.houseNumber}
                      onChange={handleInputChange}
                      placeholder="Enter house/flat number"
                      className="bg-black/50 border-gray-800 text-white"
                      required
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="floorNumber" className="text-white">Floor No.</Label>
                    <Input
                      id="floorNumber"
                      name="floorNumber"
                      value={formData.floorNumber}
                      onChange={handleInputChange}
                      placeholder="Enter floor number"
                      className="bg-black/50 border-gray-800 text-white"
                      required
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="projectName" className="text-white">Name of the Project/Scheme/Society</Label>
                    <Input
                      id="projectName"
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleInputChange}
                      placeholder="Enter project/scheme/society name"
                      className="bg-black/50 border-gray-800 text-white"
                      required
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="locality" className="text-white">Locality/Sector</Label>
                    <Input
                      id="locality"
                      name="locality"
                      value={formData.locality}
                      onChange={handleInputChange}
                      placeholder="Enter locality/sector"
                      className="bg-black/50 border-gray-800 text-white"
                      required
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="state" className="text-white">State</Label>
                    <Select
                      name="state"
                      value={formData.state}
                      onValueChange={(value) => handleSelectChange("state", value)}
                    >
                      <SelectTrigger className="bg-black/50 border-gray-800 text-white">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="district" className="text-white">District</Label>
                    <Select
                      name="district"
                      value={formData.district}
                      onValueChange={(value) => handleSelectChange("district", value)}
                      disabled={!formData.state}
                    >
                      <SelectTrigger className="bg-black/50 border-gray-800 text-white">
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="city" className="text-white">City/Town/Village</Label>
                    <Select
                      name="city"
                      value={formData.city}
                      onValueChange={(value) => handleSelectChange("city", value)}
                      disabled={!formData.district}
                    >
                      <SelectTrigger className="bg-black/50 border-gray-800 text-white">
                        <SelectValue placeholder="Select city/town/village" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <Label htmlFor="pinCode" className="text-white">Pin Code</Label>
                    <Input
                      id="pinCode"
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleInputChange}
                      placeholder="Enter pin code"
                      className="bg-black/50 border-gray-800 text-white"
                      pattern="[0-9]{6}"
                      maxLength={6}
                      required
                    />
                  </motion.div>
                </form>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
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
                      Search Encumbrance Details
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      </div>
      
      <ParticleBackground />
    </div>
  )
} 