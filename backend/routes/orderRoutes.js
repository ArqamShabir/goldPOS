const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const authenticateUser = require('../middleware/auth');
const Stock = require('../models/Stock'); 


router.get('/next-tag', authenticateUser, async (req, res) => {
  try {
    //const lastOrder = await Order.findOne().sort({ createdAt: -1 });
    const lastOrder = await Order.findOne({ userId: req.userId }).sort({ createdAt: -1 });

    let nextTagNumber = "OR_TAG001";

    if (lastOrder && lastOrder.tagNumber) {
      const lastNumber = parseInt(lastOrder.tagNumber.replace("OR_TAG", "")) || 0;
      const newNumber = lastNumber + 1;
      nextTagNumber = `OR_TAG${String(newNumber).padStart(3, '0')}`;
    }

    res.json({ nextTagNumber });
  } catch (err) {
    console.error("Error generating next tag:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', authenticateUser, async (req, res) => {
  try {

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
      customerName
    } = req.body;

    const stockItem = await Stock.findOne({ userId: req.userId, itemName: itemName });

    if (!stockItem || stockItem.quantity < quantity) {
        return res.status(400).json({ message: `Insufficient stock for "${itemName}".` });
    }

    const updatedStock = await Stock.findOneAndUpdate(
      { userId: req.userId, itemName: itemName },
      {
          $inc: { quantity: -quantity } 
      }
  );

  if (!updatedStock) {
      return res.status(500).json({ message: 'Failed to update stock.' });
  }

   //const lastOrder = await Order.findOne().sort({ createdAt: -1 });
   const lastOrder = await Order.findOne({ userId: req.userId }).sort({ createdAt: -1 });

   let newTagNumber = "OR_TAG001";

   if (lastOrder && lastOrder.tagNumber) {
     const lastNumber = parseInt(lastOrder.tagNumber.replace("OR_TAG", "")) || 0;
     const nextNumber = lastNumber + 1;
     newTagNumber = `OR_TAG${String(nextNumber).padStart(3, '0')}`;
   }

    const newOrder = new Order({
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
      customerName
    });

    await newOrder.save();

    res.status(201).json({ message: 'Order created successfully', order: newOrder });

  } catch (err) {
    console.error("Error posting order:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/getOrders', authenticateUser , async (req,res)=>{
  try {
    const userId = req.userId;

    const orders = await Order.find({ userId: userId }).sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: 'Server error' });
  }
})

router.put('/:orderId',authenticateUser, async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const {
      itemName,
      customerName,
      karat,
      quantity,
      pieces,
      waste,
      totalWeight,
      itemPrice,
      makingPerGram,
      totalMaking,
      status,
    } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        itemName,
        customerName,
        karat,
        quantity,
        pieces,
        waste,
        totalWeight,
        itemPrice,
        makingPerGram,
        totalMaking,
        status,
      },
      { new: true } 
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(updatedOrder);

  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
