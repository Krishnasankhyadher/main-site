import mongoose from 'mongoose'

const orderschema = new mongoose.Schema({
    userid : {type:String, required: true},
    items: [
    {
      _id: String,           // original MongoDB product ID
      name: String,
      price: Number,
      image: [String],
      category: String,
      subcategory: String,
      size: String,
      quantity: Number
    }
  ],
    amount : {type:Number, required: true},
    address : {type:Object, required: true},
    status : {type:String, required: true, default:'order placed'},
    paymentmethod : {type:String, required: true},
    payment : {type:Boolean, required: true, default:false},
    date : {type:Number, required: true},
})

const ordermodel= mongoose.models.order || mongoose.model('order',orderschema)
export default ordermodel