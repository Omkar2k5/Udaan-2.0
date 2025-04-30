"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [propertyType, setPropertyType] = useState<"urban" | "rural" | null>(null)

  useEffect(() => {
    const type = searchParams.get("type")
    const resultsParam = searchParams.get("results")
    
    if (type === "urban" || type === "rural") {
      setPropertyType(type)
      if (resultsParam) {
        try {
          const parsedResults = JSON.parse(resultsParam)
          setResults(parsedResults)
        } catch (error) {
          console.error("Error parsing results:", error)
        }
      }
    }
    setLoading(false)
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-8 text-white flex items-center justify-center">
        <p>Loading results...</p>
      </div>
    )
  }

  if (!propertyType || results.length === 0) {
    return (
      <div className="min-h-screen bg-black p-8 text-white flex flex-col items-center justify-center">
        <p className="mb-4">No results found</p>
        <Button 
          variant="outline" 
          className="text-white border-white hover:bg-white/10"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    )
  }

  // Define column headers based on property type
  const urbanColumns = [
    "S_No_",
    "Reg_No",
    "Reg_Date",
    "First Party Name",
    "Second Party Name",
    "Property Address",
    "Area",
    "Deed Type",
    "Property Type",
    "SRO",
    "Locality",
    "Registration Year",
    "Property ID"
  ]

  const ruralColumns = [
    "S_No_",
    "State",
    "District",
    "Division",
    "Village",
    "Khasra No",
    "Rectangle",
    "Area",
    "Property Value",
    "Encumbrance Status",
    "Name",
    "Address",
    "Property ID"
  ]

  const columns = propertyType === "urban" ? urbanColumns : ruralColumns

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="outline" 
            className="text-white border-white hover:bg-white/10"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>

        <h2 className="text-2xl font-bold text-white mb-6">
          {propertyType === "urban" ? "Urban Property" : "Rural Property"} Search Results
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-black/40 border border-gray-700 text-sm text-left">
            <thead>
              <tr className="bg-indigo-700 text-white">
                {columns.map((column) => (
                  <th key={column} className="px-4 py-2 border-b border-gray-600">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((row, idx) => (
                <tr key={idx} className="hover:bg-indigo-800/30 transition">
                  {columns.map((column) => (
                    <td key={column} className="px-4 py-2 border-b border-gray-700 text-white">
                      {row[column] || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
