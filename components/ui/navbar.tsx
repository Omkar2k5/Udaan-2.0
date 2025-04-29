"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LogOut, Menu, User } from "lucide-react"
import { useAuth } from "@/context/auth-context"

export function Navbar({ className }: { className?: string }) {
  const { logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  return (
    <nav className={cn("w-full bg-black/50 backdrop-blur-md border-b border-gray-800 z-50", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image
                src="/logo-Mit.png"
                alt="UDDNA Logo"
                width={100}
                height={40}
                className="object-contain"
              />
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link 
                href="/dashboard" 
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link 
                href="/property-type" 
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium"
              >
                Search
              </Link>
              <Link 
                href="/help" 
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium"
              >
                Help
              </Link>
            </div>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
              <User className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-300 hover:text-white"
              onClick={logout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log out
            </Button>
          </div>
          <div className="flex items-center md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/dashboard"
              className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              href="/property-type"
              className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white"
            >
              Search
            </Link>
            <Link
              href="/help"
              className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white"
            >
              Help
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <User className="h-8 w-8 rounded-full text-gray-300" />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">User</div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-gray-300 hover:text-white"
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
} 