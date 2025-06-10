'use client'

import React from 'react'
import StrategicPlatform from '@/components/dashboard/StrategicPlatform/StrategicPlatform'

export default function DashboardPlataforma() {
  return (
    <main>
      <StrategicPlatform
        onChange={(selected) => {
          console.log('Ejes marcados:', selected)
        }}
      />
    </main>
  )
}
