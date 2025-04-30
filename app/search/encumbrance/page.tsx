"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Building2, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { NavBar } from "@/app/components/NavBar"
import { ParticleBackground } from "@/components/ui/particle-background"
import { SplineBackground } from "@/app/components/SplineBackground"

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

// Sample TCS data
const tcsData: CompanyData = {
  "encumbrance": {
    "Operating Revenue": "Over ₹2,00,000 crore",
    "Authorized Share Capital": "₹1,000 crore",
    "Paid-up Capital": "₹800 crore",
    "Debut Loan Remaining": "₹0",
    "Name": "Tata Consultancy Services",
    "CIN": "L67120MH1995PLC082118",
    "Property ID": "TCS123456"
  },
  "company_details": {
    "Name": "Tata Consultancy Services",
    "CIN": "L67120MH1995PLC082118",
    "Company Type": "Public, Non-Government Company",
    "Registrar of Companies": "RoC-Mumbai",
    "Stock Listings": "NSE & BSE (Ticker: TCS)",
    "Property ID": "TCS123456"
  }
}

export default function EncumbranceSearchPage() {
  const router = useRouter()
  const [companyName, setCompanyName] = useState("")
  const [companyResults, setCompanyResults] = useState<CompanyData | null>(null)

  const handleSearch = () => {
    if (companyName.toLowerCase().includes("tcs") || companyName.toLowerCase().includes("tata")) {
      setCompanyResults(tcsData)
    } else {
      setCompanyResults(null)
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
              <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">Company Search</span>
            </h1>
            <p className="text-gray-400 max-w-xl mx-auto">
              Search for company details and encumbrance information
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-black/70 border-gray-800 backdrop-blur-md shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-xl text-white mb-2">Enter Company Name</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-4">
                  <Input
                    type="text"
                    placeholder="Enter company name..."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
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