"use client"

import { useEffect, useLayoutEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface SplineViewerProps {
  url: string
  className?: string
}

// Use useLayoutEffect on client side, useEffect on server side
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

export function SplineViewer({ url, className = "" }: SplineViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)

  // Handle client-side initialization
  useIsomorphicLayoutEffect(() => {
    setIsClient(true)

    const loadSplineViewer = async () => {
      try {
        // Check if the script is already loaded
        if (!document.querySelector('script[src*="@splinetool/viewer"]')) {
          const script = document.createElement("script")
          script.type = "module"
          script.src = "https://unpkg.com/@splinetool/viewer@1.9.89/build/spline-viewer.js"
          
          // Create a promise to handle script loading
          await new Promise((resolve, reject) => {
            script.onload = resolve
            script.onerror = reject
            document.body.appendChild(script)
          })
        }
        setIsLoading(false)
      } catch (err) {
        setError("Failed to load Spline viewer")
        setIsLoading(false)
      }
    }

    loadSplineViewer()

    // Cleanup function to remove the script when component unmounts
    return () => {
      const script = document.querySelector('script[src*="@splinetool/viewer"]')
      if (script) {
        document.body.removeChild(script)
      }
    }
  }, [])

  const handleError = () => {
    setError("Failed to load 3D scene")
    setIsLoading(false)
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  // Show nothing during SSR
  if (!isClient) {
    return <div className={`w-full h-full ${className}`} suppressHydrationWarning />
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`} suppressHydrationWarning>
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  if (isLoading) {
    return <Skeleton className={`w-full h-full ${className}`} suppressHydrationWarning />
  }

  return (
    // @ts-ignore - Custom element from Spline library
    <spline-viewer
      url={url}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
      suppressHydrationWarning
    />
  )
} 