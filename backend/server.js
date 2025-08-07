require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes')
const stockRoutes = require('./routes/stockRoutes')
const userRoutes = require('./routes/userRoutes')
const goldRoutes = require('./routes/goldRoutes'); 


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api', goldRoutes); 

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch(err => console.error("DB error", err));

// Login route
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Sanitize input (basic)
    if (typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Invalid input types' });
    }

    const user = await User.findOne({ username });

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/create-user-after-payment
app.post('/api/create-user-after-payment', async (req, res) => {
  const { name, username, password, phoneNumber } = req.body;

  try {
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ name, username, password: hash, phoneNumber });
    await user.save();

    // Generate token immediately
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    return res.status(201).json({ message: 'User created', token });
  } catch (err) {
    console.error("User creation error:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/verify-token', async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) return res.status(401).json({ message: 'User not found' });

    res.status(200).json({ message: 'Token valid', userId: decoded.userId });
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

app.use('/api/categories/custom', categoryRoutes);

app.use('/api/orders', orderRoutes);

app.use('/api/stocks', stockRoutes);

app.use('/api/users', userRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
