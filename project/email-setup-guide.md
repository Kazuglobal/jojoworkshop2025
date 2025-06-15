# 📧 Email Notification Setup Guide

## 🚨 Current Issue: globalbunny77@gmail.com not receiving notifications

### Immediate Solutions (Choose One)

## Option 1: Quick Fix with Web3Forms (5 minutes, FREE)

1. **Go to [Web3Forms](https://web3forms.com)**
2. **Sign up with globalbunny77@gmail.com**
3. **Get your Access Key**
4. **Replace in script.js line ~XXX:**
   ```javascript
   const web3formsKey = 'YOUR_ACTUAL_WEB3FORMS_KEY'; // Replace with real key
   ```

## Option 2: Professional Setup with EmailJS (10 minutes, FREE)

1. **Go to [EmailJS](https://www.emailjs.com)**
2. **Create account and email service**
3. **Create templates:**
   
   **Admin Template:**
   ```
   Subject: 【Voice Atelier】新しいワークショップ申し込み
   
   新しい申し込みがありました：
   
   参加者名: {{child_name}}
   学年: {{grade}}
   保護者名: {{parent_name}}
   メール: {{email}}
   電話: {{phone}}
   経験: {{experience}}
   特別配慮: {{special_needs}}
   日時: {{created_at}}
   ```
   
   **User Template:**
   ```
   Subject: 【Voice Atelier】お申し込みありがとうございます
   
   {{parent_name}} 様
   
   ワークショップお申し込みありがとうございます。
   参加者: {{child_name}} ({{grade}})
   
   詳細は24時間以内にご連絡いたします。
   ```

4. **Update script.js:**
   ```javascript
   // Replace these with your EmailJS credentials
   const EMAILJS_SERVICE_ID = 'your_service_id';
   const EMAILJS_TEMPLATE_ADMIN = 'your_admin_template';
   const EMAILJS_TEMPLATE_USER = 'your_user_template';
   const EMAILJS_PUBLIC_KEY = 'your_public_key';
   ```

## Option 3: Supabase Edge Functions (Advanced)

### Step 1: Setup Resend
1. Go to [Resend](https://resend.com)
2. Sign up and get API key
3. Add to Supabase Environment Variables:
   ```
   RESEND_API_KEY=re_your_key_here
   ```

### Step 2: Deploy Edge Functions
```bash
supabase functions deploy send-admin-notification
supabase functions deploy send-thank-you-email
```

### Step 3: Test Functions
```bash
curl -X POST 'https://dgclcoaxalatwvyjeeld.supabase.co/functions/v1/send-admin-notification' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"to":"globalbunny77@gmail.com","subject":"Test","data":{"child_name":"Test Child"}}'
```

## 🔍 Debugging Current Issues

### Check Browser Console
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Look for:
   - ✅ "Email notification sent successfully"
   - ❌ "Email notification error"
   - 🔄 "Attempting backup email system"

### Check Network Tab
1. Submit form and watch Network tab
2. Look for:
   - `/functions/v1/send-admin-notification` (should be 200 OK)
   - Any failed requests (red entries)

### Check Supabase Logs
1. Go to Supabase Dashboard
2. Functions > Logs
3. Look for errors in Edge Functions

## 🚀 Immediate Temporary Solution

**Add this to browser console to test email manually:**

```javascript
// Test Web3Forms directly
const testData = {
    child_name: "テスト太郎",
    grade: "小学3年生", 
    parent_name: "テスト花子",
    email: "test@example.com",
    phone: "090-1234-5678",
    experience: "初心者",
    special_needs: "なし",
    created_at: new Date().toISOString()
};

// Send test email
fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        access_key: 'a9b8c7d6-e5f4-3c2b-1a09-8765432109876', // Demo key
        subject: '【Voice Atelier】テスト申し込み',
        email: 'globalbunny77@gmail.com',
        name: 'Voice Atelier システム',
        message: `テスト申し込み:\n参加者: ${testData.child_name}\n保護者: ${testData.parent_name}`
    })
}).then(r => r.json()).then(console.log);
```

## 📞 Emergency Contact Setup

If all else fails, the system will:
1. ✅ Save data to Supabase database 
2. 📧 Show delay notification to user
3. 📝 Log details in browser console
4. 💾 Store in localStorage for manual follow-up

**Manual check process:**
1. Check Supabase database for new registrations
2. Check browser localStorage for pending registrations
3. Contact users manually within 24 hours

## 🔧 Quick Fixes Priority

1. **Immediate (5min)**: Update Web3Forms key
2. **Short-term (1hr)**: Setup EmailJS  
3. **Long-term (1day)**: Fix Supabase Edge Functions
4. **Backup**: Manual monitoring system

Choose the solution that fits your technical comfort level!