# Practical 5 — Reflection

**Student ID:** 02250359  
**Module:** WEB102  
**Practical:** Cloud Bucket Storage (Supabase)

---

## a) Documentation — Main concepts applied

### Why cloud storage
Local `uploads/` folders **do not scale**: limited disk, no CDN, files lost on redeploy. **Supabase Storage** provides buckets, redundancy, and public URLs for media.

### Buckets and policies
- **`videos`** and **`thumbnails`** buckets hold binary files.  
- **Public buckets** allow read via CDN URL.  
- **RLS policies** on `storage.objects` control who can `SELECT` (view) and `INSERT` (upload). The browser uses the **anon** key, so policies must allow anon uploads for this lab architecture.

### Direct browser upload
The file goes **straight from the browser to Supabase**, not through Express. This reduces server load and is the standard pattern for large video files. The API only receives **metadata** (caption, `videoUrl`, `videoStoragePath`).

### Two Supabase clients
| Client | Key | Used for |
|--------|-----|----------|
| Server | Service role | Admin delete, server-side upload, migration |
| Browser | Anon (public) | User upload from `/upload` page |

The **service role key must never** appear in `NEXT_PUBLIC_*` variables.

### Database metadata
Prisma `Video` model fields:
- `url` — public playback URL  
- `videoStoragePath` — path inside bucket for delete/migration  
- `thumbnailStoragePath` — optional thumbnail path  

### Delete consistency
When deleting a video, the controller removes objects from Supabase **before** deleting the DB row so orphaned files do not remain.

### Migration path
`scripts/migrateVideosToSupabase.js` uploads legacy files from `uploads/` and updates records—important for apps that started on local storage (Practical 3 style).

---

## b) Reflection — What I learned

### What I learned
- The **limitations of local file storage** in web apps.  
- How **Supabase Storage** fits into a JWT-authenticated app without using Supabase Auth.  
- The **upload-then-register** pattern: cloud first, API second.  
- How to wire **Next.js + Express + Prisma + Supabase** as one system.  
- Security habits: separate keys, env files, and never expose service role to the client.

### Challenges faced and how I overcame them

#### 1. SQL Editor syntax error
**Challenge:** Pasting the file path `tiktok-api/scripts/supabase-storage-policies.sql` into Supabase SQL Editor caused a syntax error.  
**How I fixed it:** Opened the file locally and pasted only the `CREATE POLICY` statements.

![Storage policies applied successfully](./report-screenshots/04-sql.png)

#### 2. Storage policies and permission errors
**Challenge:** Browser upload failed because anon role lacked INSERT permission.  
**How I fixed it:** Ran the policy script so anon can upload to `videos` and `thumbnails` and public can read.

![Storage buckets configured](./report-screenshots/02-buckets.png)

#### 3. Environment variable confusion
**Challenge:** Risk of putting the service role key in the frontend.  
**How I fixed it:** Service key only in `tiktok-api/.env`; anon key only in `web/.env.local` with `NEXT_PUBLIC_` prefix.

![API credentials in dashboard](./report-screenshots/03-api.png)

#### 4. Port and URL mismatch
**Challenge:** Upload page could not reach API when ports differed.  
**How I fixed it:** Set API `PORT=5050`, `PUBLIC_BASE_URL=http://127.0.0.1:5050`, and `NEXT_PUBLIC_API_URL` to the same base.

![Servers running](./report-screenshots/09-terminal.png)

#### 5. End-to-end testing time
**Challenge:** Full upload-to-feed test needed both servers and valid Supabase keys.  
**How I progressed:** Verified configuration and code paths with screenshots; documented remaining step to add anon key and run live upload test.

### Implementation evidence

![Backend storage service](./report-screenshots/06-storage.png)

![Frontend upload service](./report-screenshots/07-upload-svc.png)

![Upload page code](./report-screenshots/08-upload-page.png)

![Prisma schema with storage paths](./report-screenshots/05-prisma.png)

---

## Summary

Practical 5 completed the journey from **REST APIs** (Practicals 1–2) → **file uploads** (3) → **databases and auth** (4) → **cloud media** (5). The TikTok clone now stores videos in **Supabase** while the API manages **metadata and auth**—a architecture close to real production apps.

For the full step-by-step report, see [WEB102_Practical_5_Report.md](./WEB102_Practical_5_Report.md).
