import express from 'express';
import mailmodel from '../models/mailmodel.js';

const mailrouter = express.Router();

mailrouter.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    const existing = await mailmodel.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already subscribed!' });
    }

    const newSubscriber = new mailmodel({ email });
    await newSubscriber.save();

    res.status(201).json({ success: true, message: 'Subscribed successfully!' });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default mailrouter;
