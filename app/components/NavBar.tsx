"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sun, Moon, Globe, Search, Bot, LogOut } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function NavBar({ showBackButton = false }) {
  const router = useRouter()
  const { logout } = useAuth()
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [language, setLanguage] = useState<string>("English")

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800 px-4 py-2">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {showBackButton && (
            <Button variant="ghost" className="text-white" onClick={() => router.push("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Home
            </Button>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleTheme} 
            className="text-white hover:bg-white/10"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 mr-2" />
            ) : (
              <Moon className="h-4 w-4 mr-2" />
            )}
            {theme === "dark" ? "Light" : "Dark"}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push("/property-search")} 
            className="text-white hover:bg-white/10"
          >
            <Search className="h-4 w-4 mr-2" />
            Property Search
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <Globe className="h-4 w-4 mr-2" />
                {language}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black/90 border-gray-800 text-white">
              <DropdownMenuItem onClick={() => setLanguage("English")}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("Hindi")}>
                Hindi
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("Tamil")}>
                Tamil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("Telugu")}>
                Telugu
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push("/prop-bot")} 
            className="text-white hover:bg-white/10"
          >
            <Bot className="h-4 w-4 mr-2" />
            Prop Bot
          </Button>
          
          <Button variant="ghost" size="sm" onClick={logout} className="text-white hover:bg-white/10">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
} 