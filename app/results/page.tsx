"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, LogOut } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { ParticleBackground } from "@/components/ui/particle-background"
import { SplineBackground } from "@/app/components/SplineBackground"

interface PropertyData {
  sno: number
  reg_no: string
  reg_date: string
  first_party: string
  second_party: string
  property_address: string
  deed_type: string
  property_type: string
  sro_name: string
}

export default function ResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { logout } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [propertyData, setPropertyData] = useState<PropertyData[]>([])

  useEffect(() => {
    // Simulate API call with the search parameters
    const fetchData = async () => {
      try {
        // In a real application, you would make an API call here
        // For now, we'll create mock data based on the search parameters
        const locality = searchParams.get("locality") || ""
        const partyType = searchParams.get("party_type") || "first"
        const partyName = searchParams.get("party_name") || ""
        const sro = searchParams.get("sro") || ""
        const regYear = searchParams.get("reg_year") || ""
        const propertyType = searchParams.get("property_type") || "urban"

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Generate 5 mock entries
        const mockData: PropertyData[] = Array.from({ length: 5 }).map((_, index) => ({
          sno: index + 1,
          reg_no: `REG/${regYear || "2023"}/${String(index + 1).padStart(3, "0")}`,
          reg_date: `${regYear || "2023"}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
          first_party: partyType === "first" ? partyName : `Sample First Party ${index + 1}`,
          second_party: partyType === "second" ? partyName : `Sample Second Party ${index + 1}`,
          property_address: `${index + 1}${["st", "nd", "rd", "th"][Math.min(3, index)]} Floor, ${locality}, Delhi`,
          deed_type: ["Sale Deed", "Gift Deed", "Lease Deed", "Mortgage Deed", "Transfer Deed"][index],
          property_type: propertyType,
          sro_name: sro || "Delhi SRO",
        }))

        setPropertyData(mockData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
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
        <Button variant="ghost" className="text-white mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
        </Button>

        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-7xl mx-auto">
          <Card className="bg-black/70 border-gray-800 backdrop-blur-md shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white text-center">Property Search Results</CardTitle>
              <CardDescription className="text-gray-400 text-center">
                Displaying property information from DORIS database
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs uppercase bg-gray-800/50 text-gray-400">
                      <tr>
                        <th className="px-4 py-3">S.No.</th>
                        <th className="px-4 py-3">Reg.No</th>
                        <th className="px-4 py-3">Reg.Date</th>
                        <th className="px-4 py-3">First Party</th>
                        <th className="px-4 py-3">Second Party</th>
                        <th className="px-4 py-3">Property Address</th>
                        <th className="px-4 py-3">Deed Type</th>
                        <th className="px-4 py-3">Property Type</th>
                        <th className="px-4 py-3">SRO Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {propertyData.map((data) => (
                        <tr key={data.sno} className="border-b border-gray-800 hover:bg-gray-800/30">
                          <td className="px-4 py-3">{data.sno}</td>
                          <td className="px-4 py-3">{data.reg_no}</td>
                          <td className="px-4 py-3">{data.reg_date}</td>
                          <td className="px-4 py-3">{data.first_party}</td>
                          <td className="px-4 py-3">{data.second_party}</td>
                          <td className="px-4 py-3">{data.property_address}</td>
                          <td className="px-4 py-3">{data.deed_type}</td>
                          <td className="px-4 py-3">{data.property_type}</td>
                          <td className="px-4 py-3">{data.sro_name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <ParticleBackground />
    </div>
  )
}
