# Practical 2 — Reflection

**Student ID:** 02250359  
**Module:** WEB102  
**Practical:** TikTok-Style REST API

---

## a) Documentation — Main concepts applied

### Resource nesting and sub-routes
Beyond flat CRUD, I used **nested routes** such as `/api/videos/:id/comments` and `/api/users/:id/videos`. This models real-world APIs where related data is accessed through its parent resource.

### In-memory data modelling
All entities live in a single **JavaScript object** in `models/index.js`. Arrays inside user/video objects represent relationships (e.g. `likes[]`, `followers[]`) without SQL joins.

### HTTP semantics for actions
Social actions use meaningful verbs on resources:
- **POST** `/api/videos/:id/likes` — create a like association  
- **DELETE** `/api/videos/:id/likes` — remove it  
- **POST** `/api/users/:id/follow` — follow another user  

### Validation and error handling
Controllers check for missing IDs and return **404** when a video, user, or comment does not exist, and **400** for invalid input.

### Separation of concerns
`app.js` configures middleware; `index.js` starts the server; routes delegate to controllers—same pattern as Practical 1 but with a `src/` layout.

---

## b) Reflection — What I learned

### What I learned
- How to design APIs for **social features** (likes, follows) on top of CRUD.  
- That **in-memory storage** is fast for learning but unsuitable for production.  
- How **nested URLs** express relationships more clearly than only query parameters.  
- The importance of **consistent JSON shapes** so a future frontend can bind data easily.  
- How Practical 1’s structure scales when adding more entity types.

### Challenges faced and how I overcame them

#### 1. Keeping likes and followers in sync
**Challenge:** Liking a video required updating both the video’s `likes` array and avoiding duplicate likes.  
**How I fixed it:** Checked if the user ID already exists in `likes` before pushing; returned an error or ignored duplicate requests.

#### 2. Follow/unfollow logic
**Challenge:** Following had to update both users’ `followers` and `following` arrays.  
**How I fixed it:** On follow, push IDs to both sides; on unfollow, filter them out from both arrays.

#### 3. Data lost on restart
**Challenge:** Testing was confusing because data disappeared after `npm run dev` restarted.  
**How I understood it:** Accepted this as a limitation of in-memory storage—it motivated using a real database in Practical 4.

#### 4. Route parameter types
**Challenge:** `:id` from `req.params` is a string; comparisons with numeric IDs sometimes failed.  
**How I fixed it:** Used `parseInt(id, 10)` or loose equality consistently in controllers.

### Suggested screenshots
- Postman: list videos after creating two  
- Postman: follow user and view followers  
- Terminal showing server running on port 3000  

---

## Summary

Practical 2 strengthened my ability to build **feature-rich REST APIs** without a database. It prepared me for persistence (Practical 4) and file handling (Practicals 3 and 5) by reusing the same TikTok domain model.
