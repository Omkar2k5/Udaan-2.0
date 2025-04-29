"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface SimpleRevenueMapProps {
  district: string
  division: string
  village: string
  height?: string | number
  width?: string | number
}

// Define types for our coordinates data structure
interface Coordinates {
  lat: number
  lng: number
  zoom: number
}

interface LocalityMap {
  [key: string]: Coordinates
}

interface SROData {
  center: Coordinates
  localities: LocalityMap
}

interface SROMap {
  [key: string]: SROData
}

interface VillageMap {
  [key: string]: Coordinates
}

interface DivisionData {
  center?: Coordinates
  lat?: number
  lng?: number
  zoom?: number
  villages?: VillageMap
}

interface DivisionMap {
  [key: string]: DivisionData
}

interface DistrictData {
  center: Coordinates
  divisions?: DivisionMap
}

interface DistrictMap {
  [key: string]: DistrictData
}

export function SimpleRevenueMap({ 
  district, 
  division, 
  village, 
  height = 350, 
  width = '100%' 
}: SimpleRevenueMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Complete Delhi SRO and locality coordinates database
  const locationCoordinates: SROMap = {
    // SRI - Central-Kashmere Gate
    "SRI": {
      center: { lat: 28.6662, lng: 77.2271, zoom: 13 },
      localities: {
        "Kashmere Gate": { lat: 28.6665, lng: 77.2285, zoom: 16 },
        "Ajmeri Gate": { lat: 28.6427, lng: 77.2232, zoom: 16 },
        "Darya Ganj": { lat: 28.6423, lng: 77.2394, zoom: 16 },
        "Civil Lines": { lat: 28.6814, lng: 77.2226, zoom: 16 },
        "British India Colony": { lat: 28.6543, lng: 77.2282, zoom: 16 },
        "Curzon Road": { lat: 28.6264, lng: 77.2218, zoom: 16 },
        "Bahadur Shah Zafar Marg": { lat: 28.6375, lng: 77.2432, zoom: 16 }
      }
    },
    
    // SRIII - Central-Asaf Ali Road
    "SRIII": {
      center: { lat: 28.6342, lng: 77.2151, zoom: 13 },
      localities: {
        "Asaf Ali Road": { lat: 28.6420, lng: 77.2189, zoom: 16 },
        "Connaught Place Ext. C Zone": { lat: 28.6308, lng: 77.2181, zoom: 16 },
        "Copernicus Marg": { lat: 28.6276, lng: 77.2234, zoom: 16 },
        "Ajmal Khan Road": { lat: 28.6438, lng: 77.1966, zoom: 16 },
        "Baba Kharak Singh Marg": { lat: 28.6272, lng: 77.2128, zoom: 16 },
        "Gole Market": { lat: 28.6339, lng: 77.2021, zoom: 16 }
      }
    },
    
    // SRVIII - East-Geeta Colony
    "SRVIII": {
      center: { lat: 28.6572, lng: 77.2749, zoom: 13 },
      localities: {
        "Geeta Colony": { lat: 28.6571, lng: 77.2738, zoom: 16 },
        "Jhilmil": { lat: 28.6702, lng: 77.3015, zoom: 16 },
        "Jheel Kuranja": { lat: 28.6621, lng: 77.2879, zoom: 16 },
        "Shastri Nagar": { lat: 28.6730, lng: 77.2802, zoom: 16 },
        "Gandhi Nagar": { lat: 28.6539, lng: 77.2556, zoom: 16 },
        "L.M. Bundh Complex": { lat: 28.6590, lng: 77.2663, zoom: 16 }
      }
    },
    
    // SRVIIIA - East-Preet Vihar
    "SRVIIIA": {
      center: { lat: 28.6431, lng: 77.3017, zoom: 13 },
      localities: {
        "Preet Vihar": { lat: 28.6430, lng: 77.2970, zoom: 16 },
        "Vivek Vihar": { lat: 28.6712, lng: 77.3157, zoom: 16 },
        "Karkardooma": { lat: 28.6524, lng: 77.3024, zoom: 16 },
        "Dilshad Garden": { lat: 28.6854, lng: 77.3215, zoom: 16 },
        "Ramprastha": { lat: 28.6441, lng: 77.3211, zoom: 16 },
        "Mandoli": { lat: 28.7112, lng: 77.3153, zoom: 16 }
      }
    },
    
    // SRVII - New Delhi-INA
    "SRVII": {
      center: { lat: 28.5736, lng: 77.2090, zoom: 13 },
      localities: {
        "INA Colony": { lat: 28.5736, lng: 77.2090, zoom: 16 },
        "Jorbagh": { lat: 28.5926, lng: 77.2136, zoom: 16 },
        "Lodhi Estate": { lat: 28.5882, lng: 77.2258, zoom: 16 },
        "Kidwai Nagar": { lat: 28.5763, lng: 77.1991, zoom: 16 },
        "Sarojini Nagar": { lat: 28.5780, lng: 77.1973, zoom: 16 },
        "Kasturba Gandhi Marg": { lat: 28.6275, lng: 77.2196, zoom: 16 }
      }
    }
  }
  
  // Rural district coordinates
  const ruralCoordinates: DistrictMap = {
    "Central Delhi": { 
      center: { lat: 28.6508, lng: 77.2309, zoom: 11 },
      divisions: {
        "Civil Lines": { 
          center: { lat: 28.6814, lng: 77.2226, zoom: 13 },
          villages: {
            "Kamla Nagar": { lat: 28.6809, lng: 77.2047, zoom: 16 }
          }
        },
        "Karol Bagh": { lat: 28.6516, lng: 77.1906, zoom: 13 },
        "Kotwali": { lat: 28.6559, lng: 77.2373, zoom: 13 }
      }
    },
    "South Delhi": { 
      center: { lat: 28.5355, lng: 77.2400, zoom: 11 },
      divisions: {
        "Hauz Khas": { 
          center: { lat: 28.5494, lng: 77.2001, zoom: 13 },
          villages: {
            "Green Park": { lat: 28.5589, lng: 77.2008, zoom: 16 },
            "SDA": { lat: 28.5462, lng: 77.2043, zoom: 16 },
            "Sarvapriya Vihar": { lat: 28.5421, lng: 77.2122, zoom: 16 },
            "Panchsheel Park": { lat: 28.5368, lng: 77.2194, zoom: 16 }
          }
        },
        "Saket": { lat: 28.5244, lng: 77.2090, zoom: 13 },
        "Mehrauli": { lat: 28.5256, lng: 77.1770, zoom: 13 }
      }
    },
    "East Delhi": {
      center: { lat: 28.6544, lng: 77.2906, zoom: 11 }
    },
    "New Delhi": {
      center: { lat: 28.6139, lng: 77.2090, zoom: 11 }
    },
    "North Delhi": {
      center: { lat: 28.7288, lng: 77.1933, zoom: 11 }
    },
    "North East Delhi": {
      center: { lat: 28.6846, lng: 77.2746, zoom: 11 }
    },
    "North West Delhi": {
      center: { lat: 28.7183, lng: 77.0636, zoom: 11 }
    },
    "Shahdara": {
      center: { lat: 28.6811, lng: 77.2935, zoom: 11 }
    },
    "South East Delhi": {
      center: { lat: 28.5456, lng: 77.2667, zoom: 11 }
    },
    "South West Delhi": {
      center: { lat: 28.5823, lng: 77.0351, zoom: 11 }
    },
    "West Delhi": {
      center: { lat: 28.6663, lng: 77.0469, zoom: 11 }
    }
  }
  
  // Use iframe approach to display the map
  useEffect(() => {
    const initMap = async () => {
      setLoading(true)
      setError(null)
      
      try {
        // Get position based on selections
        // Default Delhi coordinates
        let lat = 28.6139
        let lng = 77.2090
        let zoom = 10
        
        // For urban properties, district = SRO Name, division = SRO code, village = locality
        const isUrban = division && division.startsWith('SR')
        
        if (isUrban) {
          // Look up the SRO coordinates
          if (locationCoordinates[division]) {
            // Set SRO center coordinates
            const sroData = locationCoordinates[division]
            lat = sroData.center.lat
            lng = sroData.center.lng
            zoom = sroData.center.zoom
            
            // If locality is specified, use its coordinates
            if (village && sroData.localities[village]) {
              const localityData = sroData.localities[village]
              lat = localityData.lat
              lng = localityData.lng
              zoom = localityData.zoom
            }
          }
        } else {
          // Rural property logic
          if (district && ruralCoordinates[district]) {
            // Set district coordinates
            const districtData = ruralCoordinates[district]
            lat = districtData.center.lat
            lng = districtData.center.lng
            zoom = districtData.center.zoom
            
            // If division is specified
            if (division && districtData.divisions && districtData.divisions[division]) {
              const divisionData = districtData.divisions[division]
              lat = divisionData.center?.lat || divisionData.lat || lat
              lng = divisionData.center?.lng || divisionData.lng || lng
              zoom = divisionData.center?.zoom || divisionData.zoom || zoom
              
              // If village is specified
              if (village && divisionData.villages && divisionData.villages[village]) {
                const villageData = divisionData.villages[village]
                lat = villageData.lat
                lng = villageData.lng
                zoom = villageData.zoom
              }
            }
          }
        }
        
        // Create iframe content
        if (mapRef.current) {
          // Build the OpenStreetMap URL
          const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.05},${lat-0.05},${lng+0.05},${lat+0.05}&layer=mapnik&marker=${lat},${lng}&zoom=${zoom}`
          
          // Create iframe
          const iframe = document.createElement('iframe')
          iframe.width = '100%'
          iframe.height = '100%'
          iframe.style.border = 'none'
          iframe.style.borderRadius = '8px'
          iframe.frameBorder = '0'
          iframe.allowFullscreen = true
          iframe.src = mapUrl
          iframe.onload = () => setLoading(false)
          iframe.onerror = () => {
            setError('Failed to load map. Please try again later.')
            setLoading(false)
          }
          
          // Clear previous content and add iframe
          mapRef.current.innerHTML = ''
          mapRef.current.appendChild(iframe)
          
          // Create a label overlay for the location
          const labelOverlay = document.createElement('div')
          labelOverlay.style.position = 'absolute'
          labelOverlay.style.top = '10px'
          labelOverlay.style.left = '10px'
          labelOverlay.style.backgroundColor = 'rgba(0,0,0,0.7)'
          labelOverlay.style.color = 'white'
          labelOverlay.style.padding = '8px 12px'
          labelOverlay.style.borderRadius = '4px'
          labelOverlay.style.zIndex = '1000'
          labelOverlay.style.fontWeight = 'bold'
          
          // Set label text
          if (isUrban) {
            labelOverlay.textContent = village || district || ''
          } else {
            labelOverlay.textContent = village || division || district || ''
          }
          
          // Add label if there's text to display
          if (labelOverlay.textContent) {
            mapRef.current.appendChild(labelOverlay)
          }
          
          // Add colored overlay for the boundary
          if (isUrban || village) {
            const boundaryOverlay = document.createElement('div')
            boundaryOverlay.style.position = 'absolute'
            boundaryOverlay.style.bottom = '10px'
            boundaryOverlay.style.right = '10px'
            boundaryOverlay.style.backgroundColor = 'rgba(0,0,0,0.7)'
            boundaryOverlay.style.color = 'white'
            boundaryOverlay.style.padding = '6px 10px'
            boundaryOverlay.style.borderRadius = '4px'
            boundaryOverlay.style.zIndex = '1000'
            boundaryOverlay.style.fontSize = '12px'
            
            // Create a small colored square indicator
            const colorIndicator = document.createElement('span')
            colorIndicator.style.display = 'inline-block'
            colorIndicator.style.width = '12px'
            colorIndicator.style.height = '12px'
            colorIndicator.style.backgroundColor = isUrban ? '#6366f1' : '#10b981' // Purple for urban, green for rural
            colorIndicator.style.marginRight = '6px'
            colorIndicator.style.borderRadius = '2px'
            
            boundaryOverlay.appendChild(colorIndicator)
            boundaryOverlay.appendChild(document.createTextNode('Selected Area'))
            
            mapRef.current.appendChild(boundaryOverlay)
          }
        }
      } catch (err) {
        console.error('Error initializing map:', err)
        setError('Failed to initialize map. Please try again later.')
        setLoading(false)
      }
    }
    
    initMap()
  }, [district, division, village])
  
  // Get location display name based on urban/rural context
  const getLocationDisplay = () => {
    const isUrban = division && division.startsWith('SR')
    
    if (isUrban) {
      return (
        <>
          {district && <div><strong>SRO:</strong> {district}</div>}
          {division && <div><strong>SRO Code:</strong> {division}</div>}
          {village && <div><strong>Locality:</strong> {village}</div>}
        </>
      )
    } else {
      return (
        <>
          {district && <div><strong>District:</strong> {district}</div>}
          {division && <div><strong>Division:</strong> {division}</div>}
          {village && <div><strong>Village:</strong> {village}</div>}
        </>
      )
    }
  }
  
  return (
    <div className="mt-4 rounded-lg overflow-hidden border border-gray-800">
      <div 
        style={{ 
          height: typeof height === 'number' ? `${height}px` : height,
          width,
          position: 'relative'
        }}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
            <div className="text-center">
              <Skeleton className="h-[40px] w-[200px] bg-gray-700/50 mb-2" />
              <Skeleton className="h-[20px] w-[150px] bg-gray-700/50" />
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
            <div className="text-white text-center p-4">
              <div className="text-red-400 mb-2">⚠️ {error}</div>
              <button 
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm"
                onClick={() => {
                  setError(null)
                  setLoading(true)
                  
                  // Retry map initialization
                  if (mapRef.current) {
                    mapRef.current.innerHTML = ''
                    // Trigger re-render
                    const refreshKey = Date.now()
                    mapRef.current.setAttribute('data-key', refreshKey.toString())
                  }
                }}
              >
                Retry
              </button>
            </div>
          </div>
        )}
        
        <div 
          ref={mapRef} 
          className="w-full h-full"
          id="map-container"
        />
      </div>
      
      <div className="bg-black/80 text-white p-3 text-sm">
        {getLocationDisplay()}
      </div>
      
      {(division && village) && (
        <div className="bg-black/80 border-t border-gray-700 text-gray-400 px-3 py-2 text-xs">
          Note: The highlighted area is an approximation. For precise boundary information, please refer to official records.
        </div>
      )}
    </div>
  )
} 