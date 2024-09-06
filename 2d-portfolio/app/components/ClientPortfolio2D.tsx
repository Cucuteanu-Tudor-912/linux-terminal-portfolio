'use client'

import dynamic from 'next/dynamic'

const Portfolio2D = dynamic(() => import('./terminal'), { ssr: false })

export default function ClientPortfolio2D() {
  return <Portfolio2D />
}