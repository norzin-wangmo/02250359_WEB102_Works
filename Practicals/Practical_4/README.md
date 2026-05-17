# Practical 4 — TikTok API with PostgreSQL + Prisma

**Student ID:** 02250359  
**Module:** WEB102  
**Project folder:** `server/`

---

## Aim

Replace in-memory storage with a **persistent PostgreSQL database** using **Prisma ORM**. Add **user registration, login, JWT authentication**, and protected routes for the TikTok-style API.

---

## Instructions (from practical)

1. Install and configure **PostgreSQL** locally.  
2. Initialise **Prisma** with schema, migrations, and seed data.  
3. Model users, videos, comments, likes, and follows with relations.  
4. Implement **bcrypt** password hashing and **JWT** tokens.  
5. Protect create/update/delete routes with auth middleware.  
6. Test all endpoints with Postman.  
7. Document setup, endpoints, and test credentials.

---

## Technology stack

| Component | Technology |
|-----------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT + bcrypt |
| Logging | Morgan, CORS |

---

## Setup and run

### Prerequisites
- PostgreSQL running locally  
- Database created (e.g. `tiktok_db`)

### Install and configure

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:password@localhost:5432/tiktok_db?schema=public"
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
```

### Database setup

```bash
npx prisma migrate dev
npm run seed
```

### Start server

```bash
npm run dev
```

API base: http://localhost:5000

Welcome endpoint:

```bash
GET http://localhost:5000/
```

Response:

```json
{ "message": "Welcome to TikTok API with PostgreSQL + Prisma" }
```

---

## Solution — database schema (Prisma)

| Model | Purpose |
|-------|---------|
| User | Accounts with hashed passwords |
| Video | Video metadata linked to user |
| Comment | Text on a video |
| VideoLike | Many-to-many user ↔ video likes |
| CommentLike | Likes on comments |
| Follow | Follower / following relationship |

Relations use `@relation`, `onDelete: Cascade`, and `@@unique` for like/follow pairs.

---

## Solution — authentication flow

1. **Register** — `POST /api/users/register`  
2. **Login** — `POST /api/users/login` → returns JWT  
3. **Protected routes** — header: `Authorization: Bearer <token>`

### Test accounts (seeded)

| Email | Password |
|-------|----------|
| user1@example.com | 123456 |
| user2@example.com | 123456 |
| user3@example.com | 123456 |

---

## Solution — API endpoints

### Users
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/users` | No |
| GET | `/api/users/:id` | No |
| POST | `/api/users/register` | No |
| POST | `/api/users/login` | No |
| PUT | `/api/users/:id` | Yes |
| DELETE | `/api/users/:id` | Yes |
| GET | `/api/users/:id/videos` | No |
| GET | `/api/users/:id/followers` | No |
| GET | `/api/users/:id/following` | No |
| POST | `/api/users/:id/follow` | Yes |
| DELETE | `/api/users/:id/follow` | Yes |

### Videos
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/videos` | No |
| GET | `/api/videos/:id` | No |
| POST | `/api/videos` | Yes |
| PUT | `/api/videos/:id` | Yes |
| DELETE | `/api/videos/:id` | Yes |
| GET | `/api/videos/:id/comments` | No |
| GET | `/api/videos/:id/likes` | No |
| POST | `/api/videos/:id/likes` | Yes |
| DELETE | `/api/videos/:id/likes` | Yes |

### Comments
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/comments` | No |
| GET | `/api/comments/:id` | No |
| POST | `/api/comments` | Yes |
| PUT | `/api/comments/:id` | Yes |
| DELETE | `/api/comments/:id` | Yes |
| POST | `/api/comments/:id/likes` | Yes |
| DELETE | `/api/comments/:id/likes` | Yes |

### Example: create video (protected)

`POST http://localhost:5000/api/videos`

Headers: `Authorization: Bearer <token>`

```json
{
  "title": "My Video",
  "description": "Video description",
  "url": "https://example.com/video.mp4",
  "thumbnail": "https://example.com/thumb.jpg"
}
```

---

## Project structure

```
server/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.js
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/    # auth middleware
│   ├── lib/             # Prisma client
│   ├── app.js
│   └── index.js
└── .env
```

---

## Reseed database

```bash
npm run seed
```

Seeded data includes 3 users, 2 videos, 2 comments, 2 video likes, and 2 follow relationships.

---

## Completion checklist

- [x] PostgreSQL configured  
- [x] Prisma schema and migrations  
- [x] JWT authentication and bcrypt  
- [x] Protected routes  
- [x] CRUD for videos and comments  
- [x] Likes and follow system  
- [x] Seed script and CORS  

---

## Evidence (screenshots)

Add screenshots for your report, for example:

1. Postman login response with JWT  
2. Postman `GET /api/videos` with data from DB  
3. Prisma Studio or pgAdmin showing tables  
4. Terminal: `npm run dev` and successful migration  

---

## Next steps

- Connect the Next.js frontend from Practical 3  
- Deploy database to a hosted PostgreSQL (e.g. Supabase Postgres) in later work  
