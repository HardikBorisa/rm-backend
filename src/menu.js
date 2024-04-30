const express = require('express');
const router = express.Router();

// Import your database connection
const db = require('../db');

// Create a new menu item
router.post('/create', (req, res) => {
    const { title, sub_title, price, type } = req.body;
    const sql = 'INSERT INTO menu (title, sub_title, price,type) VALUES (?, ?, ?,?)';
    db.query(sql, [title, sub_title, price,type], (err, result) => {
        if (err) {
            console.error('Error creating menu item:', err);
            return res.status(500).json({ error: 'An internal server error occurred' });
        }
        res.json({ message: 'Menu item created successfully' });
    });
});

// Get all menu items
router.get('/list', (req, res) => {
    const sql = 'SELECT * FROM menu';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching menu items:', err);
            return res.status(500).json({ error: 'An internal server error occurred' });
        }
        res.json({ menu: results });
    });
});

router.get('/get/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM menu  WHERE id = ?';
    db.query(sql,[id],(err, results) => {
        if (err) {
            console.error('Error fetching menu items:', err);
            return res.status(500).json({ error: 'An internal server error occurred' });
        }
        res.json( results);
    });
});

router.get('/type/:type', (req, res) => {
    const type = req.params.type;
    const sql = 'SELECT * FROM menu WHERE type = ?';
    db.query(sql, [type], (err, results) => {
        if (err) {
            console.error('Error fetching menu items by type:', err);
            return res.status(500).json({ error: 'An internal server error occurred' });
        }
        res.json(results);
    });
});

// Update a menu item
router.put('/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    const { title, sub_title, price, type } = req.body;
    const sql = 'UPDATE menu SET title = ?, sub_title = ?, price = ?, type = ? WHERE id = ?';
    db.query(sql, [title, sub_title, price,type, id], (err, result) => {
        if (err) {
            console.error('Error updating menu item:', err);
            return res.status(500).json({ error: 'An internal server error occurred' });
        }
        res.json({ message: 'Menu item updated successfully' });
    });
});

// Delete a menu item
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM menu WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting menu item:', err);
            return res.status(500).json({ error: 'An internal server error occurred' });
        }
        res.json({ message: 'Menu item deleted successfully' });
    });
});

module.exports = router;
