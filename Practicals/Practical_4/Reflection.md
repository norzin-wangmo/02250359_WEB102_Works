# Practical 4 — Reflection

**Student ID:** 02250359  
**Module:** WEB102  
**Practical:** TikTok API with PostgreSQL + Prisma

---

## a) Documentation — Main concepts applied

### Relational databases
Data is stored in **PostgreSQL** tables with foreign keys. Unlike Practical 2’s in-memory objects, data **persists** after the server restarts.

### Prisma ORM
**Prisma** maps models in `schema.prisma` to TypeScript/JavaScript client calls. Migrations version the schema; `prisma generate` creates the client used in controllers.

### Schema design
- **One-to-many:** User → Videos, Video → Comments  
- **Many-to-many:** Likes via join models (`VideoLike`, `CommentLike`)  
- **Self-relation:** Follows (`Follow` with follower/following)  
- **Cascade deletes** keep referential integrity when a user or video is removed  

### Authentication
- **bcrypt** hashes passwords before storage (never store plain text).  
- **jsonwebtoken** issues signed tokens on login.  
- **Auth middleware** reads `Authorization: Bearer <token>`, verifies JWT, and attaches `req.user` for protected routes.  

### Environment configuration
`DATABASE_URL`, `JWT_SECRET`, and `PORT` live in `.env` so secrets are not committed to Git.

---

## b) Reflection — What I learned

### What I learned
- How to move from **mock data** to a real **SQL database**.  
- Prisma’s workflow: define schema → migrate → generate client → query in controllers.  
- How **JWT stateless auth** works for SPAs and mobile clients.  
- The difference between **public** and **protected** endpoints.  
- How **seeding** speeds up testing with known users and videos.  

### Challenges faced and how I overcame them

#### 1. PostgreSQL connection errors
**Challenge:** `Can't reach database server` or wrong credentials in `DATABASE_URL`.  
**How I fixed it:** Started PostgreSQL service, created `tiktok_db`, and matched username/password in `.env`.

#### 2. Prisma migration failures
**Challenge:** Schema changes conflicted with existing tables.  
**How I fixed it:** Used `npx prisma migrate dev` with a clear migration name; reset dev DB only when safe.

#### 3. JWT on protected routes
**Challenge:** `401 Unauthorized` on POST `/api/videos` even when logged in.  
**How I fixed it:** Copied token from login response exactly into Postman **Authorization → Bearer Token** header.

#### 4. Unique constraint errors on likes
**Challenge:** Liking the same video twice caused database errors.  
**How I fixed it:** Used `@@unique([userId, videoId])` in schema and handled duplicate like attempts in the controller.

#### 5. Password hashing on register
**Challenge:** Login failed after register because password was stored plain.  
**How I fixed it:** Applied `bcrypt.hash()` in register before `prisma.user.create()`.

### Suggested screenshots for your report
- Postman login showing JWT in response body  
- Postman authenticated POST creating a video  
- Prisma schema or database tables view  

---

## Summary

Practical 4 was a major step from **toy APIs** to a **production-shaped backend**: persistence, auth, and relational modelling. This foundation supports Practical 5’s cloud uploads and the full TikTok clone stack.
