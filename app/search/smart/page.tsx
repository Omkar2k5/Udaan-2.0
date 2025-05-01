"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Search, LogOut, FileSearch, Loader2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { ParticleBackground } from "@/components/ui/particle-background"
import { SplineBackground } from "@/components/ui/spline-background"

interface PropertyData {
  S_No_: number;
  Reg_No: number;
  Reg_Date: string;
  "First Party Name"?: string;
  "Second Party Name"?: string;
  "Property Address"?: string;
  Area: string;
  "Deed Type"?: string;
  "Property Type": string;
  SRO?: string;
  Locality?: string;
  "Registration Year"?: number;
  "Property ID": string;
  State?: string;
  District?: string;
  Division?: string;
  Village?: string;
  "Khasra No"?: string;
  "Registration Date"?: string;
  "Property Value"?: string;
  "Encumbrance Status"?: string;
  Name?: string;
  Address?: string;
}

interface SampleDataItem {
  source: string;
  data: PropertyData;
}

const sampleData: Record<string, SampleDataItem> = {
  "23809039": {
    "source": "urban",
    "data": {
      "S_No_": 1,
      "Reg_No": 809,
      "Reg_Date": "02-12-2022",
      "First Party Name": "NICOLE BURGESS",
      "Second Party Name": "ANNA HUMPHREY",
      "Property Address": "House No. 106-B, Sector 21",
      "Area": "222 Sq. Feet",
      "Deed Type": "GIFT, GIFT WITH IN MC AREA",
      "Property Type": "Industrial",
      "SRO": "SRO2",
      "Locality": "Sector 21",
      "Registration Year": 2022,
      "Property ID": "23809039"
    }
  },
  "37153378": {
    "source": "rural",
    "data": {
      "S_No_": 15,
      "State": "Delhi",
      "District": "North East Delhi",
      "Division": "Seelampur",
      "Village": "Jafrabad",
      "Khasra No": "148",
      "Property Type": "Mixed Use",
      "Registration Date": "27-06-2013",
      "Area": "2656 sq.ft.",
      "Property Value": "₹48,00,000",
      "Encumbrance Status": "Partially Encumbered",
      "Address": "Jafrabad village, Part-3/8",
      "Property ID": "37153378"
    }
  },
  "35909512": {
    "source": "rural",
    "data": {
      "S_No_": 17,
      "State": "Delhi",
      "District": "Central Delhi",
      "Division": "Paharganj",
      "Village": "Minto Road",
      "Khasra No": "27",
      "Property Type": "Commercial",
      "Registration Date": "16-11-2017",
      "Area": "3197 sq.ft.",
      "Property Value": "₹12,00,000",
      "Encumbrance Status": "Government Lien",
      "Name": "Anil, Sunil, sons of Rajendra",
      "Address": "Minto Road village, Part-2/6",
      "Property ID": "35909512"
    }
  }
}

export default function SmartSearchPage() {
  const router = useRouter()
  const { logout } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [searchType, setSearchType] = useState<"propertyId" | "name" | "address">("propertyId")
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let results: PropertyData[] = []

      // Search based on the selected type
      switch (searchType) {
        case "propertyId":
          if (sampleData[searchQuery]) {
            results.push(sampleData[searchQuery].data)
          }
          break
        case "name":
          // Search in both urban and rural data for matching names
          Object.values(sampleData).forEach(item => {
            const data = item.data
            if ((data["First Party Name"]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                data["Second Party Name"]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                data["Name"]?.toLowerCase().includes(searchQuery.toLowerCase()))) {
              results.push(data)
            }
          })
          break
        case "address":
          // Search in both urban and rural data for matching addresses
          Object.values(sampleData).forEach(item => {
            const data = item.data
            if ((data["Property Address"]?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                data["Address"]?.toLowerCase().includes(searchQuery.toLowerCase()))) {
              results.push(data)
            }
          })
          break
      }

      // Prepare parameters for navigation
      const params = new URLSearchParams({
        id: searchQuery,
        type: "all",
        results: JSON.stringify(results)
      })

      // Navigate to results page
      router.push(`/results?${params.toString()}`)
    } catch (error) {
      console.error("Error processing search:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black p-4 md:p-8 relative overflow-hidden">
      <SplineBackground />
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <Card className="bg-black/70 border-gray-800 backdrop-blur-md shadow-xl w-full max-w-md">
              <CardHeader className="space-y-1">
                <div className="flex items-center justify-center mb-2">
                  <div className="p-3 rounded-full bg-indigo-600/20">
                    <FileSearch className="h-6 w-6 text-indigo-400" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-white text-center">
                  Smart Property Search
                </CardTitle>
                <CardDescription className="text-gray-400 text-center">
                  Search by Property ID, Name, or Address
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="searchType" className="text-white">Search Type</Label>
                    <select
                      id="searchType"
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value as "propertyId" | "name" | "address")}
                      className="w-full bg-black/50 border-gray-800 text-white rounded-md p-2"
                    >
                      <option value="propertyId">Property ID</option>
                      <option value="name">Name</option>
                      <option value="address">Address</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="searchQuery" className="text-white">
                      {searchType === "propertyId" ? "Property ID" :
                       searchType === "name" ? "Name" :
                       "Address"}
                    </Label>
                    <Input
                      id="searchQuery"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={`Enter ${searchType === "propertyId" ? "Property ID" :
                                  searchType === "name" ? "Name" :
                                  "Address"}`}
                      className="bg-black/50 border-gray-800 text-white"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
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
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 