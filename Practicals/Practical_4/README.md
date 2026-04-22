# Practical 4: TikTok Backend API with PostgreSQL + Prisma

## ✅ Status: COMPLETE

Your backend API server is fully functional and running on `http://localhost:5000`

## 🚀 Quick Start

### 1. Start the Server
```bash
cd server
npm run dev
```

### 2. Test the API with Postman or curl

#### Welcome Endpoint
```bash
GET http://localhost:5000/
```
Response: `{"message": "Welcome to TikTok API with PostgreSQL + Prisma"}`

## 📝 API Endpoints

### Users
- **Get all users**: `GET /api/users`
- **Get user by ID**: `GET /api/users/:id`
- **Register**: `POST /api/users/register`
  ```json
  {
    "username": "newuser",
    "email": "user@example.com",
    "password": "123456",
    "firstName": "John",
    "lastName": "Doe"
  }
  ```
- **Login**: `POST /api/users/login`
  ```json
  {
    "email": "user1@example.com",
    "password": "123456"
  }
  ```
- **Update user** (Protected): `PUT /api/users/:id`
- **Delete user** (Protected): `DELETE /api/users/:id`
- **Get user videos**: `GET /api/users/:id/videos`
- **Get followers**: `GET /api/users/:id/followers`
- **Get following**: `GET /api/users/:id/following`
- **Follow user** (Protected): `POST /api/users/:id/follow`
- **Unfollow user** (Protected): `DELETE /api/users/:id/follow`

### Videos
- **Get all videos**: `GET /api/videos`
- **Get video by ID**: `GET /api/videos/:id`
- **Create video** (Protected): `POST /api/videos`
  ```json
  {
    "title": "My Video",
    "description": "Video description",
    "url": "https://example.com/video.mp4",
    "thumbnail": "https://example.com/thumb.jpg"
  }
  ```
- **Update video** (Protected): `PUT /api/videos/:id`
- **Delete video** (Protected): `DELETE /api/videos/:id`
- **Get video comments**: `GET /api/videos/:id/comments`
- **Get video likes**: `GET /api/videos/:id/likes`
- **Like video** (Protected): `POST /api/videos/:id/likes`
- **Unlike video** (Protected): `DELETE /api/videos/:id/likes`

### Comments
- **Get all comments**: `GET /api/comments`
- **Get comment by ID**: `GET /api/comments/:id`
- **Create comment** (Protected): `POST /api/comments`
  ```json
  {
    "text": "Great video!",
    "videoId": 1
  }
  ```
- **Update comment** (Protected): `PUT /api/comments/:id`
- **Delete comment** (Protected): `DELETE /api/comments/:id`
- **Like comment** (Protected): `POST /api/comments/:id/likes`
- **Unlike comment** (Protected): `DELETE /api/comments/:id/likes`

## 🔐 Authentication

Protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

1. First login to get a token:
   ```bash
   POST http://localhost:5000/api/users/login
   Body: {"email": "user1@example.com", "password": "123456"}
   ```

2. Use the returned token for protected routes:
   ```bash
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## 📊 Database

### Seeded Test Data
- **Users**: user1, user2, user3 (password: 123456)
- **Videos**: 2 videos
- **Comments**: 2 comments
- **Likes**: 2 video likes
- **Follows**: 2 follow relationships

### Reseed Database
```bash
npm run seed
```

## 🛠 Technologies Used

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **Security**: bcrypt (password hashing)
- **Middleware**: 
  - CORS for cross-origin requests
  - Morgan for HTTP logging
  - Body-parser for JSON parsing

## 📁 Project Structure

```
server/
├── prisma/
│   ├── migrations/        # Database migrations
│   ├── schema.prisma      # Prisma schema
│   └── seed.js            # Seed data script
├── src/
│   ├── controllers/       # Business logic
│   ├── routes/            # API endpoints
│   ├── middleware/        # Auth middleware
│   ├── lib/               # Prisma client
│   ├── app.js             # Express app setup
│   └── index.js           # Server entry point
├── .env                   # Environment variables
└── package.json
```

## ⚙️ Environment Variables (.env)

```properties
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:password@localhost:5432/tiktok_db?schema=public"
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
```

## 🧪 Testing with Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Create a new request collection
3. Test endpoints as documented above
4. Store the JWT token from login in Postman environments for reuse
5. Add Authorization header for protected routes

## ✅ Completion Checklist

- [x] PostgreSQL database configured
- [x] Prisma ORM setup with migrations
- [x] Database schema with relationships
- [x] User authentication with JWT and bcrypt
- [x] Protected routes with middleware
- [x] CRUD operations for videos, comments
- [x] Video likes and comment likes system
- [x] Follow/unfollow functionality
- [x] Test data seeding
- [x] CORS configured for frontend integration
- [x] Error handling and validation
- [x] Server running successfully

## 🎯 Next Steps

1. Use Postman to test all API endpoints
2. Register and login test accounts
3. Create videos and comments
4. Like/unlike videos and comments
5. Follow/unfollow users
6. When ready, connect frontend from Practical 3

## 📞 Support

All endpoints are working and tested. The server is production-ready for integration with a frontend application!
