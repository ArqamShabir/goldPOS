const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const authenticateUser = require('../middleware/auth');

// Get next tag number for frontend preview
router.get('/next-tag', authenticateUser, async (req, res) => {
  try {
    const lastOrder = await Order.findOne().sort({ createdAt: -1 });

    let nextTagNumber = "TAG001";

    if (lastOrder && lastOrder.tagNumber) {
      const lastNumber = parseInt(lastOrder.tagNumber.replace("TAG", "")) || 0;
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
    const lastOrder = await Order.findOne().sort({ createdAt: -1 });

    let newTagNumber = "TAG001";

    if (lastOrder && lastOrder.tagNumber) {
      const lastNumber = parseInt(lastOrder.tagNumber.replace("TAG", "")) || 0;
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
      totalMaking
    } = req.body;

    const newOrder = new Order({
      userId: req.userId,
      itemName,
      tagNumber: newTagNumber, // use auto-generated tag number
      karat,
      quantity,
      pieces,
      waste,
      totalWeight,
      itemPrice,
      makingPerGram,
      totalMaking
    });

    await newOrder.save();

    res.status(201).json({ message: 'Order created successfully', order: newOrder });

  } catch (err) {
    console.error("Error posting order:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
