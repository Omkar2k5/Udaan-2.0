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
import { SplineBackground } from "@/components/ui/spline-background"
import { DelhiKhasraMap } from "@/components/ui/delhi-khasra-map"
import { db } from "@/lib/firebase"
import { ref, get } from "firebase/database"

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
  const [isMounted, setIsMounted] = useState(false)

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
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // Only run on the client after mounting
    if (!isMounted) {
      console.log('Effect skipped: Component not yet mounted.');
      return;
    }

    console.log('Component mounted. Starting data fetch setup...');
    
    // Timeout to prevent hanging indefinitely
    const fetchTimeoutMs = 15000; // 15 seconds timeout
    
    // Initialize fallback data from delhi_locations.json
    const fallbackData = {
      rural: {
        districts: ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"],
        divisionsByDistrict: {
          "Central Delhi": ["Civil Lines", "Karol Bagh", "Kotwali"]
          // Add other divisions as needed
        },
        villagesByDivision: {
          // Add villages as needed
        }
      },
      urban: {
        "SRI": { name: "Central-Kashmere Gate", localities: ["Kashmere Gate", "Ajmeri Gate*", "Darya Ganj", "Civil Lines*", "British India Colony*", "Curzon Road*", "Bahadur Shah Zafar Marg*"] },
        "SRIII": { name: "Central-Asaf Ali Road", localities: ["Asaf Ali Road*", "Connaught Place Ext. C Zone", "Copernicus Marg", "Ajmal Khan Road", "Baba Kharak Singh Marg*", "Gole Market*"] },
        "SRVIII": { name: "East-Geeta Colony", localities: ["Geeta Colony", "Jhilmil", "Jheel Kuranja", "Shastri Nagar", "Gandhi Nagar*", "L.M. Bundh Complex*"] },
        "SRVIIIA": { name: "East-Preet Vihar", localities: ["Preet Vihar", "Vivek Vihar", "Karkardooma", "Dilshad Garden", "Ramprastha", "Mandoli"] },
        "SRVII": { name: "New Delhi-INA", localities: ["INA Colony", "Jorbagh", "Lodhi Estate", "Kidwai Nagar", "Sarojini Nagar", "Kasturba Gandhi Marg"] }
        // Add other SROs as needed
      }
    };
    
    const fetchData = async () => {
      // Check for db instance availability right before fetching
      if (!db) {
        console.error('Firebase db instance is not available. Using fallback data.');
        setError('Database connection failed. Using local data instead.');
        setLocationData(fallbackData);
        processFallbackData(fallbackData);
        setIsDataLoading(false);
        return;
      }

      setIsDataLoading(true);
      setError(null);
      
      // Create a promise that resolves after fetchTimeoutMs
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`Firebase fetch timed out after ${fetchTimeoutMs}ms`)), fetchTimeoutMs);
      });
      
      try {
        // Default to fallback data
        let completeData = { ...fallbackData };
        
        // Fetch urban data
        try {
          console.log('Attempting to get data from Firebase ref: /urban/');
          const urbanRef = ref(db, '/urban/');
          
          // Race against timeout
          const urbanSnapshot = await Promise.race([
            get(urbanRef),
            timeoutPromise
          ]) as any;
          
          if (urbanSnapshot && typeof urbanSnapshot === 'object' && typeof urbanSnapshot.exists === 'function' && urbanSnapshot.exists()) {
            const urbanData = urbanSnapshot.val();
            console.log('Firebase urban data snapshot exists:', urbanData);
            completeData.urban = urbanData;
            
            // Process urban data
            if (urbanData && typeof urbanData === 'object') {
              const sros = Object.entries(urbanData).map(([key, value]: [string, any]) => ({
                key: key,
                name: value?.name || key
              }));
              console.log('Mapped SROs from Firebase:', sros);
              setSroOptions(sros);
            }
          } else {
            console.warn('Urban data not found in Firebase or timed out. Using fallback urban data.');
          }
        } catch (urbanError) {
          console.error('Error fetching urban data:', urbanError);
          console.warn('Using fallback urban data due to error.');
        }
        
        // Fetch rural data
        try {
          console.log('Attempting to get data from Firebase ref: /rural/');
          const ruralRef = ref(db, '/rural/');
          
          // Race against timeout
          const ruralSnapshot = await Promise.race([
            get(ruralRef),
            timeoutPromise
          ]) as any;
          
          if (ruralSnapshot && typeof ruralSnapshot === 'object' && typeof ruralSnapshot.exists === 'function' && ruralSnapshot.exists()) {
            const ruralData = ruralSnapshot.val();
            console.log('Firebase rural data snapshot exists:', ruralData);
            completeData.rural = ruralData;
            
            // Set Delhi districts from rural data
            if (ruralData && Array.isArray(ruralData.districts)) {
              setDelhiDistricts(ruralData.districts);
            }
          } else {
            console.warn('Rural data not found in Firebase or timed out. Using fallback rural data.');
          }
        } catch (ruralError) {
          console.error('Error fetching rural data:', ruralError);
          console.warn('Using fallback rural data due to error.');
        }
        
        // Set the complete location data
        setLocationData(completeData);
        console.log('Complete location data set:', completeData);
        
      } catch (err) {
        console.error("Error during Firebase data fetch:", err);
        setError("Failed to load from database. Using local data.");
        setLocationData(fallbackData);
        processFallbackData(fallbackData);
      } finally {
        console.log('Setting isDataLoading to false.');
        setIsDataLoading(false);
      }
    };
    
    // Process the fallback data
    const processFallbackData = (data: any) => {
      console.log('Processing fallback data:', data);
      
      if (data.rural) {
        // Set districts
        if (Array.isArray(data.rural.districts)) {
          setDelhiDistricts(data.rural.districts);
          console.log('Set districts from fallback:', data.rural.districts);
        }
        
        // Initialize divisions if a district is already selected
        if (selectedDistrict && data.rural.divisionsByDistrict && data.rural.divisionsByDistrict[selectedDistrict]) {
          setDivisions(data.rural.divisionsByDistrict[selectedDistrict]);
          console.log('Set divisions for district:', selectedDistrict, data.rural.divisionsByDistrict[selectedDistrict]);
        }
        
        // Initialize villages if district and division are already selected
        if (selectedDistrict && selectedDivision && 
            data.rural.villagesByDivision && 
            data.rural.villagesByDivision[selectedDistrict] && 
            data.rural.villagesByDivision[selectedDistrict][selectedDivision]) {
          setVillages(data.rural.villagesByDivision[selectedDistrict][selectedDivision]);
          console.log('Set villages for division:', selectedDivision, 
            data.rural.villagesByDivision[selectedDistrict][selectedDivision]);
        }
      }
      
      if (data.urban && typeof data.urban === 'object') {
        const sros = Object.entries(data.urban).map(([key, value]: [string, any]) => ({
          key: key,
          name: value?.name || key
        }));
        console.log('Using fallback SROs:', sros);
        setSroOptions(sros);
      }
    };

    fetchData();
  }, [isMounted]); // Depend only on isMounted

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
      if (selectedSroData && Array.isArray(selectedSroData.localities)) {
        setLocalityOptions(selectedSroData.localities)
      } else {
        console.warn(`Localities array not found or invalid for SRO: ${urbanFormData.sro}`)
        setLocalityOptions([])
      }
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

  if (error) {
    return (
      <div className="min-h-screen bg-black p-4 md:p-8 relative overflow-hidden">
        <SplineBackground />
        <div className="absolute top-4 right-4 z-20">
          <Button variant="ghost" size="sm" onClick={logout} className="text-white hover:bg-white/10">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-white text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
            <p className="text-red-500">{error}</p>
            <Button 
              variant="outline" 
              className="mt-4 text-white border-white hover:bg-white/10"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-black p-4 md:p-8 relative overflow-hidden">
        <SplineBackground />
        <div className="absolute top-4 right-4 z-20">
          <Button variant="ghost" size="sm" onClick={logout} className="text-white hover:bg-white/10">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-white text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading location data...</p>
          </div>
        </div>
      </div>
    )
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

          <div className="max-w-7xl mx-auto">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="grid md:grid-cols-2 gap-6 items-start"
            >
              {/* Left Side - Form Section */}
              <motion.div variants={itemVariants}>
                <Card className="bg-black/70 border-gray-800 backdrop-blur-md shadow-xl">
                  <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-2">
                      <div className={`p-3 rounded-full ${isUrban ? "bg-purple-600/20" : "bg-green-600/20"}`}>
                        {isUrban ? (
                          <Building className="h-6 w-6 text-purple-400" />
                        ) : (
                          <Trees className="h-6 w-6 text-green-400" />
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-2xl text-white text-center">
                      {isUrban ? "Urban Property Search" : "Rural Property Search"}
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-center">
                      {isUrban
                        ? "Search for property details in urban areas of Delhi"
                        : "Search for property details in rural areas of Delhi"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Urban Fields */}
                      {isUrban ? (
                        <>
                          <motion.div variants={itemVariants} className="space-y-2">
                            <Label htmlFor="sro" className="text-white">SRO</Label>
                            <Select
                              name="sro"
                              value={urbanFormData.sro}
                              onValueChange={(value) => handleUrbanSelectChange("sro", value)}
                            >
                              <SelectTrigger className="bg-black/50 border-gray-800 text-white">
                                <SelectValue placeholder="Select SRO" />
                              </SelectTrigger>
                              <SelectContent>
                                {sroOptions.map((sro) => (
                                  <SelectItem key={sro.key} value={sro.key}>
                                    {sro.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </motion.div>

                          <motion.div variants={itemVariants} className="space-y-2">
                            <Label htmlFor="locality" className="text-white">Locality</Label>
                            <Select
                              name="locality"
                              value={urbanFormData.locality}
                              onValueChange={(value) => handleUrbanSelectChange("locality", value)}
                              disabled={!urbanFormData.sro}
                            >
                              <SelectTrigger className="bg-black/50 border-gray-800 text-white">
                                <SelectValue placeholder="Select locality" />
                              </SelectTrigger>
                              <SelectContent>
                                {localityOptions.map((locality) => (
                                  <SelectItem key={locality} value={locality}>
                                    {locality}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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
                      className={`w-full ${
                        isUrban ? "bg-purple-600 hover:bg-purple-700" : "bg-green-600 hover:bg-green-700"
                      } text-white`}
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
                          Search Property Details
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
              
              {/* Right Side - Map Section (Only for Rural) */}
              {!isUrban && (
                <motion.div variants={itemVariants} className="sticky top-4">
                  <Card className="bg-black/70 border-gray-800 backdrop-blur-md shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-xl text-white">Delhi Khasra Map</CardTitle>
                      <CardDescription className="text-gray-400">
                        Interactive map showing selected location details
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <DelhiKhasraMap 
                        district={ruralFormData.district}
                        division={ruralFormData.division}
                        village={ruralFormData.village}
                        rectangle={ruralFormData.rectangle}
                        khasra={ruralFormData.khasra}
                        height={550}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      
      <ParticleBackground />
    </div>
  )
}
