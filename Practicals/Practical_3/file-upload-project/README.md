# File Upload Project (Practical 3)

---

## Project Overview

This project is a full-stack file upload application built with Express.js and Next.js. It allows users to upload files through an intuitive web interface and manage them on the server.

The application features a modern React-based frontend with drag-and-drop functionality and a Node.js backend that handles file storage and management using Multer.

---

## Technology Stack

### Backend
* Framework: Express.js
* Language: Node.js (JavaScript)
* File Handling: Multer
* Middleware: CORS, Morgan, body-parser
* Environment: dotenv

### Frontend
* Framework: Next.js 16
* Language: JavaScript (React 19)
* Styling: Tailwind CSS 4
* UI Components: React Dropzone, React Hook Form
* HTTP Client: Axios
* Package Manager: npm

---

## Setup Instructions

### Backend Setup

#### 1. Navigate to backend directory

```bash
cd backend
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Configure environment

Create a `.env` file in the backend folder:

```env
PORT=8000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

#### 4. Start the server

```bash
npm run dev
```

or

```bash
node server.js
```

Server will run at:

```
http://localhost:8000
```

---

### Frontend Setup

#### 1. Navigate to frontend directory

```bash
cd frontend
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Start the development server

```bash
npm run dev
```

Frontend will run at:

```
http://localhost:3000
```

---

## Project Structure

### Backend Structure

```
backend/
├── server.js              # Main server file
├── uploads/               # Directory for storing uploaded files
├── package.json
└── .env                   # Environment variables
```

### Frontend Structure

```
frontend/
├── app/
│   ├── layout.js          # Root layout component
│   ├── page.js            # Home page
│   ├── globals.css        # Global styles
│   └── favicon.ico
│
├── public/                # Static assets
│
├── components/            # Reusable React components
│
├── package.json
├── next.config.mjs
├── tailwind.config.mjs
├── postcss.config.mjs
└── jsconfig.json
```

---

## Features

### Backend Features
* File upload handling with Multer
* Static file serving from `/uploads` endpoint
* CORS support for cross-origin requests
* Request logging with Morgan
* Error handling for invalid file types
* Secure file naming with timestamps
* Automatic directory creation for uploads

### Frontend Features
* Drag-and-drop file upload interface
* Form validation with React Hook Form
* Beautiful, responsive UI with Tailwind CSS
* Real-time file upload status
* Axios integration for API communication
* React Dropzone for enhanced file handling

---

## API Endpoints

### File Upload
* **Endpoint:** `POST /upload`
* **Description:** Upload a file to the server
* **Request Body:** FormData with file
* **Response:** File upload status and file information

### Get Uploaded Files
* **Endpoint:** `GET /uploads/:filename`
* **Description:** Retrieve an uploaded file
* **Response:** File content

### Health Check
* **Endpoint:** `GET /`
* **Description:** Check if server is running
* **Response:** Status message

---

## File Upload Configuration

### Supported File Types
The backend accepts the following file types:
* Images: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
* Documents: `.pdf`, `.doc`, `.docx`, `.xls`, `.xlsx`
* Videos: `.mp4`, `.avi`, `.mov`, `.mkv`
* Archives: `.zip`, `.rar`, `.7z`

### File Size Limits
* Maximum file size: 50MB (configurable in multer settings)

### Storage
* Uploaded files are stored in the `backend/uploads/` directory
* Files are renamed with timestamp prefix to avoid conflicts

---

## Environment Variables

### Backend (.env)
```
PORT=8000                           # Server port
NODE_ENV=development                # Environment mode
FRONTEND_URL=http://localhost:3000  # Frontend URL for CORS
```

---

## Authentication & Security

### Security Measures
* CORS enabled for secure cross-origin requests
* File type validation on the backend
* File size restrictions
* Secure file naming with timestamps
* Morgan logging for request tracking
* Environment variables for sensitive configuration

---

## Running Both Servers

To run the project efficiently, open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

---

## Troubleshooting

### Port Already in Use
If port 8000 or 3000 is already in use, you can change it in:
* Backend: Modify `PORT` in `.env` file
* Frontend: Use `npm run dev -- -p 3001`

### CORS Errors
Ensure the `FRONTEND_URL` in the backend `.env` matches your frontend URL.

### File Upload Fails
* Check file size limits
* Verify file type is allowed
* Ensure `uploads/` directory exists

---

## Development Notes

### Adding New Routes
Routes should follow the pattern established in the main `server.js` file.

### Customizing Upload Path
Modify the `uploadDir` variable in `server.js` to change the upload directory.

### Frontend Customization
All frontend components and pages are in the `app/` directory. Modify them as needed using Tailwind CSS classes.

---

## Final Output

### Screenshots

#### 1. Frontend File Upload Interface
This screenshot shows the file upload interface with drag-and-drop functionality:

![File Upload Interface](./assets/ss1.png)

**Description:** The frontend displays a user-friendly form with:
- Drag-and-drop area for file selection
- File input button
- Form validation
- Upload status messages

#### 2. File Successfully Uploaded
This screenshot shows the success message after uploading a file:

![Upload Success](./assets/ss2.png)

**Description:** After successful upload, the interface shows:
- Success confirmation message
- File details (name, size, type)
- File preview or download link
- Option to upload another file

#### 3. Backend Uploads Directory
This screenshot shows where files are stored on the server:

![Uploads Directory](./assets/ss3.png)

**Description:** The files are stored in `backend/uploads/` directory with:
- Timestamp-prefixed filenames to avoid conflicts
- Original file name preserved
- Example: `1713375052377-document.pdf`
- Server log showing file upload confirmation

#### 4. File in Uploads Directory
This screenshot shows the actual uploaded files in the backend:

![Files Stored](./assets/ss4.png)

**Description:** The uploaded files visible in the file system:
- Multiple uploaded files with timestamp prefixes
- File sizes displayed
- File types (images, documents, etc.)
- Access location: `backend/uploads/`


### Output Format

The output of the file upload API will include the following information:

* **File Upload Response:**
  * `status`: Success or error message
  * `filename`: Name of the uploaded file
  * `filepath`: Path where the file was stored
  * `size`: File size in bytes
  * `mimetype`: File type (e.g., application/pdf)
  * `uploadedAt`: Timestamp of upload

* **File Retrieval Response:**
  * The content of the requested file if it exists
  * HTTP 404 error message if file does not exist
  * File served from `/uploads/:filename` endpoint

---

## References

* [Express.js Documentation](https://expressjs.com/)
* [Multer Documentation](https://github.com/expressjs/multer)
* [Next.js Documentation](https://nextjs.org/docs)
* [Tailwind CSS Documentation](https://tailwindcss.com/docs)
* [React Dropzone](https://react-dropzone.js.org/)
* [React Hook Form](https://react-hook-form.com/)
