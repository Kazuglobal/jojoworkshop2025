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
          <p style="color: #cccccc; margin: 10px 0 0 0;">世界的ボイストレーナー ジョジョ・アコスタ氏ワークショップ</p>
        </div>
        
        <div style="background: rgba(212, 175, 55, 0.1); padding: 25px; border-radius: 8px; border-left: 4px solid #d4af37; margin-bottom: 25px;">
          <h2 style="color: #d4af37; margin-top: 0;">✨ お申し込みありがとうございます！</h2>
          <p style="color: #ffffff; line-height: 1.6;">
            ${data.parent_name} 様<br><br>
            この度は、世界的ボイストレーナー ジョジョ・アコスタ氏による特別ワークショップにお申し込みいただき、誠にありがとうございます。
          </p>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.05); padding: 25px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #d4af37; margin-top: 0;">📋 お申し込み内容確認</h3>
          
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
              <td style="padding: 12px 0; color: #d4af37; font-weight: bold;">歌唱経験:</td>
              <td style="padding: 12px 0; color: #ffffff;">${data.experience}</td>
            </tr>
          </table>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.05); padding: 25px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #d4af37; margin-top: 0;">📅 ワークショップ詳細</h3>
          <div style="color: #ffffff; line-height: 1.8;">
            <p><strong>🗓️ 開催日時:</strong> 2025年6月21日（土）10:30〜12:00</p>
            <p><strong>📍 会場:</strong> UDCK（柏の葉アーバンデザインセンター）</p>
            <p><strong>🎯 対象:</strong> 小学生〜中学生（7歳〜15歳）</p>
            <p><strong>👥 定員:</strong> 20名限定</p>
            <p><strong>🌐 使用言語:</strong> 英語楽曲（日本語サポートあり）</p>
          </div>
        </div>
        
        <div style="background: rgba(212, 175, 55, 0.1); padding: 25px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #d4af37; margin-top: 0;">🎤 講師プロフィール</h3>
          <p style="color: #ffffff; line-height: 1.6;">
            <strong>ジョジョ・アコスタ氏</strong><br>
            フィリピン出身の国際的ボイストレーナー。「X-Factor」「レ・ミゼラブル」「アメリカン・アイドル」の出演者を指導した実績を持つプロフェッショナル。子どもたちの音楽表現力とコミュニケーション能力向上に情熱を注いでいます。
          </p>
        </div>
        
        <div style="background: rgba(255, 255, 255, 0.05); padding: 25px; border-radius: 8px; margin-bottom: 25px;">
          <h3 style="color: #d4af37; margin-top: 0;">📧 今後の流れ</h3>
          <ul style="color: #ffffff; line-height: 1.8; padding-left: 20px;">
            <li>24時間以内に詳細についてご連絡いたします</li>
            <li>当日の持ち物や注意事項をお知らせします</li>
            <li>参加費のお支払い方法をご案内します</li>
            <li>ご質問がございましたらお気軽にお問い合わせください</li>
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding: 20px; background: rgba(212, 175, 55, 0.1); border-radius: 8px;">
          <p style="margin: 0; color: #d4af37; font-weight: bold;">お問い合わせ</p>
          <p style="margin: 5px 0 0 0; color: #ffffff;">
            📧 globalbunny77@gmail.com<br>
            担当：大舘
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
          <p style="margin: 0; color: #cccccc; font-size: 12px;">
            このメールは自動送信されています。<br>
            申し込み日時: ${new Date(data.created_at).toLocaleString('ja-JP')}
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