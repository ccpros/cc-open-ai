'use client'
import dynamic from 'next/dynamic'

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
