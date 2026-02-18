
# RRapp Platform Documentation

A high-end, production-ready blog platform built for high performance, minimalism, and elite content creation. Optimized for deployment at **RRapp.github.io**.

## 🚀 Deployment Guide (GitHub Pages)

### 1. Prerequisites
- **GitHub Account**: Create a repository named `RRapp.github.io`.
- **Supabase Account**: Sign up at [supabase.com](https://supabase.com).
- **Google AI SDK**: Obtain an API Key for Gemini.

### 2. GitHub Pages Setup
Since this app uses `HashRouter` and ES6 modules, it is perfectly suited for GitHub Pages.
1. Push this code to your `RRapp.github.io` repository.
2. Go to **Settings > Pages**.
3. Under **Build and deployment**, select **GitHub Actions** as the source.
4. Create a new workflow `.github/workflows/deploy.yml` with the following:
   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [main]
   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v4
         - name: Setup Pages
           uses: actions/configure-pages@v4
         - name: Upload artifact
           uses: actions/upload-pages-artifact@v3
           with:
             path: '.'
         - name: Deploy to GitHub Pages
           uses: actions/deploy-pages@v4
   ```

### 3. Application Configuration
For the app to communicate with Supabase and Gemini, you must provide your credentials. In a GitHub Pages environment, you can either:
- Hardcode the **Anon Public Keys** in `services/supabase.ts` (Safe for public keys).
- Or, use a build-time replacement tool if you are using a bundler like Vite.

### 4. Database Setup (Supabase)
Run the following in the Supabase SQL Editor:
```sql
-- Create Profiles Table
create table profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  role text check (role in ('admin', 'editor', 'moderator', 'user')) default 'user',
  status text default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Posts Table
create table posts (
  id uuid default uuid_generate_v4() primary key,
  author_id uuid references profiles(id),
  title text not null,
  content text,
  status text check (status in ('draft', 'published', 'archived')) default 'published',
  view_count bigint default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

---

## 📖 User Manual

### For Readers
- **Explore**: Find content via `RRapp.github.io/#/explore`.
- **Command Palette**: Press `⌘K` or `Ctrl+K` for instant global search.

### For Creators
- **AI Suggestion**: Use the Gemini-powered writing assistant within the post editor.
- **Real-time Preview**: See your Markdown render instantly as you type.

---

## 🛡️ Admin Manual
- **Admin Hub**: Manage users and content at `RRapp.github.io/#/admin`.
- **System Stats**: View platform-wide performance and engagement metrics.
