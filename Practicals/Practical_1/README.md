# Practical 1 — API Design (Social Media API)

**Student ID:** 02250359  
**Module:** WEB102  
**Project folder:** `social-media-api/`

---

## Aim

Design and implement a **RESTful API** for a social-media-style application (similar to Instagram). The API must support core resources—users, posts, comments, likes, and followers—with proper HTTP methods, status codes, middleware, and documentation.

---

## Instructions (from practical)

1. Set up a Node.js + Express project with a clear folder structure (`controllers`, `routes`, `middleware`, `utils`).
2. Use **mock in-memory data** instead of a real database.
3. Implement **full CRUD** for all five resources.
4. Add middleware: CORS, Helmet, Morgan, error handling, and content negotiation (JSON default).
5. Provide an **API documentation** page (`/api-docs` or `public/docs.html`).
6. Test all endpoints in the browser or Postman.

---

## Technology stack

| Component | Technology |
|-----------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Data | Mock arrays (`utils/mockData.js`) |
| Security | Helmet, CORS, Morgan |
| Dev | Nodemon, dotenv |

---

## Setup and run

```bash
cd social-media-api
npm install
```

Create `.env`:

```env
PORT=3000
```

Start the server:

```bash
npm run dev
```

Open in browser:

- Home: http://localhost:3000  
- API docs: http://localhost:3000/api-docs  

---

## Project structure

```
social-media-api/
├── controllers/     # Business logic per resource
├── routes/          # Route definitions
├── middleware/      # async wrapper, errors, formatResponse
├── utils/           # mockData, errorResponse
├── public/          # docs.html
├── server.js
└── package.json
```

---

## Solution — data model

| Resource | Key fields | Relationships |
|----------|------------|---------------|
| Users | id, username, email, full_name, bio | Creates posts; has followers |
| Posts | id, caption, image, user_id | Belongs to user; has comments/likes |
| Comments | id, text, user_id, post_id | On a post |
| Likes | id, user_id, post_id | User likes a post |
| Followers | id, follower_id, following_id | Follow graph |

---

## Solution — API endpoints

### Users
| Method | Endpoint |
|--------|----------|
| GET | `/api/users` |
| GET | `/api/users/:id` |
| POST | `/api/users` |
| PUT | `/api/users/:id` |
| DELETE | `/api/users/:id` |

### Posts
| Method | Endpoint |
|--------|----------|
| GET | `/api/posts` |
| GET | `/api/posts/:id` |
| POST | `/api/posts` |
| PUT | `/api/posts/:id` |
| DELETE | `/api/posts/:id` |

### Comments, Likes, Followers
Same CRUD pattern under `/api/comments`, `/api/likes`, `/api/followers`.

### Pagination
```
GET /api/posts?page=1&limit=10
```

### Simulated authentication
Send header: `X-User-Id: 1` on protected-style routes where implemented.

---

## Testing the solution

### Browser

Visit these URLs after starting the server:

```
http://localhost:3000/api/users
http://localhost:3000/api/posts
http://localhost:3000/api/comments
http://localhost:3000/api/likes
http://localhost:3000/api/followers
http://localhost:3000/api-docs
```

You should see **JSON** responses (not XML).

### Postman (example)

**Create a post** — `POST http://localhost:3000/api/posts`

```json
{
  "caption": "Sunset photo",
  "image": "https://example.com/sunset.jpg",
  "user_id": 1
}
```

**Get users with pagination** — `GET http://localhost:3000/api/users?page=1&limit=5`

---

## Development phases (summary)

| Phase | Work completed |
|-------|----------------|
| Phase 1 | Project scaffold, users/posts CRUD, initial docs |
| Phase 2 | Fixed folder structure, content negotiation, comments/likes/followers CRUD, updated docs |

---

## Evidence (screenshots)

Add screenshots of your working API here after testing (browser JSON, Postman, docs page). Suggested captures:

1. `GET /api/users` showing JSON array  
2. `GET /api-docs` documentation page  
3. `POST /api/posts` in Postman with 201 response  

---

## References

- [Express.js](https://expressjs.com/)
- [REST API design](https://restfulapi.net/)
