"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import Link from "next/link"
import { signIn, signInWithGoogle } from "@/lib/firebase-auth"
import { FcGoogle } from "react-icons/fc"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await signIn(formData.email, formData.password)
      router.push("/")
    } catch (error: any) {
      setError(error.message || "Failed to login. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setError("")
    
    try {
      await signInWithGoogle()
      router.push("/")
    } catch (error: any) {
      setError(error.message || "Failed to login with Google. Please try again.")
    } finally {
      setGoogleLoading(false)
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
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Spline 3D Background */}
      <div className="absolute inset-0 z-0 opacity-60">
        <spline-viewer 
          url="https://prod.spline.design/fKCmgDdSMnN7Ekd4/scene.splinecode"
          class="w-full h-full"
          loading-anim="true"
          events-target="global"
        />
      </div>

      {/* Content */}
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="z-10 w-full max-w-md">
        <motion.div variants={itemVariants}>
          <Card className="bg-black/70 border-gray-800 backdrop-blur-md shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-white text-center">Login</CardTitle>
              <CardDescription className="text-gray-400 text-center">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 bg-black/50 border-gray-800 text-white"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      suppressHydrationWarning
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 bg-black/50 border-gray-800 text-white"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      suppressHydrationWarning
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                      suppressHydrationWarning
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                {error && (
                  <div className="text-red-500 text-sm text-center">{error}</div>
                )}
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isLoading || googleLoading}
                  suppressHydrationWarning
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
              
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-black/70 text-gray-400">OR</span>
                </div>
              </div>
              
              <Button
                type="button"
                variant="outline"
                className="w-full border-gray-700 bg-black/50 text-white hover:bg-black/30 flex items-center justify-center gap-2"
                onClick={handleGoogleSignIn}
                disabled={isLoading || googleLoading}
                suppressHydrationWarning
              >
                <FcGoogle className="h-5 w-5" />
                {googleLoading ? "Signing in..." : "Sign in with Google"}
              </Button>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <div className="text-sm text-gray-400 text-center">
                Don't have an account?{" "}
                <Link href="/signup" className="text-blue-500 hover:text-blue-400">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
