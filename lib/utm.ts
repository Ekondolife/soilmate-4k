export type UTMParams = {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  gclid?: string
  fbclid?: string
  msclkid?: string
  dclid?: string
  ttclid?: string
  initial_referrer?: string
  landing_page?: string
}

const UTM_KEYS: Array<keyof UTMParams> = [
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
]

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 90 // 90 days

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(name + '='))
  return match ? decodeURIComponent(match.split('=')[1]) : undefined
}

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === 'undefined') return
  const secure = location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax${secure}`
}

export function parseUTMFromSearch(search: string): Partial<UTMParams> {
  const params = new URLSearchParams(search || '')
  const result: Partial<UTMParams> = {}
  for (const key of UTM_KEYS) {
    const value = params.get(key as string)
    if (value) result[key] = value
  }
  return result
}

export function loadStoredUTM(): Partial<UTMParams> {
  const result: Partial<UTMParams> = {}
  for (const key of UTM_KEYS) {
    const value = getCookie(key as string)
    if (value) result[key] = value
  }
  const initialReferrer = getCookie('initial_referrer')
  if (initialReferrer) result.initial_referrer = initialReferrer
  const landingPage = getCookie('landing_page')
  if (landingPage) result.landing_page = landingPage
  return result
}

export function persistUTM(utm: Partial<UTMParams>) {
  for (const [key, value] of Object.entries(utm)) {
    if (!value) continue
    setCookie(key, value, COOKIE_MAX_AGE_SECONDS)
  }
}

export function trackUTMOncePerVisit() {
  if (typeof window === 'undefined') return
  const urlUtm = parseUTMFromSearch(window.location.search)
  const stored = loadStoredUTM()

  const shouldUpdate = Object.keys(urlUtm).length > 0

  const merged: Partial<UTMParams> = shouldUpdate ? { ...stored, ...urlUtm } : { ...stored }

  // initial referrer and landing page
  if (!stored.initial_referrer && document.referrer) {
    merged.initial_referrer = document.referrer
  }
  if (!stored.landing_page) {
    merged.landing_page = window.location.pathname + window.location.search
  }

  // Only write if we have new info or nothing stored yet
  if (shouldUpdate || Object.keys(stored).length === 0 || !stored.initial_referrer || !stored.landing_page) {
    persistUTM(merged)
  }
}
