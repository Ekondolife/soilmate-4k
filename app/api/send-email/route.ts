import { NextRequest, NextResponse } from 'next/server'
import { sendSoilmateEmail, generateEmailTemplate, generateEmailSubject } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    const { 
      email, 
      plantName, 
      plantImage, 
      plantDescription, 
      plantPersonality 
    } = body

    // Validate required fields
    if (!email || !plantName || !plantImage || !plantDescription || !plantPersonality) {
      return NextResponse.json(
        { ok: false, error: 'Missing required fields' }, 
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { ok: false, error: 'Invalid email format' }, 
        { status: 400 }
      )
    }

    // Generate email content
    const subject = generateEmailSubject(plantName)
    const html = generateEmailTemplate({
      to: email,
      subject,
      html: '',
      plantName,
      plantImage,
      plantDescription,
      plantPersonality
    })

    // Send email
    const success = await sendSoilmateEmail({
      to: email,
      subject,
      html,
      plantName,
      plantImage,
      plantDescription,
      plantPersonality
    })

    if (success) {
      console.log(`📧 Email sent successfully to ${email} for plant ${plantName}`)
      return NextResponse.json({ 
        ok: true, 
        message: 'Email sent successfully' 
      })
    } else {
      console.log(`📧 Email service not configured, skipping email send to ${email}`)
      return NextResponse.json({ 
        ok: true, 
        message: 'Email service not configured' 
      })
    }

  } catch (error) {
    console.error('📧 Email API error:', error)
    return NextResponse.json(
      { ok: false, error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
