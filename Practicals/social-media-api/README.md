# Social Media API

## API Overview
This project is a RESTful Social Media API built using Node.js and Express. It simulates a backend system similar to Instagram and supports core resources such as users, posts, comments, likes, and followers.

The API allows clients to perform CRUD operations (Create, Read, Update, Delete) using proper HTTP methods. It also includes features such as content negotiation, error handling, and API documentation.

---

## Technology Stack
- Framework: Express.js  
- Language: JavaScript (Node.js)  
- Database: Mock data (in-memory arrays in mockData.js)  
- Authentication: Simulated using request headers  
- Documentation: HTML page (docs.html)  

---

## Setup Instructions

### 1. Clone the repository
git clone https://github.com/your-username/social-media-api.git  
cd social-media-api  

### 2. Install dependencies
npm install  

### 3. Configure environment
Create a .env file and add:
PORT=3000  

### 4. Start the server
npm run dev  

### 5. Open in browser
http://localhost:3000  

---

## Project Structure
social-media-api/
├── controllers/
├── routes/
├── middleware/
├── utils/
├── public/
├── server.js
├── package.json

---

## Database Schema

This project uses mock data instead of a real database.

### Users
- id  
- username  
- email  
- full_name  
- bio  

### Posts
- id  
- caption  
- image  
- user_id  

### Comments
- id  
- text  
- user_id  
- post_id  

### Likes
- id  
- user_id  
- post_id  

### Followers
- id  
- follower_id  
- following_id  

### Relationships
- A user can create many posts  
- A user can comment on many posts  
- A post can have many comments  
- A user can like many posts  
- A user can follow other users  

---

## Authentication & Security

### Authentication
Authentication is simulated using request headers such as X-User-Id.

### Security Measures
- Helmet for secure HTTP headers  
- CORS for cross-origin requests  
- Morgan for request logging  
- Custom error handling middleware  

---

## API Features

### Pagination
Pagination is implemented using query parameters:
?page=1&limit=10  

### File Uploads
Not implemented.

### Real-time Communication
Not implemented.

---

## Available Endpoints

### Users
- GET /api/users  
- GET /api/users/:id  
- POST /api/users  
- PUT /api/users/:id  
- DELETE /api/users/:id  

### Posts
- GET /api/posts  
- GET /api/posts/:id  
- POST /api/posts  
- PUT /api/posts/:id  
- DELETE /api/posts/:id  

### Comments
- GET /api/comments  
- GET /api/comments/:id  
- POST /api/comments  
- PUT /api/comments/:id  
- DELETE /api/comments/:id  

### Likes
- GET /api/likes  
- GET /api/likes/:id  
- POST /api/likes  
- PUT /api/likes/:id  
- DELETE /api/likes/:id  

### Followers
- GET /api/followers  
- GET /api/followers/:id  
- POST /api/followers  
- PUT /api/followers/:id  
- DELETE /api/followers/:id  

---

## Development Process

### Phase 1: Initial Development

#### Changes Made
- Created Node.js project  
- Installed dependencies (Express, CORS, Helmet, Morgan, Dotenv, Nodemon)  
- Built main server file (server.js)  
- Added mock data instead of using a real database  
- Implemented users and posts controllers  
- Created routes for users and posts  
- Created initial API documentation page (docs.html)  

#### Why These Changes Were Made
These changes were necessary to build the base structure of the API and satisfy the initial requirements of the practical.

---

### Problems Faced in Phase 1
- Incorrect folder structure  
- Missing files and modules  
- Documentation page not loading correctly  
- Comments, likes, and followers were incomplete  
- Browser showing XML instead of JSON due to content negotiation issue  

---

### Phase 2: Fixing and Completing

#### Changes Made
- Fixed folder structure (controllers, routes, middleware, utils)  
- Fixed server startup issues  
- Fixed content negotiation (JSON is now default instead of XML)  
- Improved homepage display  
- Implemented full CRUD operations for comments  
- Implemented full CRUD operations for likes  
- Implemented full CRUD operations for followers  
- Updated mock data to include new resources  
- Updated API documentation page to include all endpoints  

#### Why These Changes Were Made
These changes were required to fully complete the practical and ensure all required resources were properly implemented and working.

---

## Testing the API

Open these URLs in your browser:
http://localhost:3000/api/users  
http://localhost:3000/api/posts  
http://localhost:3000/api/comments  
http://localhost:3000/api/likes  
http://localhost:3000/api/followers  
http://localhost:3000/api-docs  

---

## Conclusion
This project demonstrates the design and implementation of a RESTful API using Node.js and Express. It includes all required resources such as users, posts, comments, likes, and followers.

The project was developed in two phases. The first phase focused on building the basic structure, while the second phase focused on fixing issues and completing missing features. Through this project, important backend development concepts such as routing, middleware, error handling, and RESTful API design were learned and applied.