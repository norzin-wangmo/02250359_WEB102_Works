const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'vireya',
  host: 'localhost',
  database: 'student_records',
  password: '',
  port: 5432,
});

app.get('/', (req, res) => {
  res.send('Student Records API is running');
});

app.get('/api/students', async (req, res) => {
  try {
    console.log('GET /api/students hit');

    const result = await pool.query('SELECT * FROM students ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching students:', err.message);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

app.post('/api/students', async (req, res) => {
  const { name, email, course, enrollment_date } = req.body;

  if (!name || !email || !course || !enrollment_date) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO students (name, email, course, enrollment_date)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, email, course, enrollment_date]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding student:', err.message);

    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email already exists' });
    }

    res.status(500).json({ error: 'Failed to add student' });
  }
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running at http://127.0.0.1:${PORT}`);
});