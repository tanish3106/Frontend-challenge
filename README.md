# Learning Dashboard (5-file app)

## App code (only 5 files you edit)

| File | Role |
|------|------|
| `src/lib/data.ts` | Supabase + types + `getCourses()` |
| `src/components/Dashboard.tsx` | All UI + Framer Motion |
| `src/app/page.tsx` | Server page + Suspense |
| `src/app/layout.tsx` | HTML shell |
| `src/app/globals.css` | Tailwind + dark theme |

## Setup

1. `npm install` then copy `.env.example` → `.env.local` with Supabase URL + anon key.
2. In Supabase SQL Editor, run:

```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  progress INTEGER NOT NULL DEFAULT 0,
  icon_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON courses FOR SELECT USING (true);
INSERT INTO courses (title, progress, icon_name) VALUES
  ('Advanced React Patterns', 75, 'Code2'),
  ('Database Design Basics', 45, 'Database'),
  ('UI Layout Fundamentals', 60, 'Layout'),
  ('Web Development 101', 30, 'BookOpen');
```

3. `npm run dev` → http://localhost:3000

Config files (`package.json`, `tailwind.config.ts`, etc.) are required by Next.js and stay separate.
