require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const app = express();
const port = 5100;

app.use(cors());
app.use(express.json());

// Get all students
app.get('/students', async (req, res) => {
  try {
    const students = await prisma.students.findMany();
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get student by ID
app.get('/students/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const student = await prisma.students.findUnique({
      where: { id }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new student
app.post('/students', async (req, res) => {
  try {
    const { name, age, grade, major } = req.body;

    const newStudent = await prisma.students.create({
      data: {
        name,
        age,
        grade,
        major
      }
    });

    res.status(201).json(newStudent);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(port, () => {
  console.log(`Prisma server running on http://localhost:${port}`);
});