import express from 'express'
import { placeorder, placeorderrazorpay, allorders, updatestatus, userorder, verifyOrder, cancelOrder } from '../controller/ordercontroller.js'
import authuser from '../middleware/auth.js'
import adminauth from "../middleware/adminauth.js"

const orderrouter = express.Router()

orderrouter.post('/list', adminauth, allorders)
orderrouter.post('/status', adminauth, updatestatus)
orderrouter.post('/place', authuser, placeorder)
orderrouter.post('/razorpay', authuser, placeorderrazorpay)
orderrouter.post('/userorder', authuser, userorder)

// Add this line
orderrouter.post('/verify', authuser, verifyOrder)
orderrouter.post('/cancel',authuser,cancelOrder)

export default orderrouter