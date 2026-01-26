-- Supabase Schema for Project NEXUS (HK)

-- 1. Products Table
CREATE TABLE IF NOT EXISTS products (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    slug TEXT UNIQUE NOT NULL,
    name JSONB NOT NULL, -- {"hk": "...", "cn": "...", "en": "..."}
    description JSONB NOT NULL, -- {"hk": "...", "en": "..."}
    category TEXT NOT NULL,
    specs JSONB, -- {"cpu": "...", "ram": "...", "gpu": "..."}
    images TEXT[],
    model_3d_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Posts Table
CREATE TABLE IF NOT EXISTS posts (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title JSONB NOT NULL,
    content JSONB NOT NULL, -- Markdown content
    cover_image TEXT,
    tags TEXT[],
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Solutions Table
CREATE TABLE IF NOT EXISTS solutions (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title JSONB NOT NULL,
    icon TEXT, -- Lucide icon code
    features JSONB NOT NULL, -- List of features
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email TEXT NOT NULL,
    company TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Site Config Table
CREATE TABLE IF NOT EXISTS site_config (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Profiles Table (Extending Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'admin',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE solutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Public Access (Read-only for published content)
CREATE POLICY "Public can view published products" ON products
    FOR SELECT USING (status = 'published');

CREATE POLICY "Public can view published posts" ON posts
    FOR SELECT USING (published_at <= NOW());

CREATE POLICY "Public can view solutions" ON solutions
    FOR SELECT USING (true);

CREATE POLICY "Public can insert inquiries" ON inquiries
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view site config" ON site_config
    FOR SELECT USING (true);

-- Admin Access
CREATE POLICY "Admins have full access to products" ON products
    FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Admins have full access to posts" ON posts
    FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Admins have full access to solutions" ON solutions
    FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Admins have full access to inquiries" ON inquiries
    FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Admins have full access to site_config" ON site_config
    FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
