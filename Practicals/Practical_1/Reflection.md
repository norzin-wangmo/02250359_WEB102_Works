# Practical 1 — Reflection

**Student ID:** 02250359  
**Module:** WEB102  
**Practical:** API Design (Social Media API)

---

## a) Documentation — Main concepts applied

### RESTful API design
I applied REST principles by mapping resources (users, posts, comments, likes, followers) to URL paths and using HTTP verbs correctly: **GET** to read, **POST** to create, **PUT** to update, and **DELETE** to remove. Each response uses appropriate status codes (e.g. 200, 201, 404, 400).

### Express.js architecture
The application follows a **layered structure**: routes define endpoints, controllers contain business logic, and middleware handles cross-cutting concerns. This separation makes the codebase easier to maintain and extend.

### Middleware
- **CORS** — allows browser clients from other origins  
- **Helmet** — sets secure HTTP headers  
- **Morgan** — logs requests for debugging  
- **Custom error handler** — returns consistent JSON error bodies  
- **Content negotiation** — JSON is the default response format (fixed after the browser showed XML)

### Mock data layer
Instead of a database, data lives in **in-memory arrays** in `mockData.js`. This let me focus on routing and HTTP behaviour before introducing persistence in later practicals.

### API documentation
A static **HTML documentation page** (`public/docs.html`) lists endpoints and usage, satisfying the practical requirement to document the API for other developers.

### Pagination and headers
List endpoints support `?page=` and `?limit=` query parameters. Authentication is **simulated** with the `X-User-Id` header to practise how real auth would attach user context to requests.

---

## b) Reflection — What I learned

### What I learned
- How to structure a **production-style Express API** with controllers and routes.  
- The difference between **resource-oriented URLs** and action-oriented URLs.  
- Why **consistent error responses** matter for frontend and API consumers.  
- How **middleware order** affects request processing (e.g. error handler last).  
- That **content negotiation** (`Accept` header) can change response format—I learned to default to JSON for APIs.

### Challenges faced and how I overcame them

#### 1. Incorrect folder structure and missing modules
**Challenge:** Early on, imports failed because files were in the wrong folders or missing.  
**How I fixed it:** Reorganised into `controllers/`, `routes/`, `middleware/`, and `utils/`, and verified each `require()` path.

#### 2. Browser showing XML instead of JSON
**Challenge:** Visiting `/api/users` in Chrome displayed XML.  
**How I fixed it:** Updated content-negotiation middleware so **JSON is the default** unless the client explicitly requests XML.

#### 3. Incomplete resources (comments, likes, followers)
**Challenge:** Phase 1 only had users and posts working.  
**How I fixed it:** Implemented full CRUD for all three remaining resources and extended mock data and the docs page.

#### 4. Documentation page not loading
**Challenge:** `/api-docs` did not show the HTML page.  
**How I fixed it:** Served static files from `public/` and linked the correct route in `server.js`.

### Suggested screenshots for your report
When you submit, include:
- Browser view of `GET /api/users` (JSON)  
- API docs page  
- Postman create/update/delete for one resource  

---

## Summary

Practical 1 built a solid foundation in **REST API design** and **Express project structure**. The main takeaway is that good APIs need clear routes, predictable responses, and documentation—not only working endpoints.
