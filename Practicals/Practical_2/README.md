# Practical 2 — TikTok-Style REST API

**Student ID:** 02250359  
**Module:** WEB102  
**Project folder:** `tiktok/`

---

## Aim

Extend API design skills by building a **TikTok-like backend** with users, videos, and comments. Implement CRUD operations plus social features: likes, follows, and nested routes (e.g. comments on a video).

---

## Instructions (from practical)

1. Create an Express API with `src/` structure (controllers, routes, models).
2. Store data in an **in-memory JavaScript object** (no database).
3. Implement CRUD for **users**, **videos**, and **comments**.
4. Add **like/unlike** for videos and comments.
5. Add **follow/unfollow** between users.
6. Return proper HTTP status codes and JSON bodies.
7. Test with browser and Postman.

---

## Technology stack

| Component | Technology |
|-----------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Data | In-memory store (`models/index.js`) |
| Testing | Browser, Postman |

---

## Setup and run

```bash
cd tiktok
npm install
```

Create `.env`:

```env
PORT=3000
NODE_ENV=development
```

Start:

```bash
npm run dev
```

Base URL: http://localhost:3000

---

## Project structure

```
tiktok/
├── src/
│   ├── controllers/
│   │   ├── videoController.js
│   │   ├── userController.js
│   │   └── commentController.js
│   ├── models/
│   │   └── index.js
│   ├── routes/
│   │   ├── videos.js
│   │   ├── users.js
│   │   └── comments.js
│   ├── app.js
│   └── index.js
└── package.json
```

---

## Solution — data model

### Users
`id`, `username`, `email`, `name`, `followers[]`, `following[]`, `createdAt`

### Videos
`id`, `title`, `description`, `url`, `userId`, `likes[]`, `createdAt`

### Comments
`id`, `text`, `userId`, `videoId`, `likes[]`, `createdAt`

### Relationships
- User → many videos  
- Video → many comments  
- Users can like videos/comments and follow each other  

---

## Solution — API endpoints

### Videos
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/videos` | List all videos |
| GET | `/api/videos/:id` | Get one video |
| POST | `/api/videos` | Create video |
| PUT | `/api/videos/:id` | Update video |
| DELETE | `/api/videos/:id` | Delete video |
| GET | `/api/videos/:id/comments` | Comments on video |
| POST | `/api/videos/:id/likes` | Like video |
| DELETE | `/api/videos/:id/likes` | Unlike video |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List users |
| GET | `/api/users/:id` | Get user |
| POST | `/api/users` | Create user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |
| GET | `/api/users/:id/videos` | User's videos |
| GET | `/api/users/:id/followers` | Followers |
| POST | `/api/users/:id/follow` | Follow user |
| DELETE | `/api/users/:id/follow` | Unfollow user |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/comments` | List comments |
| GET | `/api/comments/:id` | Get comment |
| POST | `/api/comments` | Create comment |
| PUT | `/api/comments/:id` | Update comment |
| DELETE | `/api/comments/:id` | Delete comment |
| POST | `/api/comments/:id/likes` | Like comment |
| DELETE | `/api/comments/:id/likes` | Unlike comment |

---

## Example solution output

**GET** `http://localhost:3000/api/videos`

```json
[
  {
    "id": 1,
    "title": "First Video",
    "description": "This is my first video",
    "url": "https://example.com/video1.mp4",
    "userId": 1,
    "likes": [],
    "createdAt": "2026-04-05T10:39:03.563Z"
  }
]
```

**POST** `http://localhost:3000/api/videos` — body:

```json
{
  "title": "Dance challenge",
  "description": "WEB102 demo",
  "url": "https://example.com/video2.mp4",
  "userId": 1
}
```

---

## Testing checklist

- [ ] List videos and users  
- [ ] Create, update, delete a video  
- [ ] Add comment to a video via `POST /api/comments` with `videoId`  
- [ ] Like and unlike a video  
- [ ] Follow and unfollow a user  
- [ ] Confirm data resets when server restarts (in-memory only)  

---

## Evidence (screenshots)

Capture Postman or browser results for:
1. `GET /api/videos`  
2. `POST /api/videos/:id/likes`  
3. `GET /api/users/:id/followers`  

---

## Notes

- Data is **not persistent**—restarting the server clears all records.  
- No JWT auth in this practical (added in Practical 4).  
- Detailed project README: `tiktok/README.md`
