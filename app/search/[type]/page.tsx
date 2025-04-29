"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Search, LogOut, Building, Trees, AlertCircle, Loader2, SquareDashed } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ParticleBackground } from "@/components/ui/particle-background"
import { db } from "@/lib/firebase"
import { ref, get } from "firebase/database"
import { SplineBackground } from "@/app/components/SplineBackground"

// --- Define Interfaces Directly Here ---
interface RuralLocationData {
  districts: string[];
  divisionsByDistrict: Record<string, string[]>;
  villagesByDivision: Record<string, Record<string, string[]>>;
}

interface UrbanSROData {
  name: string;
  localities: string[];
}

interface UrbanLocationData {
  [sroKey: string]: UrbanSROData;
}

interface LocationData {
  rural?: RuralLocationData; // Make optional for initial state
  urban?: UrbanLocationData; // Make optional for initial state
}
// --- End Interfaces ---

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
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [locationData, setLocationData] = useState<LocationData | null>(null)

  const propertyType = params.type as string
  const isUrban = propertyType === "urban"

  // --- Re-introduce variable declarations (will be populated by Firebase) ---
  const divisionsByDistrict: Record<string, string[]> = locationData?.rural?.divisionsByDistrict || {};
  const villagesByDivision: Record<string, Record<string, string[]>> = locationData?.rural?.villagesByDivision || {};
  // --- End Re-introduction ---

  // State for dropdowns derived from fetched data
  const [delhiDistricts, setDelhiDistricts] = useState<string[]>([])
  const [sroOptions, setSroOptions] = useState<{ key: string; name: string }[]>([])
  const [localityOptions, setLocalityOptions] = useState<string[]>([])

  // Rural specific state
  const [selectedDistrict, setSelectedDistrict] = useState<string>("")
  const [selectedDivision, setSelectedDivision] = useState<string>("")
  const [divisions, setDivisions] = useState<string[]>([])
  const [villages, setVillages] = useState<string[]>([])

  // Form data states
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
    const fetchData = async () => {
      setIsDataLoading(true);
      setError(null);
      try {
        console.log("Fetching location data...");
        const locationsRef = ref(db, 'locations');
        const snapshot = await get(locationsRef);
        
        if (snapshot.exists()) {
          const data = snapshot.val() as LocationData;
          console.log("Raw location data:", data);
          setLocationData(data);

          if (data.rural && Array.isArray(data.rural.districts)) {
            console.log("Found districts:", data.rural.districts);
            setDelhiDistricts(data.rural.districts);
          } else {
            console.warn("No districts found in data:", data.rural);
            setDelhiDistricts([]);
            setError("No districts found in the database.");
          }

          if (data.urban) {
            const sros = Object.entries(data.urban).map(([key, value]) => ({
              key: key,
              name: value.name
            }));
            setSroOptions(sros);
          }
        } else {
          console.error("No data found in snapshot");
          setError("No location data found in the database.");
        }
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load location data from the database.");
      } finally {
        setIsDataLoading(false);
      }
    };
    fetchData();
  }, []); // Remove db dependency as it's stable

  useEffect(() => {
    if (!isUrban && selectedDistrict && locationData?.rural?.divisionsByDistrict) {
      setDivisions(locationData.rural.divisionsByDistrict[selectedDistrict] || [])
      setSelectedDivision("")
      setVillages([])
    }
  }, [selectedDistrict, isUrban, locationData])

  useEffect(() => {
    if (!isUrban && selectedDistrict && selectedDivision && locationData?.rural?.villagesByDivision) {
      setVillages(locationData.rural.villagesByDivision[selectedDistrict]?.[selectedDivision] || [])
    }
  }, [selectedDivision, selectedDistrict, isUrban, locationData])

  useEffect(() => {
    if (isUrban && urbanFormData.sro && locationData?.urban) {
      const selectedSroData = locationData.urban[urbanFormData.sro]
      setLocalityOptions(selectedSroData?.localities || [])
    } else {
      setLocalityOptions([])
    }
  }, [urbanFormData.sro, isUrban, locationData])

  const handleUrbanChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
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

  if (isDataLoading) {
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
                              <SelectValue placeholder={delhiDistricts.length ? "Select district" : "No districts available"} />
                            </SelectTrigger>
                            <SelectContent 
                              className="bg-black/90 border-gray-800 text-white max-h-[300px] overflow-y-auto"
                              position="popper"
                            >
                              {delhiDistricts.length > 0 ? (
                                delhiDistricts.map((district) => (
                                  <SelectItem 
                                    key={district} 
                                    value={district}
                                    className="text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer"
                                  >
                                    {district}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem 
                                  value="none" 
                                  disabled 
                                  className="text-gray-500"
                                >
                                  No districts available
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          {error && (
                            <p className="text-red-400 text-sm mt-1">{error}</p>
                          )}
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

  if (error && !locationData) {
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
                              <SelectValue placeholder={delhiDistricts.length ? "Select district" : "No districts available"} />
                            </SelectTrigger>
                            <SelectContent 
                              className="bg-black/90 border-gray-800 text-white max-h-[300px] overflow-y-auto"
                              position="popper"
                            >
                              {delhiDistricts.length > 0 ? (
                                delhiDistricts.map((district) => (
                                  <SelectItem 
                                    key={district} 
                                    value={district}
                                    className="text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer"
                                  >
                                    {district}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem 
                                  value="none" 
                                  disabled 
                                  className="text-gray-500"
                                >
                                  No districts available
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          {error && (
                            <p className="text-red-400 text-sm mt-1">{error}</p>
                          )}
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
                            <SelectValue placeholder={delhiDistricts.length ? "Select district" : "No districts available"} />
                          </SelectTrigger>
                          <SelectContent 
                            className="bg-black/90 border-gray-800 text-white max-h-[300px] overflow-y-auto"
                            position="popper"
                          >
                            {delhiDistricts.length > 0 ? (
                              delhiDistricts.map((district) => (
                                <SelectItem 
                                  key={district} 
                                  value={district}
                                  className="text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer"
                                >
                                  {district}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem 
                                value="none" 
                                disabled 
                                className="text-gray-500"
                              >
                                No districts available
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        {error && (
                          <p className="text-red-400 text-sm mt-1">{error}</p>
                        )}
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
