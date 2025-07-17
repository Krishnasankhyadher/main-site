import express from 'express'
import { placeorder ,placeorderrazorpay,allorders,updatestatus,userorder} from '../controller/ordercontroller.js'
import authuser from '../middleware/auth.js'
import adminauth from "../middleware/adminauth.js"

const orderrouter= express.Router()

orderrouter.post('/list',adminauth,allorders)
orderrouter.post('/status',adminauth,updatestatus)

orderrouter.post('/place',authuser,placeorder)
orderrouter.post('/razorpay',authuser,placeorderrazorpay)


orderrouter.post('/userorder',authuser,userorder)

export default orderrouter