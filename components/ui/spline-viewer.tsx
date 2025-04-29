"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface SplineViewerProps {
  url: string
  className?: string
}

// Register the custom element with TypeScript
if (typeof window !== "undefined") {
  if (!customElements.get("spline-viewer")) {
    class SplineViewerElement extends HTMLElement {
      constructor() {
        super()
      }
    }
    customElements.define("spline-viewer", SplineViewerElement)
  }
}

export function SplineViewer({ url, className = "" }: SplineViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
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
  }, [])

  const handleError = () => {
    setError("Failed to load 3D scene")
    setIsLoading(false)
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  if (isLoading) {
    return <Skeleton className={`w-full h-full ${className}`} />
  }

  return (
    // @ts-ignore - Custom element
    <spline-viewer
      url={url}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
    />
  )
} 