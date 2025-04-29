"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sun, Moon, Globe, Search, Bot, LogOut } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useTheme } from "@/app/context/theme-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function NavBar({ showBackButton = false }) {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [language, setLanguage] = useState<string>("English")

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <Button 
              variant="ghost" 
              className="relative text-white text-base overflow-hidden transition-all duration-300 group" 
              onClick={() => router.push("/")}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></span>
              <ArrowLeft className="h-5 w-5 mr-2 text-indigo-300" /> 
              <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                Home
              </span>
            </Button>
          )}
          {!showBackButton && (
            <div className="text-white text-base font-medium">
              Welcome, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent font-semibold">{user?.displayName || user?.email || "User"}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleTheme} 
            className="relative text-white text-base px-4 overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            {theme === "dark" ? (
              <Sun className="h-5 w-5 mr-2 text-indigo-300" />
            ) : (
              <Moon className="h-5 w-5 mr-2 text-indigo-300" />
            )}
            <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              {theme === "dark" ? "Light" : "Dark"}
            </span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push("/SmartSearch")} 
            className="relative text-white text-base px-4 overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            <Search className="h-5 w-5 mr-2 text-indigo-300" />
            <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              Property Search
            </span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative text-white text-base px-4 overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <Globe className="h-5 w-5 mr-2 text-indigo-300" />
                <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                  {language}
                </span>
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
            className="relative text-white text-base px-4 overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            <Bot className="h-5 w-5 mr-2 text-indigo-300" />
            <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              Prop Bot
            </span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={logout} 
            className="relative text-white text-base px-4 overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            <LogOut className="h-5 w-5 mr-2 text-indigo-300" />
            <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              Logout
            </span>
          </Button>
        </div>
      </div>
    </div>
  )
} 