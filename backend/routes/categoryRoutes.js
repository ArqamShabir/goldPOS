const express = require('express');
const router = express.Router();
const CustomCategory = require('../models/CustomCategory');
const authenticateUser = require('../middleware/auth');

router.get('/', authenticateUser, async (req, res) => {
  try {
    const categories = await CustomCategory.find({ userId: req.userId });
    const names = categories.map(c => c.name);
    res.json(names);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', authenticateUser, async (req, res) => {
  const { name } = req.body;
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ message: 'Category name required' });
  }

  try {
    const existing = await CustomCategory.findOne({ name, userId: req.userId });
    if (existing) {
      return res.status(409).json({ message: 'Category already exists' });
    }

    const newCategory = new CustomCategory({ name, userId: req.userId });
    await newCategory.save();

    res.status(201).json({ message: 'Category added successfully' });
  } catch (err) {
    console.error("Error adding category:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
