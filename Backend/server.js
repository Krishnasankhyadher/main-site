import express from'express'
import cors from 'cors'
import 'dotenv/config'
import connectdb from './config/mongodb.js'
import connectcloudinary from './config/cloudinary.js'
import userouter from './routes/userroutes.js'
import productroutes from './routes/productroutes.js'
import cartrouter from './routes/cartroutes.js'
import orderrouter from './routes/orderroutes.js'
import dotenv from 'dotenv'
import mailrouter from './routes/mailrouter.js'
import promorouter from './routes/promoroutes.js'

import router from './routes/payment.js'





//app config
const app=express()
const port =process.env.PORT || 5000
dotenv.config()
connectdb()
connectcloudinary()



//middleware
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }));

//api endpoints
app.use('/api/payment', router)
app.use('/api/user',userouter)
app.use('/api/product',productroutes)
app.use('/api/cart',cartrouter)
app.use('/api/order',orderrouter)
app.use('/api/mail',mailrouter)
app.use('/api/promo', promorouter)
//api endpoint
app.get('/',(req,res)=>{
    res.send('api working')    
})
app.listen(port,()=>console.log('server started on port :' + port))