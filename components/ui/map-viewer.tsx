"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

interface MapViewerProps {
  district: string
  division: string
  village: string
  height?: string | number
  width?: string | number
}

export function MapViewer({ district, division, village, height = 300, width = '100%' }: MapViewerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [useStaticMap, setUseStaticMap] = useState(false)

  // Mock coordinates for Delhi districts - in a real implementation, these would come from a database or API
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

  // Division level coordinates - would typically come from a backend service
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
    // Add more divisions as needed
  }

  // Village level coordinates - would typically come from a backend service
  const villageCoordinates: Record<string, Record<string, Record<string, { lat: number; lng: number; zoom: number }>>> = {
    "South Delhi": {
      "Hauz Khas": {
        "Green Park": { lat: 28.5589, lng: 77.2008, zoom: 16 },
        "SDA": { lat: 28.5462, lng: 77.2043, zoom: 16 },
        "Sarvapriya Vihar": { lat: 28.5421, lng: 77.2122, zoom: 16 },
        "Panchsheel Park": { lat: 28.5368, lng: 77.2194, zoom: 16 }
      }
    },
    // Add more villages as needed
  }

  // Get current position based on selections
  const getCurrentPosition = () => {
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

    return position
  }

  // Generate static map URL from OpenStreetMap
  const getStaticMapUrl = () => {
    const position = getCurrentPosition()
    // Using OpenStreetMap static map URL
    return `https://www.openstreetmap.org/export/embed.html?bbox=${position.lng - 0.05},${position.lat - 0.05},${position.lng + 0.05},${position.lat + 0.05}&layer=mapnik&marker=${position.lat},${position.lng}`
  }

  useEffect(() => {
    // Load Google Maps API
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
    
    // If no API key is provided, use static map as fallback
    if (!apiKey) {
      console.log("No Google Maps API key provided. Using static map fallback.")
      setUseStaticMap(true)
      return
    }
    
    const loader = new Loader({
      apiKey,
      version: "weekly",
      libraries: ["places"]
    })

    let isMounted = true

    loader.load()
      .then(() => {
        if (!isMounted) return
        setIsLoaded(true)
      })
      .catch(err => {
        if (!isMounted) return
        console.error("Error loading Google Maps:", err)
        setError("Failed to load map. Using fallback.")
        setUseStaticMap(true)
      })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!isLoaded || !mapRef.current || useStaticMap) return

    // Initialize map with default view of Delhi
    const defaultPosition = { lat: 28.6139, lng: 77.2090, zoom: 10 }
    try {
      const initialMap = new google.maps.Map(mapRef.current, {
        center: { lat: defaultPosition.lat, lng: defaultPosition.lng },
        zoom: defaultPosition.zoom,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        fullscreenControl: true,
        streetViewControl: false
      })
      
      setMap(initialMap)
    } catch (err) {
      console.error("Error initializing map:", err)
      setError("Failed to initialize map. Using fallback.")
      setUseStaticMap(true)
    }
  }, [isLoaded, useStaticMap])

  // Update map when selections change
  useEffect(() => {
    if (!map || !isLoaded || useStaticMap) return

    try {
      const position = getCurrentPosition()

      // Update map center and zoom
      map.setCenter({ lat: position.lat, lng: position.lng })
      map.setZoom(position.zoom)

      // Clear existing markers (by setting their map to null)
      // Add a marker
      new google.maps.Marker({
        position: { lat: position.lat, lng: position.lng },
        map: map,
        title: village || division || district || "Delhi"
      })
    } catch (err) {
      console.error("Error updating map:", err)
    }
  }, [map, district, division, village, isLoaded, useStaticMap])

  if (useStaticMap) {
    // Render OSM iframe as fallback
    return (
      <div className="mt-4 rounded-lg overflow-hidden border border-gray-800">
        <iframe 
          src={getStaticMapUrl()}
          style={{ height: typeof height === 'number' ? `${height}px` : height, width }}
          className="w-full h-full"
          frameBorder="0"
          scrolling="no"
          title="Map"
        />
      </div>
    )
  }

  return (
    <div className="mt-4 rounded-lg overflow-hidden border border-gray-800">
      {error ? (
        <div className="h-[300px] flex items-center justify-center bg-black/30 text-red-400">
          {error}
        </div>
      ) : !isLoaded ? (
        <div className="h-[300px] flex items-center justify-center bg-black/30">
          <div className="animate-pulse text-white">Loading map...</div>
        </div>
      ) : (
        <div
          ref={mapRef}
          style={{ height: typeof height === 'number' ? `${height}px` : height, width }}
          className="bg-gray-900"
        />
      )}
    </div>
  )
} 