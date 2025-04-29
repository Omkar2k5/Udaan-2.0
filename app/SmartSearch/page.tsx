"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Building, Home, Trees, FileText, Building2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { NavBar } from "@/app/components/NavBar"
import { ParticleBackground } from "@/components/ui/particle-background"
import { SplineBackground } from "@/app/components/SplineBackground"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SmartSearchPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const handleSearch = () => {
    // In a real app, this would search and navigate to results
    if (searchQuery.trim()) {
      router.push(`/results?query=${encodeURIComponent(searchQuery)}&type=${activeTab}`)
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
      {/* Spline 3D Background */}
      <SplineBackground />

      {/* Navigation Bar */}
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
                <CardTitle className="text-xl text-white mb-2">What are you looking for?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-4 mb-6 bg-black/50">
                    <TabsTrigger value="all" className="data-[state=active]:bg-indigo-500/30 data-[state=active]:text-indigo-200 transition-all">
                      All Records
                    </TabsTrigger>
                    <TabsTrigger value="urban" className="data-[state=active]:bg-indigo-500/30 data-[state=active]:text-indigo-200 transition-all">
                      Urban Properties
                    </TabsTrigger>
                    <TabsTrigger value="rural" className="data-[state=active]:bg-indigo-500/30 data-[state=active]:text-indigo-200 transition-all">
                      Rural Properties
                    </TabsTrigger>
                    <TabsTrigger value="company" className="data-[state=active]:bg-indigo-500/30 data-[state=active]:text-indigo-200 transition-all">
                      Companies
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="mt-0">
                    <div className="grid gap-6">
                      <div className="flex items-center relative">
                        <Input
                          type="text"
                          placeholder="Search by name, address, pin code, or property details..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="bg-black/30 border-gray-700 h-14 pl-4 pr-20 text-white"
                          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        />
                        <Button 
                          onClick={handleSearch} 
                          className="absolute right-2 h-10 w-16 bg-gradient-to-r from-indigo-500/60 to-purple-500/60 border-0 hover:opacity-90"
                        >
                          <Search className="h-5 w-5" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="bg-black/40 border-indigo-900/30 hover:border-indigo-500/30 transition-all cursor-pointer group">
                          <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                            <Building className="h-8 w-8 text-indigo-400 mb-2 group-hover:text-indigo-300 transition-colors" />
                            <p className="text-sm text-gray-400 group-hover:text-indigo-200 transition-colors">Urban Properties</p>
                          </CardContent>
                        </Card>
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
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="urban" className="mt-0">
                    <div className="flex items-center relative">
                      <Input
                        type="text"
                        placeholder="Search urban properties by address, pin code, or registration number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-black/30 border-gray-700 h-14 pl-4 pr-20 text-white"
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      />
                      <Button 
                        onClick={handleSearch} 
                        className="absolute right-2 h-10 w-16 bg-gradient-to-r from-indigo-500/60 to-purple-500/60 border-0 hover:opacity-90"
                      >
                        <Search className="h-5 w-5" />
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="rural" className="mt-0">
                    <div className="flex items-center relative">
                      <Input
                        type="text"
                        placeholder="Search rural properties by survey number, village name, or land type..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-black/30 border-gray-700 h-14 pl-4 pr-20 text-white"
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      />
                      <Button 
                        onClick={handleSearch} 
                        className="absolute right-2 h-10 w-16 bg-gradient-to-r from-indigo-500/60 to-purple-500/60 border-0 hover:opacity-90"
                      >
                        <Search className="h-5 w-5" />
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="company" className="mt-0">
                    <div className="flex items-center relative">
                      <Input
                        type="text"
                        placeholder="Search companies by name, CIN, director details, or charges..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-black/30 border-gray-700 h-14 pl-4 pr-20 text-white"
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      />
                      <Button 
                        onClick={handleSearch} 
                        className="absolute right-2 h-10 w-16 bg-gradient-to-r from-indigo-500/60 to-purple-500/60 border-0 hover:opacity-90"
                      >
                        <Search className="h-5 w-5" />
                      </Button>
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

      {/* Animated Particles */}
      <ParticleBackground />
    </div>
  )
}
