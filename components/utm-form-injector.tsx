'use client'

import { useEffect } from 'react'
import { loadStoredUTM } from '../lib/utm'

const UTM_FIELD_NAMES = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fbclid',
  'msclkid',
  'dclid',
  'ttclid',
  'initial_referrer',
  'landing_page',
] as const

type UTMName = typeof UTM_FIELD_NAMES[number]

function ensureHiddenInput(form: HTMLFormElement, name: UTMName): HTMLInputElement {
  const existing = form.querySelector(`input[name="${name}"]`) as HTMLInputElement | null
  if (existing && existing.type === 'hidden') return existing
  if (existing) return existing
  const input = document.createElement('input')
  input.type = 'hidden'
  input.name = name
  input.setAttribute('data-utm-injected', 'true')
  form.appendChild(input)
  return input
}

function populateFormWithUTM(form: HTMLFormElement) {
  const utm = loadStoredUTM()
  UTM_FIELD_NAMES.forEach((name) => {
    const value = (utm as Record<string, string | undefined>)[name]
    if (!value) return
    const input = ensureHiddenInput(form, name)
    input.value = value
  })
}

export default function UtmFormInjector() {
  useEffect(() => {
    if (typeof document === 'undefined') return

    const handleSubmit = (e: Event) => {
      const target = e.target as HTMLFormElement | null
      if (!target || target.nodeName !== 'FORM') return
      populateFormWithUTM(target)
    }

    // Initially populate all forms present
    document.querySelectorAll('form').forEach((form) => populateFormWithUTM(form as HTMLFormElement))

    // Keep values fresh right before submit
    document.addEventListener('submit', handleSubmit, true)

    // Observe for dynamically added forms
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return
          const el = node as Element
          if (el instanceof HTMLFormElement) {
            populateFormWithUTM(el)
          } else {
            el.querySelectorAll?.('form').forEach((f) => populateFormWithUTM(f as HTMLFormElement))
          }
        })
      }
    })
    observer.observe(document.documentElement, { childList: true, subtree: true })

    return () => {
      document.removeEventListener('submit', handleSubmit, true)
      observer.disconnect()
    }
  }, [])

  return null
}


