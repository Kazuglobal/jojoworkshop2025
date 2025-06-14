# 🎼 Voice Atelier - ワークショップ申込サイト

世界的ボイストレーナー ジョジョ・アコスタ氏による特別ワークショップの申込サイトです。

## 🌟 特徴

- **高級感のあるデザイン**: ゴールドアクセントとグラデーション
- **完全レスポンシブ**: モバイル・タブレット・デスクトップ対応
- **Supabase連携**: データベース保存と自動メール送信
- **多層エラーハンドリング**: バックアップメール機能付き
- **リアルタイムバリデーション**: ユーザーフレンドリーなフォーム
- **進捗表示**: フォーム完了度の可視化

## 📁 ファイル構成

```
project/
├── index.html              # メインHTML
├── styles.css              # スタイルシート
├── script.js               # JavaScript機能
├── vite.config.ts          # Vite設定
├── package.json            # 依存関係
├── supabase-setup.sql      # データベース設定
├── deployment-guide.md     # デプロイ手順
├── setup-checklist.md     # セットアップ手順
└── supabase/
    └── functions/
        ├── send-admin-notification/
        └── send-thank-you-email/
```

## 🚀 クイックスタート

### 1. 開発環境での起動
```bash
npm install
npm run dev
```

### 2. ビルド
```bash
npm run build
```

### 3. プレビュー
```bash
npm run preview
```

## ⚙️ セットアップ

詳細な設定手順は `setup-checklist.md` を参照してください。

### 必要なサービス
1. **Supabase**: データベース・Edge Functions
2. **Resend**: メール送信サービス
3. **Web3Forms** (オプション): バックアップメール

### 環境変数
```bash
RESEND_API_KEY=your_api_key_here
```

## 📧 メール機能

### 管理者通知
- **宛先**: globalbunny77@gmail.com
- **内容**: 申込者詳細、24時間以内連絡リマインダー

### 申込者お礼メール
- **宛先**: 申込者のメールアドレス
- **内容**: 申込確認、ワークショップ詳細、今後の流れ

## 📱 フォーム項目

- 参加者名 (必須)
- 学年 (必須) - 小学1年生〜中学3年生
- 保護者名 (必須)
- メールアドレス (必須)
- 電話番号 (必須)
- 歌唱経験 (必須) - 初心者/少し経験あり/経験豊富
- 特別配慮事項 (任意)

## 🎨 デザインシステム

### カラーパレット
- **メイン**: ダークブルー (#1a1a2e)
- **アクセント**: ゴールド (#d4af37)
- **セカンダリ**: ライトゴールド (#f4e4a6)

### コンポーネント
- グラデーションボタン
- ガラスモーフィズム効果
- ホバーアニメーション
- パーティクルエフェクト

## 🔧 カスタマイズ

### 色の変更
`styles.css` の CSS変数を編集:
```css
:root {
    --accent-luxury: #d4af37;
    --accent-light-luxury: #f4e4a6;
    --bg-luxury: #1a1a2e;
}
```

### メール内容の変更
`supabase/functions/` 内のテンプレートを編集

## 📊 データベーススキーマ

```sql
TABLE registrations (
    id BIGSERIAL PRIMARY KEY,
    child_name TEXT NOT NULL,
    grade TEXT NOT NULL,
    parent_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    experience TEXT NOT NULL,
    special_needs TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🛡️ セキュリティ

- **RLS (Row Level Security)**: 有効化済み
- **匿名挿入**: 新規申込のみ許可
- **認証済み読取**: 管理者のみ全データ閲覧可能
- **API制限**: Supabaseで設定可能

## 🎯 ワークショップ詳細

- **日時**: 2025年6月21日（土）10:30〜12:00
- **会場**: UDCK（柏の葉アーバンデザインセンター）
- **対象**: 小学生〜中学生（7歳〜15歳）
- **定員**: 20名限定
- **講師**: ジョジョ・アコスタ氏（フィリピン出身の国際的ボイストレーナー）

## 📞 サポート

- **メール**: globalbunny77@gmail.com
- **担当**: 大舘

## 📄 ライセンス

このプロジェクトは教育目的で作成されています。