"use client"

import React, { useEffect, useRef, useState } from 'react'

interface RevenueMapProps {
  district: string
  division: string
  village: string
  rectangle?: string
  khasra?: string
  height?: string | number
  width?: string | number
}

export function RevenueMap({ 
  district, 
  division, 
  village, 
  rectangle, 
  khasra,
  height = 350, 
  width = '100%' 
}: RevenueMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [loading, setLoading] = useState(true)
  
  // Static Map URL to show immediately while Leaflet loads
  const getStaticMapUrl = () => {
    // Default Delhi coordinates
    let lat = 28.6139;
    let lng = 77.2090;
    
    // Update coordinates based on selections
    if (district === "Central Delhi") {
      lat = 28.6508;
      lng = 77.2309;
      
      if (division === "Civil Lines") {
        lat = 28.6814;
        lng = 77.2226;
        
        if (village === "Kamla Nagar") {
          lat = 28.6809;
          lng = 77.2047;
        }
      }
    } else if (district === "South Delhi") {
      lat = 28.5355;
      lng = 77.2400;
      
      if (division === "Hauz Khas") {
        lat = 28.5494;
        lng = 77.2001;
        
        if (village === "Green Park") {
          lat = 28.5589;
          lng = 77.2008;
        }
      }
    }
    
    // Create a static map URL using MapTiler (free tier)
    return `https://api.maptiler.com/maps/streets/static/${lng},${lat},10/400x300.png?key=get_your_own_key`;
  }

  useEffect(() => {
    // Only run once on component mount
    let isMounted = true;
    
    // Add Leaflet CSS - faster from jsdelivr CDN
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.min.css'
      document.head.appendChild(link)
    }

    // Preload immediately to make interactive map appear faster
    if (!window.L) {
      const script = document.createElement('script')
      script.id = 'leaflet-js'
      script.src = 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.min.js'
      script.onload = () => {
        if (isMounted) {
          setMapLoaded(true)
        }
      }
      document.head.appendChild(script)
    } else {
      setMapLoaded(true)
    }
    
    return () => {
      isMounted = false;
    }
  }, [])

  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return
    
    // Clear any existing map
    if (mapRef.current.innerHTML) {
      mapRef.current.innerHTML = ''
    }

    // Get position based on selections - using Delhi coordinates as mock data
    const getPosition = () => {
      // Default Delhi coordinates
      let position = { lat: 28.6139, lng: 77.2090, zoom: 10 }
      
      // These coordinate sets would be replaced with actual data in production
      if (district === "Central Delhi") {
        position = { lat: 28.6508, lng: 77.2309, zoom: 12 }
        
        if (division === "Civil Lines") {
          position = { lat: 28.6814, lng: 77.2226, zoom: 13 }
          
          if (village === "Kamla Nagar") {
            position = { lat: 28.6809, lng: 77.2047, zoom: 15 }
          }
        }
      } else if (district === "South Delhi") {
        position = { lat: 28.5355, lng: 77.2400, zoom: 12 }
        
        if (division === "Hauz Khas") {
          position = { lat: 28.5494, lng: 77.2001, zoom: 13 }
          
          if (village === "Green Park") {
            position = { lat: 28.5589, lng: 77.2008, zoom: 15 }
          }
        }
      }
      
      return position
    }

    const position = getPosition()
    
    try {
      // Create map instance - need to explicitly define window.L to avoid TypeScript errors
      const L = window.L as any
      
      // Create map with reduced animations for faster loading
      const map = L.map(mapRef.current, {
        fadeAnimation: false,
        zoomAnimation: false,
        markerZoomAnimation: false
      }).setView([position.lat, position.lng], position.zoom)
      
      // Use a fast-loading tile provider
      const osmLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
      
      // Load satellite imagery only when needed
      const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri'
      })
      
      // Setup base maps
      const baseMaps = {
        "Street": osmLayer,
        "Satellite": satelliteLayer
      }
      
      // Add the default layer
      osmLayer.addTo(map)
      
      // Add layer control
      L.control.layers(baseMaps).addTo(map)
      
      // Add scale
      L.control.scale().addTo(map)
      
      // Create a marker for the selected location
      const marker = L.marker([position.lat, position.lng]).addTo(map)
      
      // Create a popup with location information
      let popupContent = `<div style="min-width: 200px;">
        <h3 style="margin: 0; padding: 0; font-size: 16px; color: #333;">Location Details</h3>
        <hr style="margin: 5px 0;" />
        <p style="margin: 5px 0;"><strong>District:</strong> ${district || 'Not selected'}</p>
        ${division ? `<p style="margin: 5px 0;"><strong>Division:</strong> ${division}</p>` : ''}
        ${village ? `<p style="margin: 5px 0;"><strong>Village:</strong> ${village}</p>` : ''}
        ${rectangle ? `<p style="margin: 5px 0;"><strong>Rectangle:</strong> ${rectangle}</p>` : ''}
        ${khasra ? `<p style="margin: 5px 0;"><strong>Khasra:</strong> ${khasra}</p>` : ''}
      </div>`
      
      // Bind the popup to the marker
      marker.bindPopup(popupContent).openPopup()
      
      // Add a polygon to simulate a land parcel if rectangle and khasra are provided
      if (rectangle && khasra) {
        // In a real implementation, you would fetch actual boundary coordinates
        // For now, we'll create a simple polygon around the marker
        const polygonPoints = [
          [position.lat - 0.002, position.lng - 0.003],
          [position.lat + 0.002, position.lng - 0.002],
          [position.lat + 0.001, position.lng + 0.003],
          [position.lat - 0.003, position.lng + 0.001]
        ]
        
        const polygon = L.polygon(polygonPoints, {
          color: 'red',
          fillColor: '#f03',
          fillOpacity: 0.3,
          weight: 2
        }).addTo(map)
        
        polygon.bindPopup(`<div><strong>Khasra:</strong> ${khasra}</div>`)
      }
      
      setLoading(false)
    } catch (error) {
      console.error("Error initializing map:", error)
      setLoading(false)
    }
  }, [mapLoaded, district, division, village, rectangle, khasra])

  return (
    <div className="mt-4 rounded-lg overflow-hidden border border-gray-800">
      {loading ? (
        <div 
          style={{ 
            height: typeof height === 'number' ? `${height}px` : height,
            width,
            background: `url("https://maps.googleapis.com/maps/api/staticmap?center=Delhi,India&zoom=10&size=600x400&key=YOUR_API_KEY") center/cover no-repeat`
          }} 
          className="flex items-center justify-center bg-black/30"
        >
          <div className="flex flex-col items-center justify-center p-4 bg-black/60 rounded-md text-white">
            <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mb-2"></div>
            <div>Loading revenue map...</div>
          </div>
        </div>
      ) : (
        <div 
          ref={mapRef} 
          style={{ 
            height: typeof height === 'number' ? `${height}px` : height,
            width 
          }}
          className="revenue-map"
        />
      )}
    </div>
  )
}

// Add this to global.d.ts or in this file:
declare global {
  interface Window {
    L: any
  }
} 