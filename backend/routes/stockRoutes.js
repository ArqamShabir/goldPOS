const express = require('express');
const router = express.Router();
const Stock = require('../models/Stock');
const authenticateUser = require('../middleware/auth');

router.get('/next-tag', authenticateUser, async (req, res) => {
  try {
    
    const lastStock = await Stock.findOne({ userId: req.userId }).sort({ createdAt: -1 });

    let nextTagNumber = "ST_TAG001";

    if (lastStock && lastStock.tagNumber) {
      const lastNumber = parseInt(lastStock.tagNumber.replace("ST_TAG", "")) || 0;
      const newNumber = lastNumber + 1;
      nextTagNumber = `ST_TAG${String(newNumber).padStart(3, '0')}`;
    }

    res.json({ nextTagNumber });
  } catch (err) {
    console.error("Error generating next tag:", err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/', authenticateUser, async (req, res) => {
  try {
    
    const lastStock = await Stock.findOne({ userId: req.userId }).sort({ createdAt: -1 });

    let newTagNumber = "ST_TAG001";

    if (lastStock && lastStock.tagNumber) {
      const lastNumber = parseInt(lastStock.tagNumber.replace("ST_TAG", "")) || 0;
      const nextNumber = lastNumber + 1;
      newTagNumber = `ST_TAG${String(nextNumber).padStart(3, '0')}`;
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
      tagNumber: newTagNumber, // per-user tag
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


router.get('/getStocks', authenticateUser, async (req, res) => {
  try {
    const userId = req.userId;
    const stocks = await Stock.find({ userId }).sort({ createdAt: -1 });
    res.status(200).send({ stocks });
  } catch (error) {
    console.error("Error fetching stocks:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:stockId', authenticateUser , async (req,res)=>{
  try{

    const stockId = req.params.stockId;
    const formData = req.body;

    const updatedStock = await Stock.findByIdAndUpdate(
      stockId,
      formData,
      {new:true}
    )

    if (!updatedStock) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(updatedStock);

  }catch(error){
    console.error('Error updating stock:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
})

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const Stock = require('../models/Stock');
// const authenticateUser = require('../middleware/auth');

// // Get next tag number for frontend preview
// router.get('/next-tag', authenticateUser, async (req, res) => {
//   try {
//     const lastStock = await Stock.findOne().sort({ createdAt: -1 });

//     let nextTagNumber = "ST_TAG001";

//     if (lastStock && lastStock.tagNumber) {
//       const lastNumber = parseInt(lastStock.tagNumber.replace("ST_TAG", "")) || 0;
//       const newNumber = lastNumber + 1;
//       nextTagNumber = `ST_TAG${String(newNumber).padStart(3, '0')}`;
//     }

//     res.json({ nextTagNumber });
//   } catch (err) {
//     console.error("Error generating next tag:", err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // Create order with auto-generated tag number
// router.post('/', authenticateUser, async (req, res) => {
//   try {
//     const lastStock = await Stock.findOne().sort({ createdAt: -1 });

//     let newTagNumber = "ST_TAG001";

//     if (lastStock && lastStock.tagNumber) {
//       const lastNumber = parseInt(lastStock.tagNumber.replace("ST_TAG", "")) || 0;
//       const nextNumber = lastNumber + 1;
//       newTagNumber = `ST_TAG${String(nextNumber).padStart(3, '0')}`;
//     }

//     const {
//       itemName,
//       karat,
//       quantity,
//       pieces,
//       waste,
//       totalWeight,
//       itemPrice,
//       makingPerGram,
//       totalMaking,
//       description
//     } = req.body;

//     const newStockItem = new Stock({
//       userId: req.userId,
//       itemName,
//       tagNumber: newTagNumber, 
//       karat,
//       quantity,
//       pieces,
//       waste,
//       totalWeight,
//       itemPrice,
//       makingPerGram,
//       totalMaking,
//       description
//     });

//     await newStockItem.save();

//     res.status(201).json({ message: 'Stock item created successfully', stock: newStockItem });

//   } catch (err) {
//     console.error("Error posting stock item:", err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// router.get('/getStocks' , authenticateUser , async (req,res)=>{
//   try{
//     const userId = req.userId
//     const stocks = await Stock.find({userId : userId}).sort({createdAt:-1})
//     res.status(200).send({stocks})
//   }catch(error){
//     console.error("Error fetching orders:", error);
//     res.status(500).json({ message: 'Server error' });
//   }
// })

// module.exports = router;
