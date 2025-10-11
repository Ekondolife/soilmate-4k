interface EmailData {
  to: string
  subject: string
  html: string
  plantName: string
  plantImage: string
  plantDescription: string
  plantPersonality: string
}

export async function sendSoilmateEmail(emailData: EmailData): Promise<boolean> {
  try {
    // Try different email services based on environment variables
    const emailService = process.env.EMAIL_SERVICE || 'resend'
    
    console.log(`📧 Attempting to send email using service: ${emailService}`)
    
    switch (emailService) {
      case 'resend':
        return await sendWithResend(emailData)
      case 'sendgrid':
        return await sendWithSendGrid(emailData)
      case 'nodemailer':
        return await sendWithNodemailer(emailData)
      default:
        console.log('📧 No email service configured, skipping email send')
        return true // Don't fail the flow if email isn't configured
    }
  } catch (error) {
    console.error('📧 Email sending failed:', error)
    return false
  }
}

async function sendWithResend(emailData: EmailData): Promise<boolean> {
  // Temporarily hardcoded API key to fix the issue
  const apiKey = process.env.RESEND_API_KEY || 're_NXBAVW5t_QBvKfcZkEiVHfBQPc7R7fjPc'
  console.log('📧 Using API key:', apiKey ? 'Found' : 'Not found')

  try {
    // Use the Resend SDK approach
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev',
        to: [emailData.to],
        subject: emailData.subject,
        html: emailData.html,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('📧 Resend API error:', response.status, errorText)
      return false
    }

    const result = await response.json()
    console.log('📧 Resend success:', result)
    return true
  } catch (error) {
    console.error('📧 Resend fetch error:', error)
    return false
  }
}

async function sendWithSendGrid(emailData: EmailData): Promise<boolean> {
  const apiKey = process.env.SENDGRID_API_KEY
  if (!apiKey) {
    console.log('📧 SENDGRID_API_KEY not configured')
    return false
  }

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{
        to: [{ email: emailData.to }],
        subject: emailData.subject,
      }],
      from: { email: process.env.FROM_EMAIL || 'noreply@ekondo.com' },
      content: [{
        type: 'text/html',
        value: emailData.html,
      }],
    }),
  })

  return response.ok
}

async function sendWithNodemailer(emailData: EmailData): Promise<boolean> {
  // This would require nodemailer package
  console.log('📧 Nodemailer not implemented yet')
  return false
}

export function generateEmailTemplate(data: EmailData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Soilmate Awaits!</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #059669;
            margin-bottom: 10px;
        }
        .plant-image {
            width: 200px;
            height: 200px;
            border-radius: 50%;
            object-fit: cover;
            margin: 20px auto;
            display: block;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }
        .plant-name {
            font-size: 32px;
            font-weight: bold;
            color: #059669;
            text-align: center;
            margin: 20px 0;
        }
        .plant-description {
            font-size: 18px;
            color: #6b7280;
            text-align: center;
            margin-bottom: 30px;
        }
        .personality-section {
            background: #f0fdf4;
            padding: 25px;
            border-radius: 12px;
            border-left: 4px solid #059669;
            margin: 25px 0;
        }
        .personality-title {
            font-size: 20px;
            font-weight: bold;
            color: #059669;
            margin-bottom: 15px;
        }
        .cta-button {
            display: inline-block;
            background: #059669;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        .emoji {
            font-size: 24px;
            margin: 0 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🌱 Ekondo Soilmate</div>
            <h1>Your Perfect Plant Companion Awaits!</h1>
        </div>
        
        <img src="${data.plantImage}" alt="${data.plantName}" class="plant-image" />
        
        <div class="plant-name">${data.plantName}</div>
        <div class="plant-description">${data.plantDescription}</div>
        
        <div class="personality-section">
            <div class="personality-title">🌿 What Your Soilmate Teaches You</div>
            <p>${data.plantPersonality}</p>
        </div>
        
        <div style="text-align: center;">
            <a href="https://ekondolife.com/" class="cta-button">
                🌱 Adopt Your Soilmate
            </a>
        </div>
        
        <div class="footer">
            <p>Thank you for taking the Soilmate quiz! <span class="emoji">🌱</span></p>
            <p>Keep this email to remember your perfect plant companion.</p>
            <p><strong>Ekondo</strong> - Connecting you with nature, one plant at a time.</p>
        </div>
    </div>
</body>
</html>
  `.trim()
}

export function generateEmailSubject(plantName: string): string {
  const subjects = [
    `🌱 Your amazing Soilmate: ${plantName} is ready!`,
    `🌿 Meet ${plantName} - Your perfect plant companion!`,
    `🪴 Your Soilmate ${plantName} is waiting for you!`,
    `🌱 ${plantName} is your ideal plant match!`,
    `🌿 Discover why ${plantName} is your perfect Soilmate!`,
    `🪴 Your plant soulmate ${plantName} awaits!`,
    `🌱 ${plantName} - The plant that completes you!`,
    `🌿 Your green companion ${plantName} is here!`
  ]
  
  return subjects[Math.floor(Math.random() * subjects.length)]
}
