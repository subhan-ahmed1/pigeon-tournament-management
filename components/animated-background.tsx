"use client"

import type React from "react"

import { useEffect, useState } from "react"

interface AnimatedBackgroundProps {
  images: string[]
  className?: string
  children: React.ReactNode
}

export function AnimatedBackground({ images, className = "", children }: AnimatedBackgroundProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Add the new pigeon images to the slideshow
  const allImages = [
    ...images,
    "/images/pigeon-background.png",
    "/images/pigeon-slide-1.jpg",
    "/images/pigeon-slide-2.jpg",
    "/images/pigeon-club-logo.jpg",
  ]

  useEffect(() => {
    if (allImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % allImages.length)
      }, 15000) // Changed from 5000 to 15000 - now 15 second intervals

      return () => clearInterval(interval)
    }
  }, [allImages.length])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background Images */}
      {allImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
            index === currentImageIndex ? "opacity-90" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url(${image})`,
          }}
        />
      ))}

      {/* Lighter Gradient Overlay for better image clarity */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-purple-900/50 to-blue-800/60" />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
