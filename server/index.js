const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// Set up MongoDB. Skipping connection error check to just let it start.
mongoose.connect('mongodb://127.0.0.1:27017/financial_simulator')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB connection error, ensure it is running (will run without DB):', err.message));

// Schema
const expenseSchema = new mongoose.Schema({
  amount: Number,
  frequency: String,
  category: String,
  yearly_spend: Number,
  future_loss_10_years: Number,
  suggestions: [String],
  createdAt: { type: Date, default: Date.now }
});

const Expense = mongoose.model('Expense', expenseSchema);

// Endpoint for processing data
app.post('/api/simulate', async (req, res) => {
  try {
    const { amount, frequency, category } = req.body;
    
    // Call Python AI Engine
    const aiResponse = await axios.post('http://127.0.0.1:5000/analyze', {
      amount: Number(amount),
      frequency,
      category
    });

    const aiData = aiResponse.data;

    const newExpense = new Expense({
      amount: Number(amount),
      frequency,
      category,
      yearly_spend: aiData.yearly_spend,
      future_loss_10_years: aiData.future_loss_10_years,
      suggestions: aiData.suggestions
    });

    try {
      if (mongoose.connection.readyState === 1) {
        await newExpense.save();
      }
    } catch(err) {
      console.log('Could not save to DB (perhaps not running), skipping save.');
    }

    res.json({
      success: true,
      data: {
        inputs: { amount, frequency, category },
        ai_insights: aiData
      }
    });

  } catch (error) {
    console.error('Simulation Error:', error.message);
    res.status(500).json({ success: false, error: 'Simulation Engine Unavailable' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend Server running on port ${PORT}`);
});
