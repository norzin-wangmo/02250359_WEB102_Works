const { Pool } = require('pg');

const pool = new Pool({
  user: 'vireya',
  host: 'localhost',
  database: 'student_records',
  password: '',
  port: 5432,
});

async function testConnection() {
  let client;

  try {
    client = await pool.connect();
    console.log('Connected to PostgreSQL database!');

    const result = await client.query('SELECT * FROM students');

    console.table(result.rows);
    console.log(`Total students: ${result.rowCount}`);
  } catch (err) {
    console.error('Database connection error:', err.message);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

testConnection();