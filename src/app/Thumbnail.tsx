"use client"

import { useEffect, useState } from "react"

export default function Thumbnail({ title }: { title: string }) {

  const colorCombinations = [
    // { from: 'from-purple-600', to: 'to-orange-600' },
    { from: 'from-purple-600', to: 'to-blue-600' },
    { from: 'from-red-600', to: 'to-yellow-600' },
    { from: 'from-green-600', to: 'to-teal-600' },
    { from: 'from-pink-500', to: 'to-purple-600' },
    { from: 'from-yellow-400', to: 'to-orange-500' },
    { from: 'from-blue-400', to: 'to-indigo-600' },
    { from: 'from-teal-400', to: 'to-blue-500' },
    { from: 'from-orange-500', to: 'to-red-600' },
  ]

  const [gradientStyle, setGradientStyle] = useState({
    colors: colorCombinations[0],
  })

  useEffect(() => {
    const randomColorIndex = Math.floor(Math.random() * colorCombinations.length)
    setGradientStyle({
      colors: colorCombinations[randomColorIndex],
    })
  }, [])

  const id = Math.random().toString(36).substring(7)

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg">
      <div className={`absolute inset-0 bg-gradient-to-l ${gradientStyle.colors.from} ${gradientStyle.colors.to}`} />
      <div className="absolute inset-0 opacity-50 mix-blend-multiply">
        <svg className='w-full h-full' xmlns="http://www.w3.org/2000/svg">
          <filter id={`${id}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#${id})`} />
        </svg>
      </div>
      <div className="relative flex items-center justify-center h-full p-6">
        <h1 className="text-3xl md:text-4xl font-bold text-white text-left leading-tight drop-shadow-lg line-clamp-3">
          {title}
        </h1>
      </div>
    </div>
  )
}
