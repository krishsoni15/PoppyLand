'use client'

import { useApp } from '@/components/providers/AppProvider'
import { GlobalMascot } from './GlobalMascot'

export function MascotBridge() {
  const { poppyState } = useApp()
  return <GlobalMascot poppyState={poppyState} />
}
