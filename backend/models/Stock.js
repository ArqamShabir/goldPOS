const mongoose = require('mongoose');

const StockSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  itemName: { type: String, required: true },
  tagNumber: { type: String, required: true },
  karat: {type: Number, required: true, min: 1 },
  quantity: {type: Number , required: true, min: 1 },
  pieces: {type: Number, required: true , min: 1},
  itemPrice: {type: Number, required: true , min: 1},
  waste :  {type: Number, required: true , min: 0},
  totalWeight: {type: Number, required: true , min: 1 },
  makingPerGram: {type: Number, required: true , min: 1},
  totalMaking: {type: Number , required: true , min: 1},
  description: {type: String , required: true},
  status: { 
    type: String,
    required: true,
    enum: ['Pending', 'Complete'],
    default: 'Pending'
  },
  date: {
          type: String,
          default: () => {
            const now = new Date();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const year = now.getFullYear();
            return `${month}/${day}/${year}`;
          }
  }

}, { timestamps: true });

module.exports = mongoose.model('Stock', StockSchema);
