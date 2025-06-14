# Supabase & Email Setup Guide

## 1. Supabaseセットアップ

### データベーステーブル作成
1. Supabaseダッシュボードにログイン
2. SQL Editorを開く
3. `supabase-setup.sql`の内容を実行

### Edge Functions デプロイ
```bash
# Supabase CLIをインストール
npm install -g supabase

# プロジェクトにログイン
supabase login

# プロジェクトをリンク
supabase link --project-ref dgclcoaxalatwvyjeeld

# Edge Functionsをデプロイ
supabase functions deploy send-admin-notification
supabase functions deploy send-thank-you-email
```

## 2. Resend (メールサービス) セットアップ

### Resendアカウント作成
1. https://resend.com でアカウント作成
2. API Keyを取得
3. ドメイン認証（globalbunny.jp）

### 環境変数設定
Supabaseダッシュボード > Settings > Edge Functions > Environment Variables:
```
RESEND_API_KEY=your_resend_api_key_here
```

## 3. DNS設定（ドメイン認証用）

Resendでドメイン認証するために、globalbunny.jpのDNSに以下を追加：

```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@resend.com

Type: TXT  
Name: @
Value: v=spf1 include:_spf.resend.com ~all

Type: CNAME
Name: rs1._domainkey
Value: rs1.resend.com

Type: CNAME
Name: rs2._domainkey  
Value: rs2.resend.com
```

## 4. 動作確認

### テスト手順
1. ウェブサイトでフォーム送信
2. Supabaseテーブルにデータが保存されることを確認
3. 管理者にメール通知が届くことを確認
4. 申込者にお礼メールが届くことを確認

### デバッグ方法
- Supabase Edge Functions のログ確認
- ブラウザの開発者ツールでエラーチェック
- Network タブでAPI リクエストを確認

## 5. セキュリティ設定

### RLS (Row Level Security)
- 既に設定済み
- 匿名ユーザーは新規登録のみ可能
- 認証済みユーザーのみ全データ閲覧可能

### API制限
必要に応じてSupabaseでAPI制限を設定