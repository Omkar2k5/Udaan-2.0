"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface DelhiKhasraMapProps {
  district: string
  division: string
  village: string
  rectangle?: string
  khasra?: string
  height?: number | string
  width?: string | number
}

export function DelhiKhasraMap({ 
  district, 
  division, 
  village, 
  rectangle, 
  khasra,
  height = 600, 
  width = '100%' 
}: DelhiKhasraMapProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Delhi map boundaries
  const delhiBounds = {
    north: 28.88,
    south: 28.40,
    east: 77.40,
    west: 76.80
  }
  
  // District level coordinates with zoom levels
  const districtCoordinates: Record<string, { lat: number; lng: number; zoom: number }> = {
    "North Delhi": { lat: 28.7288, lng: 77.1933, zoom: 12 },
    "South Delhi": { lat: 28.5398, lng: 77.2490, zoom: 12 },
    "East Delhi": { lat: 28.6544, lng: 77.2906, zoom: 12 },
    "West Delhi": { lat: 28.6663, lng: 77.0469, zoom: 12 },
    "Central Delhi": { lat: 28.6181, lng: 77.2386, zoom: 12 },
    "New Delhi": { lat: 28.6139, lng: 77.2090, zoom: 12 },
    "North West Delhi": { lat: 28.7183, lng: 77.0636, zoom: 12 },
    "South West Delhi": { lat: 28.5823, lng: 77.0351, zoom: 12 },
    "North East Delhi": { lat: 28.6846, lng: 77.2746, zoom: 12 },
    "Shahdara": { lat: 28.6811, lng: 77.2935, zoom: 12 }
  }
  
  // Division level coordinates
  const divisionCoordinates: Record<string, Record<string, { lat: number; lng: number; zoom: number }>> = {
    "North Delhi": {
      "Model Town": { lat: 28.7192, lng: 77.1887, zoom: 14 },
      "Civil Lines": { lat: 28.6814, lng: 77.2206, zoom: 14 },
    },
    "South Delhi": {
      "Hauz Khas": { lat: 28.5535, lng: 77.2008, zoom: 14 },
      "Mehrauli": { lat: 28.5145, lng: 77.1855, zoom: 14 },
      "Saket": { lat: 28.5256, lng: 77.2132, zoom: 14 },
      "Vasant Kunj": { lat: 28.5381, lng: 77.1590, zoom: 14 },
    },
    // Add more as needed
  }
  
  // Village level coordinates with higher zoom
  const villageCoordinates: Record<string, Record<string, Record<string, { lat: number; lng: number; zoom: number }>>> = {
    "South Delhi": {
      "Hauz Khas": {
        "Shahpur Jat": { lat: 28.5489, lng: 77.2080, zoom: 16 },
        "Hauz Khas Village": { lat: 28.5535, lng: 77.1942, zoom: 16 },
        "SDA": { lat: 28.5462, lng: 77.2043, zoom: 16 },
      },
      "Mehrauli": {
        "Mehrauli Village": { lat: 28.5177, lng: 77.1826, zoom: 16 },
        "Lado Sarai": { lat: 28.5305, lng: 77.1894, zoom: 16 },
      }
    },
    // Add more as needed
  }
  
  // Get map URL based on selections
  const getMapUrl = () => {
    // Get position based on selections
    let position = { lat: 28.6139, lng: 77.2090, zoom: 10 } // Default to Delhi
    
    if (district && district in districtCoordinates) {
      position = districtCoordinates[district]
      
      if (division && divisionCoordinates[district]?.[division]) {
        position = divisionCoordinates[district][division]
        
        if (village && villageCoordinates[district]?.[division]?.[village]) {
          position = villageCoordinates[district][division][village]
        }
      }
    }
    
    // Add parameters for rectangle and khasra if provided
    let khasraParam = ''
    if (rectangle && khasra) {
      khasraParam = `&query=Rectangle:${rectangle},Khasra:${khasra}`
    }
    
    // We'd use a real API endpoint like the GSDL one in production
    return `https://www.openstreetmap.org/export/embed.html?bbox=${position.lng - 0.01},${position.lat - 0.01},${position.lng + 0.01},${position.lat + 0.01}&layer=mapnik&marker=${position.lat},${position.lng}&zoom=${position.zoom}${khasraParam}`
  }
  
  // Update the iframe when selections change
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    try {
      setLoading(true)
      
      // Small delay to show loading state
      const timer = setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = getMapUrl()
          setLoading(false)
        }
      }, 300)
      
      return () => clearTimeout(timer)
    } catch (err) {
      console.error('Error updating map:', err)
      setError('Failed to update map. Please try again later.')
      setLoading(false)
    }
  }, [district, division, village, rectangle, khasra])
  
  // Map container style
  const containerStyle = {
    height: typeof height === 'number' ? `${height}px` : height,
    width: typeof width === 'number' ? `${width}px` : width,
    border: '1px solid #444',
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    position: 'relative' as const,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
  }
  
  const overlayStyle = {
    position: 'absolute' as const,
    top: '10px',
    left: '10px',
    background: 'rgba(0,0,0,0.7)',
    padding: '12px',
    borderRadius: '8px',
    color: 'white',
    zIndex: 1000,
    fontSize: '14px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
  }
  
  return (
    <div style={{ position: 'relative' }}>
      {(district || division || village) && (
        <div style={overlayStyle}>
          {district && <div><strong>District:</strong> {district}</div>}
          {division && <div><strong>Division:</strong> {division}</div>}
          {village && <div><strong>Village:</strong> {village}</div>}
          {rectangle && <div><strong>Rectangle:</strong> {rectangle}</div>}
          {khasra && <div><strong>Khasra:</strong> {khasra}</div>}
        </div>
      )}
      
      <div style={containerStyle} className="relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
            <div className="text-center">
              <Skeleton className="h-[40px] w-[200px] bg-gray-700/50 mb-2" />
              <Skeleton className="h-[20px] w-[150px] bg-gray-700/50" />
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-20">
            <div className="text-white text-center p-4">
              <div className="text-red-400 mb-2">⚠️ {error}</div>
              <button 
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm"
                onClick={() => {
                  setError(null)
                  setLoading(true)
                  
                  if (iframeRef.current) {
                    iframeRef.current.src = getMapUrl()
                    setLoading(false)
                  }
                }}
              >
                Retry
              </button>
            </div>
          </div>
        )}
        
        <iframe 
          ref={iframeRef}
          src={getMapUrl()}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: '8px'
          }}
          onLoad={() => setLoading(false)}
          onError={() => {
            setError('Failed to load map. Please try again later.')
            setLoading(false)
          }}
          title="Delhi Khasra Map"
          className="z-0"
        />
      </div>
      
      <div className="mt-2 text-xs text-gray-400">
        Note: All map information and data are provided for visualization purposes. For official records, please contact the Revenue Department.
      </div>
    </div>
  )
} 