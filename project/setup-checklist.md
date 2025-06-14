# 🎼 Voice Atelier Setup Checklist

## ✅ 完了済み項目

### フロントエンド
- [x] レスポンシブフォーム作成
- [x] Supabase JavaScript SDK統合
- [x] リアルタイムバリデーション
- [x] モバイル最適化
- [x] 進捗インジケーター
- [x] 送信確認モーダル
- [x] エラーハンドリング
- [x] 前回ワークショップ記事追加

### バックエンド準備
- [x] データベーステーブル設計 (`supabase-setup.sql`)
- [x] Edge Functions作成
  - [x] `send-admin-notification`
  - [x] `send-thank-you-email`
- [x] バックアップメール機能 (Web3Forms)
- [x] 手動フォローアップシステム

## 🚀 次に実行する手順

### 1. Supabase設定 (5分)
```bash
# 1. Supabaseダッシュボードにログイン
# 2. SQL Editorで以下を実行:
cat supabase-setup.sql
```

### 2. Edge Functions デプロイ (10分)
```bash
# Supabase CLIインストール
npm install -g supabase

# ログイン
supabase login

# プロジェクトリンク
supabase link --project-ref dgclcoaxalatwvyjeeld

# Functions デプロイ
supabase functions deploy send-admin-notification
supabase functions deploy send-thank-you-email
```

### 3. Resend設定 (5分)
1. https://resend.com でアカウント作成
2. API Key取得
3. Supabase Environment Variables設定:
   ```
   RESEND_API_KEY=your_key_here
   ```

### 4. バックアップメール設定 (任意 - 3分)
1. https://web3forms.com でアカウント作成
2. Access Key取得
3. `script.js`の`YOUR_WEB3FORMS_KEY`を置換

### 5. DNS設定 (ドメイン所有者のみ)
```
# globalbunny.jp のDNSに追加
TXT @ "v=spf1 include:_spf.resend.com ~all"
TXT _dmarc "v=DMARC1; p=quarantine; rua=mailto:dmarc@resend.com"
CNAME rs1._domainkey "rs1.resend.com"
CNAME rs2._domainkey "rs2.resend.com"
```

## 🧪 テスト手順

### 基本テスト
1. [ ] フォーム送信が成功する
2. [ ] Supabaseにデータが保存される
3. [ ] 管理者にメール通知が届く
4. [ ] 申込者にお礼メールが届く

### エラーハンドリングテスト
1. [ ] 必須項目なしでエラー表示
2. [ ] 無効なメールアドレスでエラー表示
3. [ ] ネットワークエラー時の適切な処理

### モバイルテスト
1. [ ] モバイルでフォーム入力が快適
2. [ ] 進捗バーが正常に動作
3. [ ] 送信確認モーダルが適切に表示

## 📊 機能概要

### 実装済み機能
- ✅ **フォーム送信**: Supabase連携
- ✅ **メール通知**: 管理者 + 申込者
- ✅ **バックアップ**: Web3Forms連携
- ✅ **ログ**: Console + LocalStorage
- ✅ **UI/UX**: 高級感のあるデザイン
- ✅ **レスポンシブ**: 全デバイス対応
- ✅ **バリデーション**: リアルタイム検証
- ✅ **進捗表示**: フォーム完了度
- ✅ **エラー処理**: 多層エラーハンドリング

### フォーム項目
- 参加者名 (必須)
- 学年 (必須)
- 保護者名 (必須)
- メールアドレス (必須)
- 電話番号 (必須)
- 歌唱経験 (必須)
- 特別配慮事項 (任意)

### メール機能
1. **管理者通知**: `globalbunny77@gmail.com`
   - 申込者情報詳細
   - 24時間以内連絡リマインダー

2. **申込者お礼メール**
   - 申込内容確認
   - ワークショップ詳細
   - 今後の流れ案内

## 🔧 設定ファイル

### 環境変数 (Supabase)
```
RESEND_API_KEY=your_resend_api_key
```

### 設定項目 (script.js)
```javascript
// Supabase設定
const SUPABASE_URL = 'https://dgclcoaxalatwvyjeeld.supabase.co'
const SUPABASE_ANON_KEY = 'your_anon_key'

// バックアップメール設定
const web3formsKey = 'YOUR_WEB3FORMS_KEY' // 置換必要
```

## 📞 サポート

問題が発生した場合:
1. ブラウザのコンソールでエラー確認
2. Supabase Edge Functions ログ確認
3. ネットワークタブでAPI リクエスト確認

すべて設定完了後、完全に動作するワークショップ申込システムになります！