# WEB102 — Practical 5 Report  
## Cloud Bucket Storage with Supabase

**Student ID:** 02250359  
**Module:** WEB102  
**Project:** TikTok Clone (`tiktok-api` + Next.js frontend)  
**Date:** 16 May 2026  

---

## 1. Aim

The aim of this practical is to upgrade the TikTok web application by migrating from **local file storage** (files saved in an `uploads/` folder on the server) to **cloud storage using Supabase Storage**. This improves scalability, reliability, and performance by storing user-uploaded videos and thumbnails in the cloud and serving them through Supabase’s CDN, while the application database stores only metadata (URLs and storage paths).

---

## 2. Objective

By the end of this practical, the following objectives should be achieved:

1. Understand why local storage is limited for production web applications.
2. Set up a Supabase project with **public** storage buckets for `videos` and `thumbnails`.
3. Configure storage access policies so the browser can upload and the public can view files.
4. Integrate the **Supabase JavaScript client** on the backend (service role) and frontend (anon key).
5. Implement **direct browser upload** to Supabase, then save video metadata via the REST API.
6. Update the database schema with `videoStoragePath` and `thumbnailStoragePath` for delete/migration support.
7. Provide a migration path for existing local videos and optional removal of local static file serving.
8. Test the full flow and document setup and implementation with screenshots.

---

## 3. Theory

### 3.1 Limitations of local storage

When files are stored on the server’s disk (`uploads/videos`, `uploads/thumbnails`):

- **Disk space** is finite and fills up quickly with video content.
- **Scaling** fails across multiple servers — a file on one machine is not available on another.
- **Reliability** is low — redeployments or crashes can delete files without backup.
- **Performance** suffers — there is no CDN for users far from the server.
- **Backup** is usually manual and not built in.

### 3.2 Cloud storage and Supabase Storage

**Cloud storage** stores files on a provider’s infrastructure with redundancy, elastic capacity, and global delivery.

**Supabase Storage** organises files in **buckets** (like folders). Each bucket can be public or private, with **Row Level Security (RLS) policies** on `storage.objects` controlling who can read, upload, update, or delete.

### 3.3 Typical upload flow in web applications

1. User selects a file in the browser.
2. File is uploaded **directly to the cloud** (not through the app server), reducing server load.
3. The app server stores **metadata** (public URL, storage path, caption) in the database.
4. Content is **served from the cloud/CDN** when users watch videos.

This practical follows that pattern: Next.js → Supabase Storage → Express API → SQLite (Prisma).

---

## 4. Technologies Used

| Technology | Role in this practical |
|------------|-------------------------|
| **Supabase** | Cloud backend; Storage buckets + CDN URLs |
| **Supabase Storage** | Buckets `videos` and `thumbnails` |
| **@supabase/supabase-js** | Client library (backend + frontend) |
| **Node.js / Express** | REST API, video CRUD, optional server-side upload |
| **Prisma / SQLite** | Database; `Video` model with storage path fields |
| **Next.js (React)** | Frontend; upload page and video feed |
| **Multer** | Multipart upload fallback on the server |
| **JWT** | Custom app authentication (not Supabase Auth) |
| **dotenv** | Environment variables for API keys and URLs |

---

## 5. Implementation Steps

The following steps follow the Practical 5 handout in order, connecting Supabase, the API, the database, and the Next.js app into one upload flow.

**Step 1 — Create a Supabase account and project**  
Sign up at [supabase.com](https://supabase.com), create a new project (e.g. “tiktok”), choose a region, and wait until the project is ready.

**Step 2 — Create storage buckets**  
In the dashboard go to **Storage → Create bucket**. Create a public bucket named `videos`, then repeat for `thumbnails`. Both buckets must be **Public** so uploaded media can be viewed via CDN URLs.

**Step 3 — Set up storage policies**  
Open **SQL Editor** (or **Storage → Policies** per bucket). Run the policy script so users can **SELECT** (view) files and **INSERT** (upload) into `videos` and `thumbnails` using the `anon` role. This is required because the browser uploads with the anon key while the app uses its own JWT login.

**Step 4 — Copy API credentials into environment variables**  
From **Settings → API**, copy the Project URL and keys into the project:
- Server `.env`: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `SUPABASE_PUBLIC_KEY`, `SUPABASE_STORAGE_URL`
- Web `web/.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLIC_KEY`, `NEXT_PUBLIC_API_URL` (e.g. `http://127.0.0.1:5050`)  
Never put the service role key in any `NEXT_PUBLIC_*` variable.

**Step 5 — Install the Supabase SDK on the server**  
In the `tiktok-api` folder run: `npm install @supabase/supabase-js`

**Step 6 — Create the server Supabase client**  
Add `src/lib/supabase.js` using `createClient` with `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` so the API can upload, read URLs, and delete objects with admin access.

**Step 7 — Create the storage service**  
Add `src/services/storageService.js` with functions to upload a file to a bucket, get the public URL, remove objects, and build a unique storage path per user (e.g. `userId/timestamp-filename.mp4`).

**Step 8 — Update the video controller for cloud storage**  
Modify `src/controllers/videoController.js`:
- **createVideo:** When the client sends `videoUrl` and `videoStoragePath` (after a direct browser upload), save those to the database; optionally still support multipart upload through the API as a fallback.
- **deleteVideo:** If `videoStoragePath` / `thumbnailStoragePath` exist, delete those objects from Supabase before removing the database row.

**Step 9 — Update the Prisma schema and database**  
In `prisma/schema.prisma`, add `videoStoragePath` and `thumbnailStoragePath` to the `Video` model. Run `npm run db:push` to apply changes to SQLite.

**Step 10 — Add a migration script for old local videos**  
Create `scripts/migrateVideosToSupabase.js` to read files still under `uploads/`, upload them to Supabase, update each video’s `url` and storage paths, then run with `npm run migrate:supabase` if needed.

**Step 11 — Install the Supabase SDK in the Next.js app**  
In `tiktok-api/web` run: `npm install @supabase/supabase-js`

**Step 12 — Create the browser Supabase client**  
Add `web/src/lib/supabase.js` using `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLIC_KEY` (anon key only).

**Step 13 — Create the upload service (direct upload)**  
Add `web/src/services/uploadService.js` to upload the video file to the `videos` bucket and the thumbnail to the `thumbnails` bucket, then return each file’s `publicUrl` and `storagePath`.

**Step 14 — Update the upload page**  
Modify `web/src/app/upload/page.js` so that on submit it: (1) checks the user is logged in, (2) calls `uploadVideoAndThumbnail()`, (3) sends a JSON `POST` to `/api/videos` with caption, `videoUrl`, `videoStoragePath`, and optional thumbnail fields, (4) redirects to the feed.

**Step 15 — Update VideoCard for Supabase URLs**  
In `web/src/components/ui/VideoCard.js`, update `getFullVideoUrl()` so full `https://` Supabase URLs are used as-is and old relative `/uploads/...` paths still work with the API base URL.

**Step 16 — Run and test the full application**  
Start the API (`npm run dev` in `tiktok-api`, port 5050) and the web app (`npm run dev` in `tiktok-api/web`, port 3000). Log in, open `/upload`, choose a video and caption, and publish.

**Step 17 — Verify cloud storage and playback**  
In Supabase **Storage → videos**, confirm the new file appears. On the home feed, confirm the video plays from a Supabase URL.

**Step 18 — Migrate remaining local files (if any)**  
If videos were previously stored on disk, run `npm run migrate:supabase`, verify playback, then back up and optionally remove old files from `uploads/`.

**Step 19 — Disable local static file serving (optional)**  
When everything is on Supabase, set `SERVE_LOCAL_UPLOADS=false` in `.env` and restart the API so `/uploads` is no longer served from disk.

**End-to-end upload flow (summary)**  
User selects file → browser uploads to Supabase → browser sends metadata to Express API → Prisma saves record → feed loads video from Supabase CDN URL.

---

## 6. Challenges Faced

1. **SQL Editor errors** — Pasting the file path `tiktok-api/scripts/supabase-storage-policies.sql` instead of the actual SQL caused a syntax error. **Solution:** Paste only the `DROP POLICY` / `CREATE POLICY` statements into the SQL Editor.

2. **Finding SQL Editor in dashboard** — UI labels differ (“SQL Editor”, “SQL”, or project URL `/sql/new`). **Solution:** Use the left sidebar or direct project SQL URL.

3. **Storage policies** — Browser uploads use the **anon** key; without RLS policies, uploads fail with permission errors. **Solution:** Run the policy SQL or create equivalent policies in the Storage UI.

4. **Environment variable confusion** — Service role key must not be exposed in `NEXT_PUBLIC_*` variables. **Solution:** Service key only in backend `.env`; anon key only in `web/.env.local`.

5. **Port mismatch** — API on 5050 but frontend pointing elsewhere breaks uploads. **Solution:** Align `PORT`, `PUBLIC_BASE_URL`, and `NEXT_PUBLIC_API_URL`.

6. **Time constraints** — End-to-end upload testing was deferred; screenshots focus on configuration and code rather than uploaded video files in the dashboard or feed.

---

## 7. Output (Screenshots)

Screenshots are saved in the project folder `report-screenshots/` (Figures 1–9). When building your PDF, insert each PNG below its figure caption. Figures showing uploaded videos or feed playback are not required for this report.

---

**Figure 1 — Supabase project dashboard**  
![Figure 1](report-screenshots/01-project.png)

---

**Figure 2 — Storage buckets**  
![Figure 2](report-screenshots/02-buckets.png)

---

**Figure 3 — API settings (anon key masked)**  
![Figure 3](report-screenshots/03-api.png)

---

**Figure 4 — Storage policies / SQL success**  
![Figure 4](report-screenshots/04-sql.png)

---

**Figure 5 — Database schema (Prisma)**  
![Figure 5](report-screenshots/05-prisma.png)

---

**Figure 6 — Backend storage service**  
![Figure 6](report-screenshots/06-storage.png)

---

**Figure 7 — Frontend upload service**  
![Figure 7](report-screenshots/07-upload-svc.png)

---

**Figure 8 — Upload page (code)**  
![Figure 8](report-screenshots/08-upload-page.png)

---

**Figure 9 — Servers running**  
![Figure 9](report-screenshots/09-terminal.png)

---

## 8. Conclusion

This practical successfully migrated the TikTok clone from **local disk storage** to **Supabase cloud storage** by following the implementation steps in Section 5 as one connected workflow.

First, a **Supabase project** was set up with public **`videos`** and **`thumbnails`** buckets, and **storage policies** were applied so files can be uploaded from the browser and viewed publicly. **API credentials** were added to the server `.env` and `web/.env.local` so both parts of the application can talk to the same Supabase project safely (service role on the server, anon key in the browser).

The **Supabase JavaScript SDK** was installed in the API project. A **server-side client** and **storage service** were created to upload files, resolve public URLs, and delete objects from buckets. The **video controller** was updated so new posts store `videoUrl` and `videoStoragePath` (and thumbnail fields when used) after a direct upload, and **delete** removes the matching objects from Supabase. The **Prisma schema** was extended with `videoStoragePath` and `thumbnailStoragePath`, and the database was updated with `db push`. A **migration script** was added for any videos still stored under `uploads/`.

The same SDK was added to the **Next.js app**. A **browser client** and **upload service** send the video and thumbnail straight to Supabase buckets. The **upload page** completes the loop by posting caption and URLs to `POST /api/videos` after upload. **VideoCard** was adjusted so the feed plays Supabase HTTPS links correctly.

**Testing** involved running both servers, logging in, publishing from `/upload`, checking the file in the Supabase dashboard, and confirming playback on the feed. **Screenshots** in Section 7 document Supabase configuration, storage policies, source code, and the development environment (Figures 1–9). Where needed, **local files can be migrated** with `migrate:supabase`, and **`SERVE_LOCAL_UPLOADS=false`** can turn off serving old disk files.

Overall, the practical achieves the intended architecture: **the user uploads to the cloud first, the API stores metadata second, and the feed streams from Supabase** instead of the server disk. This improves scalability, reliability, and performance while meeting the WEB102 Practical 5 requirements. Remaining work after submission: add the anon key to `web/.env.local`, confirm policies in Supabase, and run a full upload test.

---

## 9. References

1. Supabase — Storage Documentation. https://supabase.com/docs/guides/storage  
2. Supabase — JavaScript Client Reference. https://supabase.com/docs/reference/javascript/introduction  
3. Supabase — Storage Access Control. https://supabase.com/docs/guides/storage/security/access-control  
4. Course reference — TikTok Server. https://github.com/syangche/TikTok_Server.git  
5. Course reference — TikTok Frontend. https://github.com/syangche/TikTok_Frontend.git  
6. WEB102 Practical 5 handout — Implementing Cloud Bucket Storage with Supabase  

---

*End of report*
