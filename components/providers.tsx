"use client"

import { ThemeProvider as NextThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/context/auth-context"
import { ThemeProvider } from "@/app/context/theme-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <ThemeProvider>
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </NextThemeProvider>
  )
} 