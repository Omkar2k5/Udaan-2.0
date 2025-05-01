"use client"

import { useEffect } from "react"

interface SplineBackgroundProps {
  opacity?: number;
  url?: string;
}

export function SplineBackground({ 
  opacity = 0.6,
  url = "https://prod.spline.design/fKCmgDdSMnN7Ekd4/scene.splinecode"
}: SplineBackgroundProps) {
  return (
    <div 
      className="absolute inset-0 z-0 overflow-hidden" 
      style={{ opacity }}
    >
      <spline-viewer 
        url={url}
        class="w-full h-full"
        loading-anim="true"
        events-target="global"
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