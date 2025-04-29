"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { User } from "firebase/auth"
import { onAuthStateChange, signOut } from "@/lib/firebase-auth"
import { useRouter, usePathname } from "next/navigation"

interface AuthContextType {
  user: User | null
  loading: boolean
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user)
      setLoading(false)

      // Redirect logic
      if (!user) {
        // If not logged in and not on login or signup page, redirect to login
        if (pathname !== "/login" && pathname !== "/signup") {
          router.push("/login")
        }
      } else {
        // If logged in and on login or signup page, redirect to home
        if (pathname === "/login" || pathname === "/signup") {
          router.push("/")
        }
      }
    })

    return () => unsubscribe()
  }, [pathname, router])

  const logout = async () => {
    try {
      await signOut()
      router.push("/login")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return <AuthContext.Provider value={{ user, loading, logout }}>{children}</AuthContext.Provider>
}
