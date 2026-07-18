This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## 🔐 GOOGLE OAUTH CONFIGURATION (Supabase Auth)

To set up Google Sign-In for Eat & Go, follow these steps:

### 1. Database Schema Migration
Since Google Sign-In does not initially provide a phone number, the `phone` column in the `users` table needs to be nullable, and we need to add an `email` column. Run the following SQL query in your **Supabase SQL Editor**:

```sql
-- 1. Make the phone column optional (nullable)
ALTER TABLE users ALTER COLUMN phone DROP NOT NULL;

-- 2. Add an email column to the users table if not already present
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255);
```

### 2. Configure Google Cloud Console (OAuth Consent Screen & Credentials)
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Configure the **OAuth Consent Screen** (User Type: External) and add the scope `.../auth/userinfo.profile` and `.../auth/userinfo.email`.
4. Go to **Credentials** -> **Create Credentials** -> **OAuth client ID**.
5. Select Application Type: **Web application**.
6. Under **Authorized redirect URIs**, add your Supabase project's auth callback URL:
   `https://<your-supabase-project-id>.supabase.co/auth/v1/callback`
7. Click **Create** and copy the generated **Client ID** and **Client Secret**.

### 3. Enable Google Provider in Supabase
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard) -> **Authentication** -> **Providers** -> **Google**.
2. Toggle on **Enable Google Provider**.
3. Paste the **Client ID** and **Client Secret** copied from Google Cloud Console.
4. (Optional) Save and ensure the settings are active.

### 4. Vercel Redirect Configuration
In Vercel, ensure that the redirect URL for OAuth includes the production URL. In the Supabase Dashboard -> **Authentication** -> **URL Configuration**:
- **Site URL**: `https://eatandgo.vercel.app` (or your actual production URL)
- **Redirect URLs**: Add `https://eatandgo.vercel.app/auth/callback` and `http://localhost:3000/auth/callback`.

