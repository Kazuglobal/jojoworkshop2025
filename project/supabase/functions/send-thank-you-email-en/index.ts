import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, subject, data } = await req.json()

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #1a1a2e, #16213e); color: #ffffff; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #d4af37; margin: 0;">🎼 Voice Atelier</h1>
          <p style="color: #cccccc; margin: 10px 0 0 0;">World-Class Voice Trainer Mr. JoJo Acosta Workshop</p>
        </div>
        
        <div style="background: rgba(212, 175, 55, 0.1); padding: 25px; border-radius: 8px; border-left: 4px solid #d4af37; margin-bottom: 25px;">
          <h2 style="color: #d4af37; margin-top: 0;">✨ Thank you for your registration!</h2>
          <p style="color: #ffffff; line-height: 1.6;">
            Dear ${data.parent_name},<br><br>
            Thank you for registering for the special workshop by world-class voice trainer Mr. JoJo Acosta. We are delighted to have you join us!
          </p>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.05); padding: 25px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #d4af37; margin-top: 0;">📋 Registration Details</h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
              <td style="padding: 12px 0; color: #d4af37; font-weight: bold;">Participant:</td>
              <td style="padding: 12px 0; color: #ffffff;">${data.child_name}</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
              <td style="padding: 12px 0; color: #d4af37; font-weight: bold;">Grade:</td>
              <td style="padding: 12px 0; color: #ffffff;">${data.grade}</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
              <td style="padding: 12px 0; color: #d4af37; font-weight: bold;">Experience:</td>
              <td style="padding: 12px 0; color: #ffffff;">${data.experience}</td>
            </tr>
          </table>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.05); padding: 25px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #d4af37; margin-top: 0;">📅 Workshop Details</h3>
          <div style="color: #ffffff; line-height: 1.8;">
            <p><strong>🗓️ Date & Time:</strong> June 21, 2025 (Saturday) 10:30 AM - 12:00 PM</p>
            <p><strong>📍 Venue:</strong> UDCK (Kashiwa-no-ha Urban Design Center)</p>
            <p><strong>🎯 Target:</strong> Elementary to junior high students (ages 7-15)</p>
            <p><strong>👥 Capacity:</strong> Limited to 20 participants</p>
            <p><strong>💝 Fee:</strong> Completely free</p>
            <p><strong>🌐 Language:</strong> English songs (Japanese support available)</p>
          </div>
        </div>
        
        <div style="background: rgba(212, 175, 55, 0.1); padding: 25px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #d4af37; margin-top: 0;">🎤 About the Instructor</h3>
          <p style="color: #ffffff; line-height: 1.6;">
            <strong>Mr. JoJo Acosta</strong><br>
            International voice trainer from the Philippines. A professional with experience coaching performers from "X-Factor," "Les Misérables," and "American Idol." He is passionate about improving children's musical expression and communication skills.
          </p>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.05); padding: 25px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #d4af37; margin-top: 0;">📧 Contact Information</h3>
          <ul style="color: #ffffff; line-height: 1.8; padding-left: 20px;">
            <li>If you have any questions, please feel free to contact us</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding: 20px; background: rgba(212, 175, 55, 0.1); border-radius: 8px;">
          <p style="margin: 0; color: #d4af37; font-weight: bold;">Contact</p>
          <p style="margin: 5px 0 0 0; color: #ffffff;">
            📧 globalbunny77@gmail.com<br>
            Contact: Odate
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
          <p style="margin: 0; color: #cccccc; font-size: 12px;">
            This email was sent automatically.<br>
            Registration date: ${new Date(data.created_at).toLocaleString('en-US')}
          </p>
        </div>
      </div>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Voice Atelier <noreply@globalbunny.jp>',
        to: [to],
        subject: subject,
        html: emailHtml,
      }),
    })

    if (!res.ok) {
      const error = await res.text()
      throw new Error(`Failed to send email: ${error}`)
    }

    const emailData = await res.json()

    return new Response(
      JSON.stringify({ success: true, data: emailData }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})