-- ワークショップ申し込みテーブル作成
CREATE TABLE registrations (
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

-- RLS (Row Level Security) を有効化
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- 匿名ユーザーが新規レコードを挿入できるポリシー
CREATE POLICY "Allow anonymous insert" ON registrations
    FOR INSERT 
    TO anon 
    WITH CHECK (true);

-- 管理者のみが全レコードを閲覧できるポリシー
CREATE POLICY "Allow admin read" ON registrations
    FOR SELECT 
    TO authenticated 
    USING (true);

-- 更新時刻を自動更新するトリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_registrations_updated_at 
    BEFORE UPDATE ON registrations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- インデックス作成（パフォーマンス向上）
CREATE INDEX idx_registrations_created_at ON registrations(created_at);
CREATE INDEX idx_registrations_email ON registrations(email);