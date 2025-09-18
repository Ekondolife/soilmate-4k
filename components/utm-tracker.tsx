'use client'

import { useEffect } from 'react'
import { trackUTMOncePerVisit } from '../lib/utm'

export default function UtmTracker() {
  useEffect(() => {
    trackUTMOncePerVisit()
  }, [])
  return null
}


