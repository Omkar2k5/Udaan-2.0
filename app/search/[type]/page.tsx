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
import { ParticleBackground } from "@/components/ui/particle-background"

interface UrbanFormData {
  locality: string
  party_type: "first" | "second"
  party_name: string
  sro: string
  reg_year: string
}

interface RuralFormData {
  state: string
  district: string
  division: string
  village: string
  rectangle: string
  khasra: string
}

export default function SearchPage() {
  const router = useRouter()
  const params = useParams()
  const { logout } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const propertyType = params.type as string
  const isUrban = propertyType === "urban"

  // New Delhi districts
  const delhiDistricts = [
    "Central Delhi",
    "East Delhi",
    "New Delhi",
    "North Delhi",
    "North East Delhi",
    "North West Delhi",
    "Shahdara",
    "South Delhi",
    "South East Delhi",
    "South West Delhi",
    "West Delhi"
  ]
  
  // Sample divisions by district
  const divisionsByDistrict: Record<string, string[]> = {
    "Central Delhi": ["Civil Lines", "Karol Bagh", "Kotwali"],
    "East Delhi": ["Gandhi Nagar", "Preet Vihar", "Mayur Vihar"],
    "New Delhi": ["Chanakyapuri", "Connaught Place", "Vasant Vihar"],
    "North Delhi": ["Alipur", "Model Town", "Narela"],
    "North East Delhi": ["Seelampur", "Shahdara", "Seemapuri"],
    "North West Delhi": ["Saraswati Vihar", "Rohini", "Kanjhawala"],
    "Shahdara": ["Shahdara", "Vivek Vihar", "Seemapuri"],
    "South Delhi": ["Hauz Khas", "Saket", "Mehrauli"],
    "South East Delhi": ["Defence Colony", "Kalkaji", "Sarita Vihar"],
    "South West Delhi": ["Najafgarh", "Kapashera", "Dwarka"],
    "West Delhi": ["Patel Nagar", "Rajouri Garden", "Punjabi Bagh"]
  }

  // Sample villages by division (restructured)
  const villagesByDivision: Record<string, Record<string, string[]>> = {
    "Central Delhi": {
      "Civil Lines": ["Kamla Nagar", "Timarpur", "Maurice Nagar", "Malka Ganj"],
      "Karol Bagh": ["Paharganj", "Rajinder Nagar", "Dev Nagar", "Bapa Nagar"],
      "Kotwali": ["Daryaganj", "Chandni Chowk", "Jama Masjid", "Lal Kuan"]
    },
    "East Delhi": {
      "Gandhi Nagar": ["Geeta Colony", "Kailash Nagar", "Raghubar Pura", "Shastri Nagar"],
      "Preet Vihar": ["Nirman Vihar", "Anand Vihar", "Jagriti Enclave", "Surajmal Vihar"],
      "Mayur Vihar": ["Patparganj", "Vasundhara Enclave", "Trilokpuri", "Kondli"]
    },
    "New Delhi": {
      "Chanakyapuri": ["Diplomatic Enclave", "Moti Bagh", "Race Course", "Kautilya Marg"],
      "Connaught Place": ["Janpath", "Barakhamba", "Kasturba Gandhi Marg", "Sansad Marg"],
      "Vasant Vihar": ["Munirka", "Kishangarh", "Anant Lok", "Shanti Niketan"]
    },
    "North Delhi": {
      "Alipur": ["Bakhtawarpur", "Akbarpur Majra", "Hamidpur", "Singhu"],
      "Model Town": ["Rana Pratap Bagh", "Kamla Nagar", "Shakti Nagar", "GTB Nagar"],
      "Narela": ["Holambi Kalan", "Pooth Khurd", "Bhorgarh", "Bankner"]
    },
    "North East Delhi": {
      "Seelampur": ["Welcome", "Jafrabad", "Maujpur", "Babarpur"],
      "Shahdara": ["Ram Nagar", "Farsh Bazar", "Bholanath Nagar", "Vishwas Nagar"],
      "Seemapuri": ["New Seemapuri", "Old Seemapuri", "Dilshad Garden", "Janta Flats"]
    },
    "North West Delhi": {
      "Saraswati Vihar": ["Pitampura", "Ashok Vihar", "Wazirpur", "Bharat Nagar"],
      "Rohini": ["Sector 1-16", "Begumpur", "Kanjhawala", "Rithala"],
      "Kanjhawala": ["Nizampur", "Qutabgarh", "Chandpur", "Karala"]
    },
    "Shahdara": {
      "Shahdara": ["Ram Nagar", "Bholanath Nagar", "Gandhi Nagar", "Jhilmil"],
      "Vivek Vihar": ["Shreshtha Vihar", "Karkardooma", "Surajmal Vihar", "Krishna Nagar"],
      "Seemapuri": ["New Seemapuri", "Old Seemapuri", "Dilshad Garden", "Tahirpur"]
    },
    "South Delhi": {
      "Hauz Khas": ["Green Park", "SDA", "Sarvapriya Vihar", "Panchsheel Park"],
      "Saket": ["Malviya Nagar", "Pushp Vihar", "Sheikh Sarai", "Khirki Extension"],
      "Mehrauli": ["Chattarpur", "Lado Sarai", "Sultanpur", "Gadaipur"]
    },
    "South East Delhi": {
      "Defence Colony": ["Lajpat Nagar", "Jangpura", "Nizamuddin", "Andrews Ganj"],
      "Kalkaji": ["Govindpuri", "CR Park", "GK II", "Alaknanda"],
      "Sarita Vihar": ["Jasola", "Madanpur Khadar", "Okhla", "Khadar"]
    },
    "South West Delhi": {
      "Najafgarh": ["Dichaon Kalan", "Mitraon", "Roshanpura", "Chhawla"],
      "Kapashera": ["Bijwasan", "Samalkha", "Barthal", "Bajghera"],
      "Dwarka": ["Sector 1-29", "Palam", "Dabri", "Mahavir Enclave"]
    },
    "West Delhi": {
      "Patel Nagar": ["Karol Bagh", "Ranjit Nagar", "Baljit Nagar", "Anand Parbat"],
      "Rajouri Garden": ["Tilak Nagar", "Tagore Garden", "Subhash Nagar", "Khyala"],
      "Punjabi Bagh": ["Madipur", "Paschim Vihar", "Nangloi", "Rani Bagh"]
    }
  }

  const [selectedDistrict, setSelectedDistrict] = useState<string>("")
  const [selectedDivision, setSelectedDivision] = useState<string>("")
  const [divisions, setDivisions] = useState<string[]>([])
  const [villages, setVillages] = useState<string[]>([])

  const [urbanFormData, setUrbanFormData] = useState<UrbanFormData>({
    locality: "",
    party_type: "first",
    party_name: "",
    sro: "",
    reg_year: "",
  })

  const [ruralFormData, setRuralFormData] = useState<RuralFormData>({
    state: "Delhi",
    district: "",
    division: "",
    village: "",
    rectangle: "",
    khasra: "",
  })

  useEffect(() => {
    // Add Spline script dynamically
    const script = document.createElement("script")
    script.type = "module"
    script.src = "https://unpkg.com/@splinetool/viewer@1.9.89/build/spline-viewer.js"
    script.onload = () => setIsLoaded(true)
    document.body.appendChild(script)

    return () => {
      // Make sure the script exists before trying to remove it
      if (script && document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  useEffect(() => {
    if (!isUrban && selectedDistrict) {
      setDivisions(divisionsByDistrict[selectedDistrict] || [])
      // Clear division and village selections when district changes
      setSelectedDivision("")
      setVillages([])
    }
  }, [selectedDistrict, isUrban])

  useEffect(() => {
    if (!isUrban && selectedDistrict && selectedDivision) {
      setVillages(villagesByDivision[selectedDistrict]?.[selectedDivision] || [])
    }
  }, [selectedDivision, selectedDistrict, isUrban])

  const handleUrbanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrbanFormData({
      ...urbanFormData,
      [e.target.name]: e.target.value,
    })
  }

  const handleRuralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRuralFormData({
      ...ruralFormData,
      [e.target.name]: e.target.value,
    })
  }

  const handleUrbanSelectChange = (name: keyof UrbanFormData, value: string) => {
    setUrbanFormData({
      ...urbanFormData,
      [name]: value,
    })
  }

  const handleRuralSelectChange = (name: keyof RuralFormData, value: string) => {
    if (name === "district") {
      setSelectedDistrict(value)
      setRuralFormData({
        ...ruralFormData,
        [name]: value,
        division: "",
        village: "",
      })
    } else if (name === "division") {
      setSelectedDivision(value)
      setRuralFormData({
        ...ruralFormData,
        [name]: value,
        village: "",
      })
    } else {
      setRuralFormData({
        ...ruralFormData,
        [name]: value,
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Encode the form data to pass as URL parameters
    const formDataToSubmit = isUrban ? urbanFormData : ruralFormData
    const params = new URLSearchParams({
      ...formDataToSubmit as any,
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
                  {/* Urban Fields */}
                  {isUrban ? (
                    <>
                      <motion.div variants={itemVariants} className="space-y-2">
                        <Label htmlFor="locality" className="text-white">Locality</Label>
                        <Input
                          id="locality"
                          name="locality"
                          value={urbanFormData.locality}
                          onChange={handleUrbanChange}
                          placeholder="Enter locality"
                          className="bg-black/50 border-gray-800 text-white"
                          required
                        />
                      </motion.div>

                      <motion.div variants={itemVariants} className="space-y-2">
                        <Label htmlFor="party_type" className="text-white">Select Party</Label>
                        <Select
                          name="party_type"
                          value={urbanFormData.party_type}
                          onValueChange={(value) => handleUrbanSelectChange("party_type", value as "first" | "second")}
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
                          {urbanFormData.party_type === "first" ? "First" : "Second"} Party Name
                        </Label>
                        <Input
                          id="party_name"
                          name="party_name"
                          value={urbanFormData.party_name}
                          onChange={handleUrbanChange}
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
                          value={urbanFormData.sro}
                          onChange={handleUrbanChange}
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
                          value={urbanFormData.reg_year}
                          onChange={handleUrbanChange}
                          placeholder="Enter registration year"
                          className="bg-black/50 border-gray-800 text-white"
                          type="number"
                          min="1900"
                          max={new Date().getFullYear()}
                          required
                        />
                      </motion.div>
                    </>
                  ) : (
                    // Rural Fields
                    <>
                      <motion.div variants={itemVariants} className="space-y-2">
                        <Label htmlFor="state" className="text-white">State</Label>
                        <Input
                          id="state"
                          name="state"
                          value={ruralFormData.state}
                          className="bg-black/50 border-gray-800 text-white"
                          disabled
                        />
                      </motion.div>

                      <motion.div variants={itemVariants} className="space-y-2">
                        <Label htmlFor="district" className="text-white">District</Label>
                        <Select
                          name="district"
                          value={ruralFormData.district}
                          onValueChange={(value) => handleRuralSelectChange("district", value)}
                        >
                          <SelectTrigger className="bg-black/50 border-gray-800 text-white">
                            <SelectValue placeholder="Select district" />
                          </SelectTrigger>
                          <SelectContent>
                            {delhiDistricts.map((district) => (
                              <SelectItem key={district} value={district}>
                                {district}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </motion.div>

                      <motion.div variants={itemVariants} className="space-y-2">
                        <Label htmlFor="division" className="text-white">Division</Label>
                        <Select
                          name="division"
                          value={ruralFormData.division}
                          onValueChange={(value) => handleRuralSelectChange("division", value)}
                          disabled={!selectedDistrict}
                        >
                          <SelectTrigger className="bg-black/50 border-gray-800 text-white">
                            <SelectValue placeholder="Select division" />
                          </SelectTrigger>
                          <SelectContent>
                            {divisions.map((division) => (
                              <SelectItem key={division} value={division}>
                                {division}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </motion.div>

                      <motion.div variants={itemVariants} className="space-y-2">
                        <Label htmlFor="village" className="text-white">Village</Label>
                        <Select
                          name="village"
                          value={ruralFormData.village}
                          onValueChange={(value) => handleRuralSelectChange("village", value)}
                          disabled={!selectedDivision}
                        >
                          <SelectTrigger className="bg-black/50 border-gray-800 text-white">
                            <SelectValue placeholder="Select village" />
                          </SelectTrigger>
                          <SelectContent>
                            {villages.map((village) => (
                              <SelectItem key={village} value={village}>
                                {village}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </motion.div>

                      <motion.div variants={itemVariants} className="space-y-2">
                        <Label htmlFor="rectangle" className="text-white">Rectangle</Label>
                        <Input
                          id="rectangle"
                          name="rectangle"
                          value={ruralFormData.rectangle}
                          onChange={handleRuralChange}
                          placeholder="Enter rectangle"
                          className="bg-black/50 border-gray-800 text-white"
                          required
                        />
                      </motion.div>

                      <motion.div variants={itemVariants} className="space-y-2">
                        <Label htmlFor="khasra" className="text-white">Khasra</Label>
                        <Input
                          id="khasra"
                          name="khasra"
                          value={ruralFormData.khasra}
                          onChange={handleRuralChange}
                          placeholder="Enter khasra"
                          className="bg-black/50 border-gray-800 text-white"
                          required
                        />
                      </motion.div>
                    </>
                  )}
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
