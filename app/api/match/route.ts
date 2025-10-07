import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL
    if (!webhookUrl) {
      console.log('⚠️ GOOGLE_SHEETS_WEBHOOK_URL not set, skipping webhook call')
      return NextResponse.json({ ok: true, message: 'Webhook URL not configured' })
    }

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'match',
        timestamp: new Date().toISOString(),
        ...body,
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('Webhook failed:', text)
      return NextResponse.json({ ok: false, error: text || 'Forwarding failed' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('API error:', e)
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 })
  }
}
