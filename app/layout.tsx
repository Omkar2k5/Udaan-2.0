import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import Script from "next/script"
import { Providers } from "@/components/providers"
import Image from "next/image"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Property Info Finder",
  description: "Property information finder with 3D visualization",
  generator: "v0.dev"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script 
          type="module" 
          src="https://unpkg.com/@splinetool/viewer@1.9.89/build/spline-viewer.js"
          strategy="beforeInteractive"
          crossOrigin="anonymous"
          id="spline-viewer-script"
        />
      </head>
      <body className={`${inter.className}`}>
        <div className="fixed bottom-4 right-4 z-50 bg-black/80 backdrop-blur-sm p-2 rounded-lg">
          <Image
            src="/logo-Mit.png"
            alt="MIT Logo"
            width={150}
            height={90}
            className="object-contain"
          />
        </div>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
