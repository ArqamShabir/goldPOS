const express = require('express');
const router = express.Router();
const Stock = require('../models/Stock');
const authenticateUser = require('../middleware/auth');

// Get next tag number for frontend preview
router.get('/next-tag', authenticateUser, async (req, res) => {
  try {
    const lastStock = await Stock.findOne().sort({ createdAt: -1 });

    let nextTagNumber = "TAG001";

    if (lastStock && lastStock.tagNumber) {
      const lastNumber = parseInt(lastStock.tagNumber.replace("TAG", "")) || 0;
      const newNumber = lastNumber + 1;
      nextTagNumber = `TAG${String(newNumber).padStart(3, '0')}`;
    }

    res.json({ nextTagNumber });
  } catch (err) {
    console.error("Error generating next tag:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create order with auto-generated tag number
router.post('/', authenticateUser, async (req, res) => {
  try {
    const lastStock = await Stock.findOne().sort({ createdAt: -1 });

    let newTagNumber = "TAG001";

    if (lastStock && lastStock.tagNumber) {
      const lastNumber = parseInt(lastStock.tagNumber.replace("TAG", "")) || 0;
      const nextNumber = lastNumber + 1;
      newTagNumber = `TAG${String(nextNumber).padStart(3, '0')}`;
    }

    const {
      itemName,
      karat,
      quantity,
      pieces,
      waste,
      totalWeight,
      itemPrice,
      makingPerGram,
      totalMaking,
      description
    } = req.body;

    const newStockItem = new Stock({
      userId: req.userId,
      itemName,
      tagNumber: newTagNumber, 
      karat,
      quantity,
      pieces,
      waste,
      totalWeight,
      itemPrice,
      makingPerGram,
      totalMaking,
      description
    });

    await newStockItem.save();

    res.status(201).json({ message: 'Stock item created successfully', stock: newStockItem });

  } catch (err) {
    console.error("Error posting stock item:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
