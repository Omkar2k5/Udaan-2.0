"use client"

import React, { useEffect, useState } from 'react'

interface SimpleMapProps {
  district: string
  division: string
  village: string
  height?: string | number
  width?: string | number
}

export function SimpleMap({ district, division, village, height = 300, width = '100%' }: SimpleMapProps) {
  const [mapUrl, setMapUrl] = useState("")

  // Mock coordinates for Delhi districts
  const districtCoordinates: Record<string, { lat: number; lng: number; zoom: number }> = {
    "Central Delhi": { lat: 28.6508, lng: 77.2309, zoom: 13 },
    "East Delhi": { lat: 28.6279, lng: 77.2957, zoom: 13 },
    "New Delhi": { lat: 28.6139, lng: 77.2090, zoom: 13 },
    "North Delhi": { lat: 28.7184, lng: 77.2060, zoom: 13 },
    "North East Delhi": { lat: 28.6835, lng: 77.2746, zoom: 13 },
    "North West Delhi": { lat: 28.7186, lng: 77.1382, zoom: 12 },
    "Shahdara": { lat: 28.6824, lng: 77.2944, zoom: 13 },
    "South Delhi": { lat: 28.5355, lng: 77.2400, zoom: 12 },
    "South East Delhi": { lat: 28.5445, lng: 77.2721, zoom: 12 },
    "South West Delhi": { lat: 28.5919, lng: 77.0336, zoom: 12 },
    "West Delhi": { lat: 28.6663, lng: 77.0913, zoom: 12 }
  }

  // Division level coordinates
  const divisionCoordinates: Record<string, Record<string, { lat: number; lng: number; zoom: number }>> = {
    "South Delhi": {
      "Hauz Khas": { lat: 28.5494, lng: 77.2001, zoom: 14 },
      "Saket": { lat: 28.5244, lng: 77.2090, zoom: 14 },
      "Mehrauli": { lat: 28.5256, lng: 77.1770, zoom: 14 }
    },
    "Central Delhi": {
      "Civil Lines": { lat: 28.6814, lng: 77.2226, zoom: 14 },
      "Karol Bagh": { lat: 28.6516, lng: 77.1906, zoom: 14 },
      "Kotwali": { lat: 28.6559, lng: 77.2373, zoom: 14 }
    },
  }

  // Village level coordinates
  const villageCoordinates: Record<string, Record<string, Record<string, { lat: number; lng: number; zoom: number }>>> = {
    "South Delhi": {
      "Hauz Khas": {
        "Green Park": { lat: 28.5589, lng: 77.2008, zoom: 16 },
        "SDA": { lat: 28.5462, lng: 77.2043, zoom: 16 },
        "Sarvapriya Vihar": { lat: 28.5421, lng: 77.2122, zoom: 16 },
        "Panchsheel Park": { lat: 28.5368, lng: 77.2194, zoom: 16 }
      }
    },
  }

  useEffect(() => {
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

    // Generate OpenStreetMap URL
    const url = `https://www.openstreetmap.org/export/embed.html?bbox=${position.lng - 0.05},${position.lat - 0.05},${position.lng + 0.05},${position.lat + 0.05}&layer=mapnik&marker=${position.lat},${position.lng}`
    setMapUrl(url)
  }, [district, division, village])

  return (
    <div className="mt-4 rounded-lg overflow-hidden border border-gray-800">
      {!mapUrl ? (
        <div className="h-[300px] flex items-center justify-center bg-black/30">
          <div className="animate-pulse text-white">Loading map...</div>
        </div>
      ) : (
        <iframe 
          src={mapUrl}
          style={{ height: typeof height === 'number' ? `${height}px` : height, width }}
          className="w-full h-full"
          frameBorder="0"
          scrolling="no"
          title="Map"
          loading="lazy"
        />
      )}
    </div>
  )
} 