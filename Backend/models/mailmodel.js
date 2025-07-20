import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
   
  },
  
});

const mailmodel = mongoose.model('mail', subscriberSchema);

export default mailmodel;
