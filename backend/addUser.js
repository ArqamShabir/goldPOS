// addUser.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');

const addUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const username = 'gift@gmail.com';
    const password = 'admin123';

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hash });
    await user.save();

    console.log('✅ Admin user created');
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error creating user:', err);
  }
};

addUser();
