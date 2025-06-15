const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');

const app = express();
const port = 3000;

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Nirjara@121',
  database: 'nirjdb'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL database.');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'create_user.html'));
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  db.query('INSERT INTO users SET ?', { name, email, password }, (err) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).send('Error registering user.');
    }
    res.send('User registered successfully!');
  });
});

app.post('/add-employee', (req, res) => {
  const { name, role, project, rating, feedback } = req.body;
  db.query('INSERT INTO employees SET ?', { name, role, project, rating, feedback }, (err) => {
    if (err) {
      console.error('Error inserting employee:', err);
      return res.status(500).send('Error adding employee data.');
    }
    res.send('Employee data added successfully!');
  });
});

app.get('/search', (req, res) => {
  const { name } = req.query;
  db.query('SELECT * FROM employees WHERE name = ?', [name], (err, results) => {
    if (err) {
      console.error('Error searching employee:', err);
      return res.status(500).send('Error fetching employee data.');
    }
    res.json(results);
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
