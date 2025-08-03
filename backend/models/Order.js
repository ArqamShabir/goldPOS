const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  itemName: { type: String, required: true },
  customerName: { type: String, required: true },
  tagNumber: { type: String, required: true, unique: true },
  karat: {type: Number, required: true, min: 0,       
    validate: {  
       validator: Number.isInteger,
       message: '{VALUE} is not an integer value for karat'
    }

  },
  quantity: {type: Number , required: true, min: 0,       
    validate: {  
       validator: Number.isInteger,
       message: '{VALUE} is not an integer value for quantity'
    }
  },
  pieces: {type: Number, required: true , min: 0,       
    validate: {  
       validator: Number.isInteger,
       message: '{VALUE} is not an integer value for pieces'
    }
  },
  itemPrice: {type: Number, required: true , min: 0},
  waste :  {type: Number, required: true , min: 0},
  totalWeight: {type: Number, required: true , min: 0  },
  makingPerGram: {type: Number, required: true , min: 0},
  totalMaking: {type: Number , required: true , min: 0},
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

module.exports = mongoose.model('Order', OrderSchema);
