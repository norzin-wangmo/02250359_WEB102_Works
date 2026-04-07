# TikTok API ( Practical 2)

---

## API Overview

This project is a RESTful API that simulates a TikTok-like backend system.
It allows users to create videos, like/unlike videos, comment on videos, and manage user data.

The API uses an in-memory data store instead of a real database, making it suitable for development and testing purposes.

---

## Technology Stack

* Framework: Express.js
* Language: Node.js (JavaScript)
* Database: In-memory data store (JavaScript object)
* Authentication: Not implemented
* Documentation: Tested using browser and Postman

---

## Setup Instructions

### 1. Configure environment

Create a `.env` file in the root folder:

```env
PORT=3000
NODE_ENV=development
```

### 2. Start server

```bash
npm run dev
```

Server will run at:

```
http://localhost:3000
```

---

## Project Structure

```
src/
├── controllers/
│   ├── videoController.js
│   ├── userController.js
│   └── commentController.js
│
├── models/
│   └── index.js
│
├── routes/
│   ├── videos.js
│   ├── users.js
│   └── comments.js
│
├── app.js
└── index.js
```

---

## Database Schema

This project uses an in-memory JavaScript object instead of a database.

### Entities

### Users

* id
* username
* email
* name
* followers[]
* following[]
* createdAt

### Videos

* id
* title
* description
* url
* userId
* likes[]
* createdAt

### Comments

* id
* text
* userId
* videoId
* likes[]
* createdAt

### Relationships

* A user can create many videos
* A video can have many comments
* A user can like videos and comments

---

## Authentication & Security

* Auth Method: Not implemented
* Security Measures:

  * Basic input validation
  * Error handling for missing resources
  * Proper HTTP status codes

---

## API Features

### Core Features

* Create, Read, Update, Delete (CRUD) for:

  * Videos
  * Users
  * Comments

### Additional Features

* Like / Unlike videos
* Follow / Unfollow users
* Get comments of a video
* Get videos of a user

---

## API Endpoints

### Videos

* GET /api/videos
* GET /api/videos/:id
* POST /api/videos
* PUT /api/videos/:id
* DELETE /api/videos/:id
* GET /api/videos/:id/comments
* POST /api/videos/:id/likes
* DELETE /api/videos/:id/likes

---

### Users

* GET /api/users
* GET /api/users/:id
* POST /api/users
* PUT /api/users/:id
* DELETE /api/users/:id
* GET /api/users/:id/videos
* GET /api/users/:id/followers
* POST /api/users/:id/follow
* DELETE /api/users/:id/follow

---

### Comments

* GET /api/comments
* GET /api/comments/:id
* POST /api/comments
* PUT /api/comments/:id
* DELETE /api/comments/:id
* POST /api/comments/:id/likes
* DELETE /api/comments/:id/likes

---

## Example Output

### GET /api/videos

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

---

## Notes

* Data is stored in memory (not permanent)
* Data resets every time the server restarts
* No external database is used
* Designed for learning REST API fundamentals

---


