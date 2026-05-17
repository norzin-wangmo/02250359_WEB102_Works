# Practical 3 — File Upload (Full Stack)

**Student ID:** 02250359  
**Module:** WEB102  
**Project folder:** `file-upload-project/`

---

## Aim

Build a **full-stack file upload application**: an Express backend with **Multer** for multipart uploads and a **Next.js** frontend with drag-and-drop, validation, and upload feedback.

---

## Instructions (from practical)

1. Create an Express server with **Multer** disk storage.  
2. Accept files via `POST /upload` (multipart form-data).  
3. Store files in `backend/uploads/` with timestamp-prefixed names.  
4. Serve uploaded files at `/uploads/:filename`.  
5. Build a Next.js UI with drag-and-drop (React Dropzone).  
6. Connect frontend to backend with **Axios** and configure **CORS**.  
7. Validate file types and handle errors.  
8. Document with screenshots of the working app.

---

## Technology stack

| Layer | Technologies |
|-------|----------------|
| Backend | Express, Multer, CORS, Morgan, dotenv |
| Frontend | Next.js 16, React 19, Tailwind CSS 4 |
| UI | React Dropzone, React Hook Form, Axios |

---

## Setup and run

### Backend

```bash
cd file-upload-project/backend
npm install
```

Create `backend/.env`:

```env
PORT=8000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

```bash
npm run dev
```

Server: http://localhost:8000

### Frontend

```bash
cd file-upload-project/frontend
npm install
npm run dev
```

App: http://localhost:3000

Run **both** terminals at the same time.

---

## Project structure

```
file-upload-project/
├── backend/
│   ├── server.js
│   └── uploads/          # Stored files
├── frontend/
│   ├── app/
│   └── components/
└── assets/               # Screenshots for report
```

---

## Solution — API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/upload` | Upload file (multipart field: `file`) |
| GET | `/uploads/:filename` | Download/view uploaded file |

### Allowed file types (backend)
- Images: JPEG, PNG  
- Documents: PDF  

### File naming
Files are saved as `{timestamp}-{originalName}` to avoid collisions.

### Example success response

```json
{
  "status": "success",
  "filename": "1776400475762-document.pdf",
  "filepath": "/uploads/1776400475762-document.pdf",
  "size": 102400,
  "mimetype": "application/pdf",
  "uploadedAt": "2026-04-16T12:00:00.000Z"
}
```

---

## Solution — Frontend flow

1. User drags a file onto the drop zone or clicks to browse.  
2. React Hook Form validates selection.  
3. Axios sends `FormData` to `POST http://localhost:8000/upload`.  
4. UI shows success message with file name and size.  
5. File appears in `backend/uploads/`.

---

## Evidence (screenshots)

### 1. Frontend upload interface
Drag-and-drop area and upload button:

![File Upload Interface](./file-upload-project/assets/ss1.png)

### 2. Upload success
Confirmation with file details:

![Upload Success](./file-upload-project/assets/ss2.png)

### 3. Backend uploads folder
Files stored on disk:

![Uploads Directory](./file-upload-project/assets/ss3.png)

### 4. Uploaded files in filesystem
Timestamp-prefixed filenames:

![Files Stored](./file-upload-project/assets/ss4.png)

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| CORS error | Set `FRONTEND_URL` in backend `.env` to match Next.js URL |
| Port in use | Change `PORT` or run `npm run dev -- -p 3001` on frontend |
| Invalid file type | Only JPEG, PNG, PDF allowed—see `fileFilter` in `server.js` |
| Upload folder missing | Server auto-creates `uploads/` on start |

---

## References

- [Multer](https://github.com/expressjs/multer)  
- [Next.js](https://nextjs.org/docs)  
- [React Dropzone](https://react-dropzone.js.org/)  
