const express = require('express');
const router = express.Router();

// Import your database connection
const db = require('../db');

// Create a new offer
router.post('/', (req, res) => {
    const { title, type } = req.body;
    const sql = 'INSERT INTO offers (title, type) VALUES (?, ?)';
    db.query(sql, [title, type], (err, result) => {
        if (err) {
            console.error('Error creating offer:', err);
            return res.status(500).json({ error: 'An internal server error occurred' });
        }
        res.json({ message: 'Offer created successfully' });
    });
});

// Get all offers
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM offers';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching offers:', err);
            return res.status(500).json({ error: 'An internal server error occurred' });
        }
        res.json(results);
    });
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM offers where id = ?';
    db.query(sql,[id], (err, results) => {
        if (err) {
            console.error('Error fetching offers:', err);
            return res.status(500).json({ error: 'An internal server error occurred' });
        }
        res.json(results);
    });
});

// Update an offer
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const { title, type } = req.body;
    const sql = 'UPDATE offers SET title = ?, type = ? WHERE id = ?';
    db.query(sql, [title, type, id], (err, result) => {
        if (err) {
            console.error('Error updating offer:', err);
            return res.status(500).json({ error: 'An internal server error occurred' });
        }
        res.json({ message: 'Offer updated successfully' });
    });
});

router.get('/type/:type', (req, res) => {
    const type = req.params.type;
    const sql = 'SELECT * FROM offers WHERE type = ?';
    db.query(sql, [type], (err, results) => {
        if (err) {
            console.error('Error fetching offers by type:', err);
            return res.status(500).json({ error: 'An internal server error occurred' });
        }
        res.json(results);
    });
});

// Delete an offer
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM offers WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting offer:', err);
            return res.status(500).json({ error: 'An internal server error occurred' });
        }
        res.json({ message: 'Offer deleted successfully' });
    });
});

module.exports = router;
