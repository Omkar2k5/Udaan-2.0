"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Search, Download } from "lucide-react"
import { NavBar } from "@/app/components/NavBar"
import { ParticleBackground } from "@/components/ui/particle-background"
import { SplineBackground } from "@/app/components/SplineBackground"
import * as XLSX from 'xlsx'

interface CompanyData {
  encumbrance: {
    "Operating Revenue": string;
    "Authorized Share Capital": string;
    "Paid-up Capital": string;
    "Debut Loan Remaining": string;
    "Name": string;
    "CIN": string;
    "Property ID": string;
  };
  company_details: {
    "Name": string;
    "CIN": string;
    "Company Type": string;
    "Registrar of Companies": string;
    "Stock Listings": string;
    "Property ID": string;
  };
}

// Sample company data
const companyData: Record<string, CompanyData> = {
  "U36377KA6571": {
    "encumbrance": {
      "Operating Revenue": "Over ₹510 crore",
      "Authorized Share Capital": "₹2565 crore",
      "Paid-up Capital": "₹3112 crore",
      "Debut Loan Remaining": "₹0",
      "Name": "HCL Technologies",
      "CIN": "U36377KA6571",
      "Property ID": "82527939"
    },
    "company_details": {
      "Name": "HCL Technologies",
      "CIN": "U36377KA6571",
      "Company Type": "Public, Non-Government Company",
      "Registrar of Companies": "RoC-Bangalore",
      "Stock Listings": "NSE & BSE (Ticker: HCLTECH)",
      "Property ID": "82527939"
    }
  }
}

export default function CompanySearchPage() {
  const router = useRouter()
  const [cin, setCin] = useState("")
  const [companyResults, setCompanyResults] = useState<CompanyData | null>(null)

  const handleSearch = () => {
    if (cin.trim()) {
      const company = companyData[cin.toUpperCase()]
      setCompanyResults(company || null)
    } else {
      setCompanyResults(null)
    }
  }

  const handleDownload = () => {
    if (!companyResults) return

    // Prepare data for Excel
    const excelData = [
      {
        "Sheet": "Company Details",
        "Data": Object.entries(companyResults.company_details).map(([key, value]) => ({
          "Field": key,
          "Value": value
        }))
      },
      {
        "Sheet": "Encumbrance Details",
        "Data": Object.entries(companyResults.encumbrance).map(([key, value]) => ({
          "Field": key,
          "Value": value
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
    const fileName = `${companyResults.company_details.Name}_${companyResults.company_details.CIN}.xlsx`

<<<<<<< HEAD
    try {
      // Sample company data for Oracle Financial Limited
      const sampleData = [
        {
          "CIN": "L85110KA2018PLC506562",
          "Company Name": "ORACLE FINANCIAL LIMITED",
          "ROC Name": "ROC Bangalore",
          "Registration Number": "506562",
          "Date of Incorporation": "20/03/1991",
          "Email Id": "info@oracle.com",
          "Listed in Stock Exchange(s) (Y/N)": "Yes",
          "Category of Company": "Company limited by shares",
          "Subcategory of the Company": "Non-government company",
          "Class of Company": "Public",
          "ACTIVE compliance": "ACTIVE Compliant",
          "Authorised Capital (Rs)": "23,00,00,00,000",
          "Paid up Capital (Rs)": "60,56,89,111",
          "Date of last AGM": "26/06/2024",
          "Date of Balance Sheet": "31/03/2024",
          "Company Status": "Active"
        }
      ]

      // Encode the form data and results to pass as URL parameters
      const params = new URLSearchParams({
        ...formData,
        type: "company",
        results: JSON.stringify(sampleData)
      })

      // Navigate to results page with search parameters
      router.push(`/results?${params.toString()}`)
    } catch (error) {
      console.error("Error processing search:", error)
    } finally {
      setIsLoading(false)
    }
=======
    // Save file
    XLSX.writeFile(wb, fileName)
>>>>>>> d0c096556d0ebe6f46a29256227642393e6e12e8
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
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">Company Search</span>
              </h1>
              {companyResults && (
                <Button
                  onClick={handleDownload}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Data
                </Button>
              )}
            </div>
            <p className="text-gray-400 max-w-xl mx-auto">
              Search for company details and property information using CIN
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-black/70 border-gray-800 backdrop-blur-md shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-xl text-white mb-2">Enter Company CIN</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4">
                  <Input
                    type="text"
                    placeholder="Enter company CIN (e.g., U36377KA6571)..."
                    value={cin}
                    onChange={(e) => setCin(e.target.value)}
                    className="bg-black/30 border-gray-700 h-12 pl-4 text-white focus:border-indigo-500"
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <Button
                    onClick={handleSearch}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>

                {companyResults && (
                  <div className="mt-6 space-y-6">
                    <Card className="bg-black/50 border-white/20">
                      <CardHeader>
                        <CardTitle className="text-white">Company Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          {Object.entries(companyResults.company_details).map(([key, value]) => (
                            <div key={key} className="space-y-1">
                              <p className="text-sm text-gray-400">{key}</p>
                              <p className="text-white">{value}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-black/50 border-white/20">
                      <CardHeader>
                        <CardTitle className="text-white">Encumbrance Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          {Object.entries(companyResults.encumbrance).map(([key, value]) => (
                            <div key={key} className="space-y-1">
                              <p className="text-sm text-gray-400">{key}</p>
                              <p className="text-white">{value}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      <ParticleBackground />
    </div>
  )
} 