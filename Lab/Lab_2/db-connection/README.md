# Student Records API

## API Overview

This API allows users to manage student records by connecting a Node.js backend to a PostgreSQL database. It supports retrieving and adding student data through RESTful endpoints.

---

## Technology Stack

* Framework: Express.js
* Language: Node.js (JavaScript)
* Database: PostgreSQL
* Authentication: None
* Documentation: Manual README

---

## Setup Instructions

1. Install dependencies
   npm install

2. Configure environment
   (No environment variables required for this project)

3. Run database setup
   Open PostgreSQL and run:

CREATE DATABASE student_records;

\c student_records

CREATE TABLE students (
id SERIAL PRIMARY KEY,
name VARCHAR(100),
email VARCHAR(100) UNIQUE,
course VARCHAR(100),
enrollment_date DATE
);

5. Start server
   node server.js

---

## Project Structure

db-connection/
├── db-test.js      # Database connection test
├── server.js       # Main API server
├── package.json    # Project configuration
└── README.md       # Documentation

---

## Database Schema

Students Table:

* id (Primary Key)
* name (Student name)
* email (Unique email)
* course (Course enrolled)
* enrollment_date (Date of enrollment)

---

## Authentication & Security

* Auth Method: Not implemented
* Security Measures:

  * Basic validation of request data
  * Unique email constraint in database

---

## API Features

* Fetch all students
  GET /api/students

* Add new student
  POST /api/students

Example request body:

{
"name": "Karma Pema",
"email": "[karma@example.com](mailto:karma@example.com)",
"course": "Cloud Computing",
"enrollment_date": "2023-03-15"
}

---

## Testing

Browser:
http://127.0.0.1:5000/api/students

cURL:
curl http://127.0.0.1:5000/api/students

---

## Conclusion

This project demonstrates how to build a backend API using Node.js and connect it to a PostgreSQL database without using an ORM. It highlights database connectivity, API development, and testing.
