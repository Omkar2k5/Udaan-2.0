import { useEffect } from "react"

interface SplineBackgroundProps {
  opacity?: number;
  url?: string;
}

export function SplineBackground({ 
  opacity = 0.6,
  url = "https://prod.spline.design/fKCmgDdSMnN7Ekd4/scene.splinecode"
}: SplineBackgroundProps) {
  useEffect(() => {
    // Ensure the spline-viewer script is loaded
    const script = document.createElement("script")
    script.type = "module"
    script.src = "https://unpkg.com/@splinetool/viewer@1.9.89/build/spline-viewer.js"
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  return (
    <div 
      className="absolute inset-0 z-0 overflow-hidden" 
      style={{ opacity }}
    >
      <spline-viewer 
        url={url}
        class="w-full h-full"
        style={{
          pointerEvents: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none"
        }}
      />
    </div>
  )
} 