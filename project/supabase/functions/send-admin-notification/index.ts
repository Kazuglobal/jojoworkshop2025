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
          <h1 style="color: #d4af37; margin: 0;">🎼 新しいワークショップ申し込み</h1>
          <p style="color: #cccccc; margin: 10px 0 0 0;">Voice Atelier</p>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.05); padding: 25px; border-radius: 8px; border-left: 4px solid #d4af37;">
          <h2 style="color: #d4af37; margin-top: 0;">申し込み詳細</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
              <td style="padding: 12px 0; color: #d4af37; font-weight: bold;">参加者名:</td>
              <td style="padding: 12px 0; color: #ffffff;">${data.child_name}</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
              <td style="padding: 12px 0; color: #d4af37; font-weight: bold;">学年:</td>
              <td style="padding: 12px 0; color: #ffffff;">${data.grade}</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
              <td style="padding: 12px 0; color: #d4af37; font-weight: bold;">保護者名:</td>
              <td style="padding: 12px 0; color: #ffffff;">${data.parent_name}</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
              <td style="padding: 12px 0; color: #d4af37; font-weight: bold;">メール:</td>
              <td style="padding: 12px 0; color: #ffffff;">${data.email}</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
              <td style="padding: 12px 0; color: #d4af37; font-weight: bold;">電話番号:</td>
              <td style="padding: 12px 0; color: #ffffff;">${data.phone}</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
              <td style="padding: 12px 0; color: #d4af37; font-weight: bold;">歌唱経験:</td>
              <td style="padding: 12px 0; color: #ffffff;">${data.experience}</td>
            </tr>
            ${data.special_needs ? `
            <tr>
              <td style="padding: 12px 0; color: #d4af37; font-weight: bold;">特別配慮:</td>
              <td style="padding: 12px 0; color: #ffffff;">${data.special_needs}</td>
            </tr>
            ` : ''}
          </table>
          
          <p style="margin-top: 20px; color: #cccccc; font-size: 14px;">
            申し込み日時: ${new Date(data.created_at).toLocaleString('ja-JP')}
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding: 20px; background: rgba(212, 175, 55, 0.1); border-radius: 8px;">
          <p style="margin: 0; color: #d4af37; font-weight: bold;">📧 このメールは自動送信されています</p>
          <p style="margin: 5px 0 0 0; color: #cccccc; font-size: 14px;">24時間以内に申込者へご連絡をお願いします</p>
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