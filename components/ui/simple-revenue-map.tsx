"use client"

import React, { useEffect, useState } from 'react'

interface SimpleRevenueMapProps {
  district: string
  division: string
  village: string
  height?: string | number
  width?: string | number
}

export function SimpleRevenueMap({ 
  district, 
  division, 
  village, 
  height = 350, 
  width = '100%' 
}: SimpleRevenueMapProps) {
  const [mapUrl, setMapUrl] = useState<string>('');
  
  useEffect(() => {
    // Get position based on selections
    // Default Delhi coordinates
    let lat = 28.6139;
    let lng = 77.2090;
    let zoom = 10;
    
    // Update coordinates based on selections
    if (district === "Central Delhi") {
      lat = 28.6508;
      lng = 77.2309;
      zoom = 11;
      
      if (division === "Civil Lines") {
        lat = 28.6814;
        lng = 77.2226;
        zoom = 13;
        
        if (village === "Kamla Nagar") {
          lat = 28.6809;
          lng = 77.2047;
          zoom = 15;
        }
      } else if (division === "Karol Bagh") {
        lat = 28.6516;
        lng = 77.1906;
        zoom = 13;
      } else if (division === "Kotwali") {
        lat = 28.6559;
        lng = 77.2373;
        zoom = 13;
      }
    } else if (district === "South Delhi") {
      lat = 28.5355;
      lng = 77.2400;
      zoom = 11;
      
      if (division === "Hauz Khas") {
        lat = 28.5494;
        lng = 77.2001;
        zoom = 13;
        
        if (village === "Green Park") {
          lat = 28.5589;
          lng = 77.2008;
          zoom = 15;
        } else if (village === "SDA") {
          lat = 28.5462;
          lng = 77.2043;
          zoom = 15;
        } else if (village === "Sarvapriya Vihar") {
          lat = 28.5421;
          lng = 77.2122;
          zoom = 15;
        } else if (village === "Panchsheel Park") {
          lat = 28.5368;
          lng = 77.2194;
          zoom = 15;
        }
      } else if (division === "Saket") {
        lat = 28.5244;
        lng = 77.2090;
        zoom = 13;
      } else if (division === "Mehrauli") {
        lat = 28.5256;
        lng = 77.1770;
        zoom = 13;
      }
    }
    
    // Calculate appropriate bounding box based on zoom level
    const getBoxSize = () => {
      // Higher zoom = smaller area
      if (zoom >= 15) return 0.01;       // Village level
      else if (zoom >= 13) return 0.02;  // Division level
      else if (zoom >= 11) return 0.05;  // District level
      else return 0.1;                   // Default/State level
    };
    
    const boxSize = getBoxSize();
    
    // Create the OpenStreetMap URL with the correct zoom level and bounding box
    const url = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - boxSize},${lat - boxSize},${lng + boxSize},${lat + boxSize}&layer=mapnik&marker=${lat},${lng}`;
    setMapUrl(url);
    
  }, [district, division, village]); // Update whenever these props change
  
  return (
    <div className="mt-4 rounded-lg overflow-hidden border border-gray-800">
      {!mapUrl ? (
        <div 
          style={{ 
            height: typeof height === 'number' ? `${height}px` : height, 
            width 
          }} 
          className="flex items-center justify-center bg-black/30"
        >
          <div className="animate-pulse text-white">Loading map...</div>
        </div>
      ) : (
        <>
          <iframe 
            src={mapUrl}
            style={{ 
              height: typeof height === 'number' ? `${height}px` : height,
              width 
            }}
            className="w-full h-full"
            frameBorder="0"
            scrolling="no"
            title="Property Location"
            loading="eager"
          />
          <div className="bg-black/80 text-white text-xs p-2 text-center">
            {district}{division ? ` → ${division}` : ''}{village ? ` → ${village}` : ''}
          </div>
        </>
      )}
    </div>
  )
} 