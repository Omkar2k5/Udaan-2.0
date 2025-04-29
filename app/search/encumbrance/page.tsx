"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { motion } from "framer-motion"
import { Building, ChevronLeft, FileSearch, Globe, Home, Loader2, LogOut, MapPin, Send } from "lucide-react"

// UI Components
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ParticleBackground } from "@/components/ui/particle-background"
import { SplineBackground } from "@/app/components/SplineBackground"

// Firebase
import { useAuth } from "@/context/auth-context"
import { db } from "@/lib/firebase"
import { ref, get } from "firebase/database"

// Form schema
const formSchema = z.object({
  assetCategory: z.literal("movable"),
  assetType: z.enum(["residential", "commercial", "other"]),
  surveyNumber: z.string().min(1, "Survey number is required"),
  plotNumber: z.string().min(1, "Plot number is required"),
  houseNumber: z.string().min(1, "House/flat number is required"),
  floorNumber: z.string().min(1, "Floor number is required"),
  projectName: z.string().min(1, "Project name is required"),
  locality: z.string().min(1, "Locality is required"),
  state: z.string().min(1, "State is required"),
  district: z.string().min(1, "District is required"),
  city: z.string().min(1, "City is required"),
  pinCode: z.string().regex(/^\d{6}$/, "Pin code must be a 6-digit number"),
});

// Types
interface LocationData {
  states: string[];
  districtsByState: Record<string, string[]>;
  citiesByDistrict: Record<string, Record<string, string[]>>;
}

type FormValues = z.infer<typeof formSchema>;

export default function EncumbranceSearchPage() {
  const router = useRouter()
  const { logout } = useAuth()
  const [locationData, setLocationData] = useState<LocationData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [districts, setDistricts] = useState<string[]>([])
  const [cities, setCities] = useState<string[]>([])

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
    },
  })

  // Watch for state/district changes to update dropdowns
  const watchState = form.watch("state")
  const watchDistrict = form.watch("district")

  // Load location data from Firebase
  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const locationsRef = ref(db, 'locations/encumbrance')
        const snapshot = await get(locationsRef)

        if (snapshot.exists()) {
          setLocationData(snapshot.val() as LocationData)
        } else {
          console.warn('No location data found')
        }
      } catch (err) {
        console.error('Error fetching location data:', err)
      }
    }

    fetchLocationData()
  }, [db])

  // Update districts when state changes
  useEffect(() => {
    if (watchState && locationData?.districtsByState) {
      setDistricts(locationData.districtsByState[watchState] || [])
      setCities([])
      form.setValue("district", "")
      form.setValue("city", "")
    }
  }, [watchState, locationData, form])

  // Update cities when district changes
  useEffect(() => {
    if (watchState && watchDistrict && locationData?.citiesByDistrict) {
      setCities(locationData.citiesByDistrict[watchState]?.[watchDistrict] || [])
      form.setValue("city", "")
    }
  }, [watchState, watchDistrict, locationData, form])

  // Handle form submission
  function onSubmit(data: FormValues) {
    setIsLoading(true)
    
    // Encode the form data to pass as URL parameters
    const params = new URLSearchParams({
      ...data,
      type: "encumbrance",
    }).toString()

    // Navigate to results page with search parameters
    router.push(`/results?${params}`)
  }

  // Animation variants
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-black p-4 md:p-8 relative overflow-hidden">
    <SplineBackground />
    {/* Logout Button */}
    <div className="absolute top-4 right-4 z-20">
      <Button variant="ghost" size="sm" onClick={logout} className="text-white hover:bg-white/10">
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </div>
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-black/30 border-b border-white/10">
        <div className="container flex items-center justify-between h-16 px-4">
          <Button 
            variant="ghost" 
            onClick={() => router.push("/property-type")}
            className="text-white hover:bg-white/10"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <div className="text-lg font-medium">Encumbrance Search</div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={logout}
            className="text-white hover:bg-white/10"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container px-4 py-8 max-w-3xl mx-auto">
        <motion.div 
          initial="hidden" 
          animate="show" 
          variants={containerAnimation}
          className="space-y-8"
        >
          {/* Page title */}
          <motion.div variants={itemAnimation} className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="bg-indigo-600/20 p-4 rounded-full">
                <FileSearch className="h-8 w-8 text-indigo-400" />
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Encumbrance Certificate</h1>
            <p className="text-gray-400 max-w-md mx-auto">
              Enter property details to search for encumbrance information and obtain a certificate
            </p>
          </motion.div>
          
          {/* Form card */}
          <motion.div variants={itemAnimation}>
            <Card className="border border-white/10 bg-black/40 backdrop-blur-xl shadow-xl overflow-hidden">
              <CardHeader className="border-b border-white/10 bg-white/5">
                <CardTitle>Property Information</CardTitle>
                <CardDescription className="text-gray-400">
                  Fill in all details to search encumbrance records
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <Tabs defaultValue="basic" className="w-full">
                      <TabsList className="w-full bg-black/50 border border-white/10">
                        <TabsTrigger value="basic" className="flex-1">Basic Info</TabsTrigger>
                        <TabsTrigger value="property" className="flex-1">Property Details</TabsTrigger>
                        <TabsTrigger value="location" className="flex-1">Location</TabsTrigger>
                      </TabsList>
                      
                      {/* Basic Info Tab */}
                      <TabsContent value="basic" className="pt-4 space-y-4">
                        <div className="flex items-center gap-2">
                          <Building className="text-indigo-400 h-5 w-5 flex-shrink-0" />
                          <div className="text-lg font-medium">Asset Information</div>
                        </div>
                        <Separator className="bg-white/10" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="assetCategory"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Asset Category</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    disabled
                                    className="bg-black/50 border-white/20 text-white/70"
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="assetType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Asset Type</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="bg-black/50 border-white/20">
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="bg-gray-950 border-white/20">
                                    <SelectItem value="residential">Residential</SelectItem>
                                    <SelectItem value="commercial">Commercial</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="surveyNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Survey Number</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Enter survey number"
                                    className="bg-black/50 border-white/20"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="plotNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Plot Number</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Enter plot number"
                                    className="bg-black/50 border-white/20"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </TabsContent>
                      
                      {/* Property Details Tab */}
                      <TabsContent value="property" className="pt-4 space-y-4">
                        <div className="flex items-center gap-2">
                          <Home className="text-indigo-400 h-5 w-5 flex-shrink-0" />
                          <div className="text-lg font-medium">Property Specifics</div>
                        </div>
                        <Separator className="bg-white/10" />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="houseNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>House/Flat Number</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Enter house/flat number"
                                    className="bg-black/50 border-white/20"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="floorNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Floor Number</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Enter floor number"
                                    className="bg-black/50 border-white/20"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                          <FormField
                            control={form.control}
                            name="projectName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Project/Society Name</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Enter project or society name"
                                    className="bg-black/50 border-white/20"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="locality"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Locality/Sector</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="Enter locality or sector"
                                    className="bg-black/50 border-white/20"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </TabsContent>
                      
                      {/* Location Tab */}
                      <TabsContent value="location" className="pt-4 space-y-4">
                        <div className="flex items-center gap-2">
                          <Globe className="text-indigo-400 h-5 w-5 flex-shrink-0" />
                          <div className="text-lg font-medium">Geographic Location</div>
                        </div>
                        <Separator className="bg-white/10" />
                        
                        <div className="grid grid-cols-1 gap-4">
                          <FormField
                            control={form.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  value={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="bg-black/50 border-white/20">
                                      <SelectValue placeholder="Select state" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="bg-gray-950 border-white/20 max-h-[200px]">
                                    {locationData?.states?.map((state) => (
                                      <SelectItem key={state} value={state}>
                                        {state}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="district"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>District</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  value={field.value}
                                  disabled={!watchState}
                                >
                                  <FormControl>
                                    <SelectTrigger className="bg-black/50 border-white/20">
                                      <SelectValue placeholder="Select district" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="bg-gray-950 border-white/20 max-h-[200px]">
                                    {districts.map((district) => (
                                      <SelectItem key={district} value={district}>
                                        {district}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City/Town/Village</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  value={field.value}
                                  disabled={!watchDistrict}
                                >
                                  <FormControl>
                                    <SelectTrigger className="bg-black/50 border-white/20">
                                      <SelectValue placeholder="Select city" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="bg-gray-950 border-white/20 max-h-[200px]">
                                    {cities.map((city) => (
                                      <SelectItem key={city} value={city}>
                                        {city}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                          <FormField
                            control={form.control}
                            name="pinCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>PIN Code</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                      {...field}
                                      placeholder="Enter 6-digit PIN code"
                                      className="bg-black/50 border-white/20 pl-10"
                                      maxLength={6}
                                    />
                                  </div>
                                </FormControl>
                                <FormDescription className="text-gray-400 text-xs">
                                  Enter a valid 6-digit Indian postal code
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                    
                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Search Encumbrance Records
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Footer */}
          <motion.div variants={itemAnimation} className="text-center text-sm text-gray-500 py-4">
            <p>© {new Date().getFullYear()} Uddan Property Services</p>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
} 