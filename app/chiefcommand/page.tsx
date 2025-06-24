'use client'

import dynamic from 'next/dynamic'

// Load the three.js scene only on the client to avoid SSR issues
const HologramScene = dynamic(() => import('./components/HologramScene'), {
  ssr: false,
})

export default function Home() {
  return (
    <main className="h-screen w-screen bg-black">
      <HologramScene />
    </main>
  )
}
