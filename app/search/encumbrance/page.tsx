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

export default function EncumbranceSearchPage() {
  const router = useRouter()
  const { logout } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [companyName, setCompanyName] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
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

      // Log the parameters before navigation
    const params = new URLSearchParams({
      type: "encumbrance",
        results: JSON.stringify(sampleData)
      })
      console.log("Navigating with params:", Object.fromEntries(params))
      router.push(`/results?${params.toString()}`)
    } catch (error) {
      console.error("Error processing search:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Animation variants
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
            className="flex justify-center"
          >
            <motion.div variants={itemVariants} className="w-full max-w-md">
              <Card className="bg-black/70 border-gray-800 backdrop-blur-md shadow-xl">
                <CardHeader className="space-y-1">
                  <div className="flex items-center justify-center mb-2">
                    <div className="p-3 rounded-full bg-indigo-600/20">
                      <FileSearch className="h-6 w-6 text-indigo-400" />
              </div>
            </div>
                  <CardTitle className="text-2xl text-white text-center">
                    Company Search
                  </CardTitle>
                  <CardDescription className="text-gray-400 text-center">
                    Search for company details
                </CardDescription>
              </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="company_name" className="text-white">Company Name</Label>
                                  <Input
                        id="company_name"
                        name="company_name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Enter company name"
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
                          Search Company Details
                          </>
                        )}
                      </Button>
                  </form>
              </CardContent>
            </Card>
          </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
} 