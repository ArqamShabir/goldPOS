const express = require('express');
const axios = require('axios');
const router = express.Router();

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = 'gold-prices-pakistan.p.rapidapi.com';

router.get('/gold-rate-live', async (req, res) => {
  if (!RAPIDAPI_KEY) {
    return res.status(500).json({ error: 'API key is not configured.' });
  }

  const options = {
    method: 'GET',
    url: `https://${RAPIDAPI_HOST}/live`,
    headers: {
      'x-rapidapi-key': RAPIDAPI_KEY,
      'x-rapidapi-host': RAPIDAPI_HOST
    }
  };

  try {
    const response = await axios.request(options);
    const goldData = response.data;
    
    if (goldData && goldData['1 Tola'] && Array.isArray(goldData['1 Tola']) && goldData['1 Tola'].length > 3) {
      
      const prices = {
        '1 Tola': {
          '24K': goldData['1 Tola'][0],
          '22K': goldData['1 Tola'][1],
          '21K': goldData['1 Tola'][2],
          '18K': goldData['1 Tola'][3],
        },
        '10 Gram': {
          '24K': goldData['10 Gram'][0],
          '22K': goldData['10 Gram'][1],
          '21K': goldData['10 Gram'][2],
          '18K': goldData['10 Gram'][3],
        },
        '1 Gram': {
          '24K': goldData['1 Gram'][0],
          '22K': goldData['1 Gram'][1],
          '21K': goldData['1 Gram'][2],
          '18K': goldData['1 Gram'][3],
        },
        // '1 Ounce': {
        //   '24K': goldData['1 Ounce'][0],
        //   '22K': goldData['1 Ounce'][1],
        //   '21K': goldData['1 Ounce'][2],
        //   '18K': goldData['1 Ounce'][3],
        // },
      };

      res.json({
        message: 'Live gold prices in PKR fetched successfully.',
        prices: prices,
        lastUpdated: new Date().toISOString(),
      });
    } else {
      res.status(404).json({ error: 'Live gold price data not found in API response.' });
    }
  } catch (error) {
    console.error('Error fetching live gold rate:', error.message);
    res.status(500).json({
      error: 'Failed to fetch live gold rate from the external API.',
      details: error.message
    });
  }
});

module.exports = router;