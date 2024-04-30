const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const menuRoutes = require('./src/menu');
const offersRoutes = require('./src/offer');
const jwt = require('jsonwebtoken')
const db = require('./db');

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL database: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

const app = express();
app.use(express.json());
app.use(cors());

// User registration route
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    console.log(name,email,password);
    // Hash the password
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'An internal server error occurred' });
        }
        
        const sql = 'INSERT INTO admin (name, email, password) VALUES (?, ?, ?)';
        db.query(sql, [name, email, hash], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'An internal server error occurred' });
            }
            res.json({ message: 'User registered successfully' });
        });
    });
});

// User login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM admin  WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        const user = results[0];
        bcrypt.compare(password, user.password, (bcryptErr, bcryptResult) => {
            if (bcryptErr || !bcryptResult) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }
            
            const token = jwt.sign({ id: user.id, email: user.email }, 'your_secret_key', { expiresIn: '1h' });
            res.json({ token });
        });
    });
});

// List all admins route
app.get('/user', (req, res) => {
    const sql = 'SELECT id, name, email FROM admin';
    db.query(sql, (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'An internal server error occurred' });
      }
      res.json(results);
    });
  });
  
  app.get('/user/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT id, name, email,password FROM admin where id = ?';
    db.query(sql,[id], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'An internal server error occurred' });
      }
      res.json(results);
    });
  });
  // Edit admin route
  app.put('/user/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'An internal server error occurred' });
      }
  
      const sql = 'UPDATE admin SET name = ?, email = ?, password = ? WHERE id = ?';
      db.query(sql, [name, email, hash, id], (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: 'An internal server error occurred' });
        }
        res.json({ message: 'Admin updated successfully' });
      });
    });
  });
  
  // Delete admin route
  app.delete('/user/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM admin WHERE id = ?';
    db.query(sql, [id], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'An internal server error occurred' });
      }
      res.json({ message: 'Admin deleted successfully' });
    });
  });
// Mount menu routes
app.use('/menu', menuRoutes);

// Mount offers routes
app.use('/offer', offersRoutes);
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
