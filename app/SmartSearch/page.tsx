"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Building, Home, Trees, FileText, Building2, User, Hash, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { NavBar } from "@/app/components/NavBar"
import { ParticleBackground } from "@/components/ui/particle-background"
import { SplineBackground } from "@/app/components/SplineBackground"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"

export default function SmartSearchPage() {
  const router = useRouter()
  const [searchParams, setSearchParams] = useState({
    fullName: "",
    propertyId: "",
    address: ""
  })
  const [activeTab, setActiveTab] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [results, setResults] = useState<any[]>([])

  const handleInputChange = (field: string, value: string) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSearch = () => {
    if (searchParams.fullName.trim() || searchParams.propertyId.trim() || searchParams.address.trim()) {
      const queryParams = new URLSearchParams()
      if (searchParams.fullName) queryParams.append("name", searchParams.fullName)
      if (searchParams.propertyId) queryParams.append("id", searchParams.propertyId)
      if (searchParams.address) queryParams.append("address", searchParams.address)
      queryParams.append("type", activeTab)
      router.push(`/results?${queryParams.toString()}`)
    }
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
      <SplineBackground />
      <NavBar showBackButton={true} />

      <div className="relative z-10 mt-16">
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-5xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">Smart Property Search</span>
            </h1>
            <p className="text-gray-400 max-w-xl mx-auto">
              Search across all property types, companies, and records in one place
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-black/70 border-gray-800 backdrop-blur-md shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-xl text-white mb-2">Enter Property Search Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-1 mb-6 bg-black/50">
                    <TabsTrigger value="all" className="data-[state=active]:bg-indigo-500/30 data-[state=active]:text-indigo-200 transition-all">
                      All Records
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-0">
                    <div className="grid gap-6">
                      <div className="grid gap-4">
                        <div className="relative">
                          <Label htmlFor="fullName" className="text-indigo-300 flex items-center mb-2">
                            <User className="h-4 w-4 mr-2" />
                            Full Name
                          </Label>
                          <Input
                            id="fullName"
                            type="text"
                            placeholder="Enter owner's full name..."
                            value={searchParams.fullName}
                            onChange={(e) => handleInputChange("fullName", e.target.value)}
                            className="bg-black/30 border-gray-700 h-12 pl-4 text-white focus:border-indigo-500"
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                          />
                        </div>

                        <div className="relative">
                          <Label htmlFor="propertyId" className="text-indigo-300 flex items-center mb-2">
                            <Hash className="h-4 w-4 mr-2" />
                            Property ID
                          </Label>
                          <Input
                            id="propertyId"
                            type="text"
                            placeholder="Enter property ID or registration number..."
                            value={searchParams.propertyId}
                            onChange={(e) => handleInputChange("propertyId", e.target.value)}
                            className="bg-black/30 border-gray-700 h-12 pl-4 text-white focus:border-indigo-500"
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                          />
                        </div>

                        <div className="relative">
                          <Label htmlFor="address" className="text-indigo-300 flex items-center mb-2">
                            <MapPin className="h-4 w-4 mr-2" />
                            Address
                          </Label>
                          <Input
                            id="address"
                            type="text"
                            placeholder="Enter property address or location..."
                            value={searchParams.address}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            className="bg-black/30 border-gray-700 h-12 pl-4 text-white focus:border-indigo-500"
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Urban Properties */}
                        <Card
  onClick={(e) => {
    e.stopPropagation(); // prevent any parent routing
    setSelectedCategory("urban");
    setResults([
      {
        S_No_: 1,
        Reg_No: 809,
        Reg_Date: "02-12-2022",
        "First Party Name": "NICOLE BURGESS",
        "Second Party Name": "ANNA HUMPHREY",
        "Property Address": "House No. 106-B, Sector 21",
        Area: "222 Sq. Feet",
        "Deed Type": "GIFT, GIFT WITH IN MC AREA",
        "Property Type": "Industrial",
        SRO: "",
        Locality: "Sector 21",
        "Registration Year": 2022,
        "Property ID": "23809039"
      }
    ]);
  }}
                          className="bg-black/40 border-indigo-900/30 hover:border-indigo-500/30 transition-all cursor-pointer group"
                        >
                          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <Building className="h-8 w-8 text-indigo-400 mb-2 group-hover:text-indigo-300 transition-colors" />
                            <p className="text-sm text-gray-400 group-hover:text-indigo-200 transition-colors">Urban Properties</p>
                          </CardContent>
                        </Card>

                        {/* Other cards (placeholders) */}
                        <Card className="bg-black/40 border-indigo-900/30 hover:border-indigo-500/30 transition-all cursor-pointer group">
                          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <Trees className="h-8 w-8 text-indigo-400 mb-2 group-hover:text-indigo-300 transition-colors" />
                            <p className="text-sm text-gray-400 group-hover:text-indigo-200 transition-colors">Rural Properties</p>
                          </CardContent>
                        </Card>

                        <Card className="bg-black/40 border-indigo-900/30 hover:border-indigo-500/30 transition-all cursor-pointer group">
                          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <FileText className="h-8 w-8 text-indigo-400 mb-2 group-hover:text-indigo-300 transition-colors" />
                            <p className="text-sm text-gray-400 group-hover:text-indigo-200 transition-colors">Encumbrance Records</p>
                          </CardContent>
                        </Card>

                        <Card className="bg-black/40 border-indigo-900/30 hover:border-indigo-500/30 transition-all cursor-pointer group">
                          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <Building2 className="h-8 w-8 text-indigo-400 mb-2 group-hover:text-indigo-300 transition-colors" />
                            <p className="text-sm text-gray-400 group-hover:text-indigo-200 transition-colors">Company Records</p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Table Output */}
                      {selectedCategory === "urban" && results.length > 0 && (
                        <div className="overflow-x-auto mt-6">
                          <table className="min-w-full text-sm text-white border border-indigo-800 bg-black/50 rounded-lg">
                            <thead className="bg-indigo-900 text-indigo-200">
                              <tr>
                                {Object.keys(results[0]).map((key) => (
                                  <th key={key} className="px-4 py-2 border border-indigo-800 text-left whitespace-nowrap">
                                    {key}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {results.map((item, idx) => (
                                <tr key={idx} className="hover:bg-indigo-950">
                                  {Object.values(item).map((val, i) => (
                                    <td key={i} className="px-4 py-2 border border-indigo-800 whitespace-nowrap">
                                      {val}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-center mt-8">
                  <Button
                    onClick={handleSearch}
                    className="relative bg-black/50 border-0 hover:bg-black/30 text-white px-10 py-6 text-lg rounded-full overflow-hidden group"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-indigo-500/60 to-purple-500/60 opacity-70 group-hover:opacity-100 transition-opacity"></span>
                    <span className="relative z-10 flex items-center bg-gradient-to-r from-indigo-200 to-purple-100 bg-clip-text text-transparent font-semibold">
                      <Search className="h-5 w-5 mr-2 text-indigo-200" />
                      Search Now
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      <ParticleBackground />
    </div>
  )
}
