const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authenticateUser = require('../middleware/auth');

router.get('/getUserInfo', authenticateUser, async (req, res) => {
    try {
        const userId = req.userId
        const user = await User.findById(userId);
        res.status(200).send({user})
    } catch (err) {
        console.error("Error fetching user information:", error);
        res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;