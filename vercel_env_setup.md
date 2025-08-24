# Vercel Environment Variables Setup

## 🔧 Add Environment Variables to Vercel

### 1. Go to Vercel Dashboard
- Visit: https://vercel.com/dashboard
- Select your project: `ofy-portfolio`

### 2. Navigate to Settings
- Click on your project
- Go to **Settings** tab
- Click on **Environment Variables**

### 3. Add These Environment Variables

#### Required Variables:
```
NEXT_PUBLIC_SUPABASE_URL=https://lsxafginsylkeuyzuiau.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzeGFmZ2luc3lsa2V1eXp1aWF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzI5NzQsImV4cCI6MjA1MDU0ODk3NH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8
```

### 4. Environment Selection
- ✅ **Production**
- ✅ **Preview** 
- ✅ **Development**

### 5. Save and Redeploy
- Click **Save**
- Go to **Deployments** tab
- Click **Redeploy** on the latest deployment

## 🚀 Alternative: Quick Fix

If you can't access Vercel right now, we can temporarily hardcode the values in the API:

```typescript
// In pages/api/newsletter.ts
const supabaseUrl = 'https://lsxafginsylkeuyzuiau.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzeGFmZ2luc3lsa2V1eXp1aWF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzI5NzQsImV4cCI6MjA1MDU0ODk3NH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8'

const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## 📋 Steps to Follow:

1. **Vercel Dashboard** → **Project Settings** → **Environment Variables**
2. **Add the two variables above**
3. **Save and redeploy**
4. **Test newsletter again**

This should fix the 500 error!
