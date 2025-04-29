"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function ParticleBackground() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    })

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (dimensions.width === 0) return null

  const particles = Array.from({ length: 30 }).map((_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 bg-blue-400 rounded-full"
      initial={{
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        opacity: Math.random() * 0.5 + 0.3,
      }}
      animate={{
        y: [null, Math.random() * dimensions.height],
        x: [null, Math.random() * dimensions.width],
      }}
      transition={{
        duration: Math.random() * 20 + 10,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      }}
      style={{
        width: `${Math.random() * 4 + 1}px`,
        height: `${Math.random() * 4 + 1}px`,
      }}
    />
  ))

  return <div className="absolute inset-0 z-0 opacity-30">{particles}</div>
} 