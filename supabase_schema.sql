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
    FOR ALL TO authenticated USING (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
    );

CREATE POLICY "Admins have full access to posts" ON posts
    FOR ALL TO authenticated USING (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
    );

CREATE POLICY "Admins have full access to solutions" ON solutions
    FOR ALL TO authenticated USING (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
    );

CREATE POLICY "Admins have full access to inquiries" ON inquiries
    FOR ALL TO authenticated USING (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
    );

CREATE POLICY "Admins have full access to site_config" ON site_config
    FOR ALL TO authenticated USING (
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
    );

CREATE POLICY "Profiles are viewable by owners" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Profiles are editable by owners" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', 'admin');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

