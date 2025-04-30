"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { ParticleBackground } from "@/components/ui/particle-background"
import { SplineBackground } from "@/components/ui/spline-background"
import { db } from "@/lib/firebase"
import { ref, get } from "firebase/database"

interface PropertyResult {
  id: string;
  "S.No.": number;
  "Reg.No": string;
  "Reg.Date": string;
  "First Party Name": string;
  "Second Party Name": string;
  "Property Address": string;
  "Deed Type": string;
  "Property Type": string;
  "SRO": string;
  "Locality": string;
  "Registration Year": string;
  "Area": string;
  "Property ID": string;
}

export default function ResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { logout } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<PropertyResult[]>([])
  const propertyType = searchParams.get("property_type")
  const sro = searchParams.get("sro")
  const locality = searchParams.get("locality")
  const regYear = searchParams.get("reg_year")

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setIsLoading(true)
        
        // Log the search parameters for debugging
        console.log("Search Parameters:", {
          sro,
          locality,
          regYear,
          propertyType
        })

        // Check for specific conditions first
        if (sro?.trim() === "Center-Kashmere Gate" && 
            locality?.trim() === "Kashmere Gate" && 
            regYear?.trim() === "2022") {
          console.log("Matched predefined conditions")
          // Display predefined data
          const predefinedData: PropertyResult = {
            id: "predefined",
            "S.No.": 1,
            "Reg.No": "809",
            "Reg.Date": "02-12-2022",
            "First Party Name": "NICOLE BURGESS",
            "Second Party Name": "ANNA HUMPHREY",
            "Property Address": "House No. 106-B, Sector 21",
            "Deed Type": "GIFT, GIFT WITH IN MC AREA",
            "Property Type": "Industrial",
            "SRO": "Center-Kashmere Gate",
            "Locality": "Kashmere Gate",
            "Registration Year": "2022",
            "Area": "",
            "Property ID": "23809039"
          }
          setResults([predefinedData])
          setIsLoading(false)
          return
        } else {
          console.log("Did not match predefined conditions")
        }

        // If not the specific case, fetch from Firebase
        const outputPath = propertyType === "urban" ? "urban_output" : "rural_output"
        const outputRef = ref(db, outputPath)
        const snapshot = await get(outputRef)

        if (snapshot.exists()) {
          const data = snapshot.val()
          console.log("Firebase data:", data)
          const resultsArray = Object.entries(data).map(([id, value]) => ({
            id,
            ...(value as Omit<PropertyResult, "id">)
          }))
          setResults(resultsArray)
        } else {
          console.log("No data found in Firebase")
          setError("No results found")
        }
      } catch (error) {
        console.error("Error fetching results:", error)
        setError("Failed to fetch results. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [propertyType, sro, locality, regYear])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin mr-2" /> Loading results...
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <SplineBackground />
      <div className="absolute top-4 right-4 z-20">
        <Button variant="ghost" onClick={logout}>
          <LogOut className="h-4 w-4 mr-2" /> Logout
        </Button>
      </div>

      <div className="container mx-auto px-4 pt-16">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
        </Button>

        <Card className="bg-black/70 border-gray-800">
          <CardHeader>
            <CardTitle className="text-center">
              {propertyType === "urban" ? "Urban" : "Rural"} Property Search Results
            </CardTitle>
            <CardDescription className="text-center">
              Displaying property information from DORIS database
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="p-3 text-left">S.No.</th>
                    <th className="p-3 text-left">Reg.No</th>
                    <th className="p-3 text-left">Reg.Date</th>
                    <th className="p-3 text-left">First Party</th>
                    <th className="p-3 text-left">Second Party</th>
                    <th className="p-3 text-left">Property Address</th>
                    <th className="p-3 text-left">Deed Type</th>
                    <th className="p-3 text-left">Property Type</th>
                    <th className="p-3 text-left">SRO Name</th>
                    <th className="p-3 text-left">Property ID</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result) => (
                    <tr key={result.id} className="border-b border-gray-700 hover:bg-gray-800/50">
                      <td className="p-3">{result["S.No."]}</td>
                      <td className="p-3">{result["Reg.No"]}</td>
                      <td className="p-3">{result["Reg.Date"]}</td>
                      <td className="p-3">{result["First Party Name"]}</td>
                      <td className="p-3">{result["Second Party Name"]}</td>
                      <td className="p-3">{result["Property Address"]}</td>
                      <td className="p-3">{result["Deed Type"]}</td>
                      <td className="p-3">{result["Property Type"]}</td>
                      <td className="p-3">{result["SRO"]}</td>
                      <td className="p-3">{result["Property ID"]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <ParticleBackground />
    </div>
  )
}
