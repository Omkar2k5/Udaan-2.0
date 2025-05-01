"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download } from "lucide-react"
import { useRouter } from "next/navigation"
import * as XLSX from 'xlsx'

interface PropertyData {
  S_No_: number;
  Reg_No?: number;
  Reg_Date?: string;
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

// Sample data for demonstration
const sampleData: Record<string, { source: string; data: PropertyData }> = {
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

interface PropertyData {
  S_No_: number;
  Reg_No?: number;
  Reg_Date?: string;
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

// Sample data for demonstration
const sampleData: Record<string, { source: string; data: PropertyData }> = {
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

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [results, setResults] = useState<PropertyData[]>([])
  const [loading, setLoading] = useState(true)
  const [propertyType, setPropertyType] = useState<"urban" | "rural" | "company" | "all" | null>(null)

  useEffect(() => {
    const type = searchParams.get("type")
    const id = searchParams.get("id")
    const name = searchParams.get("name")
    const address = searchParams.get("address")
    const resultsParam = searchParams.get("results")
    
    if (type === "urban" || type === "rural" || type === "company" || type === "all") {
      setPropertyType(type)
      
      if (resultsParam) {
        try {
          const parsedResults = JSON.parse(resultsParam)
          setResults(parsedResults)
        } catch (error) {
          console.error("Error parsing results:", error)
        }
      } else if (id && sampleData[id]) {
        // If we have an ID, fetch the data from sampleData
        setResults([sampleData[id].data])
      } else if (name) {
        // If we have a name, search through sampleData for matching First Party Name
        const matchingResults = Object.values(sampleData)
          .filter(item => item.data["First Party Name"]?.toLowerCase().includes(name.toLowerCase()))
          .map(item => item.data)
        setResults(matchingResults)
      } else if (address) {
        // If we have an address, search through sampleData for matching Property Address
        const matchingResults = Object.values(sampleData)
          .filter(item => {
            const propertyAddress = item.data["Property Address"]?.toLowerCase() || ""
            const searchAddress = address.toLowerCase()
            return propertyAddress.includes(searchAddress)
          })
          .map(item => item.data)
        setResults(matchingResults)
      }
    }
    setLoading(false)
  }, [searchParams])

  const handleDownload = () => {
    if (results.length === 0) return

    // Prepare data for Excel
    const excelData = [
      {
        "Sheet": "Property Details",
        "Data": results.map(result => ({
          ...result,
          "Property Type": propertyType === "urban" ? "Urban" : 
                         propertyType === "rural" ? "Rural" : 
                         propertyType === "company" ? "Company" : "All"
        }))
      }
    ]

    // Create workbook
    const wb = XLSX.utils.book_new()

    // Add sheets
    excelData.forEach(({ Sheet, Data }) => {
      const ws = XLSX.utils.json_to_sheet(Data)
      XLSX.utils.book_append_sheet(wb, ws, Sheet)
    })

    // Generate file name
    const fileName = `Property_Search_Results_${new Date().toISOString().split('T')[0]}.xlsx`

    // Save file
    XLSX.writeFile(wb, fileName)
  }

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
    "Property Type",
    "Registration Date",
    "Area",
    "Property Value",
    "Encumbrance Status",
    "Name",
    "Address",
    "Property ID"
  ]

  const companyColumns = [
    "CIN",
    "Company Name",
    "ROC Name",
    "Registration Number",
    "Date of Incorporation",
    "Email Id",
    "Listed in Stock Exchange(s) (Y/N)",
    "Category of Company",
    "Subcategory of the Company",
    "Class of Company",
    "ACTIVE compliance",
    "Authorised Capital (Rs)",
    "Paid up Capital (Rs)",
    "Date of last AGM",
    "Date of Balance Sheet",
    "Company Status"
  ]

  // For all search, determine columns based on the first result's properties
  const getAllColumns = () => {
    if (results.length === 0) return []
    const firstResult = results[0]
    const allColumns = new Set<string>()
    
    // Add all possible columns
    urbanColumns.forEach(col => allColumns.add(col))
    ruralColumns.forEach(col => allColumns.add(col))
    
    // Filter out columns that don't exist in the first result
    return Array.from(allColumns).filter(col => col in firstResult)
  }

  const columns = propertyType === "urban" ? urbanColumns : 
                 propertyType === "rural" ? ruralColumns : 
                 propertyType === "company" ? companyColumns :
                 getAllColumns()

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="outline" 
          className="text-white border-white hover:bg-white/10"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
        {results.length > 0 && (
          <Button
            onClick={handleDownload}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Results
          </Button>
        )}
      </div>

<<<<<<< HEAD
        <h2 className="text-2xl font-bold text-white mb-6">
          {propertyType === "urban" ? "Urban Property" : 
           propertyType === "rural" ? "Rural Property" : 
           propertyType === "company" ? "Company" :
           "Property"} Search Results
        </h2>
=======
      <h2 className="text-2xl font-bold text-white mb-6">
        {propertyType === "urban" ? "Urban Property" : 
         propertyType === "rural" ? "Rural Property" : 
         propertyType === "company" ? "Company" :
         "Property"} Search Results
      </h2>
>>>>>>> d0c096556d0ebe6f46a29256227642393e6e12e8

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
                        {row[column as keyof PropertyData] || "-"}
                      </td>
                ))}
              </tr>
<<<<<<< HEAD
            </thead>
            <tbody>
              {results.map((row, idx) => (
                <tr key={idx} className="hover:bg-indigo-800/30 transition">
                  {columns.map((column) => (
                    <td key={column} className="px-4 py-2 border-b border-gray-700 text-white">
                      {row[column as keyof PropertyData] || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
=======
            ))}
          </tbody>
        </table>
>>>>>>> d0c096556d0ebe6f46a29256227642393e6e12e8
      </div>
    </div>
  )
}