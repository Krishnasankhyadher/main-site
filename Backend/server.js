import express from'express'
import cors from 'cors'
import 'dotenv/config'
import connectdb from './config/mongodb.js'
import connectcloudinary from './config/cloudinary.js'
import userouter from './routes/userroutes.js'
import productroutes from './routes/productroutes.js'

import orderrouter from './routes/orderroutes.js'
import dotenv from 'dotenv'
import mailrouter from './routes/mailrouter.js'
import promorouter from './routes/promoroutes.js'
import collaboratorRoutes from "./routes/collaboratorRoutes.js";
import adminCollaborator from "./routes/adminCollaborator.js";
import router from './routes/payment.js'
import cookieParser from "cookie-parser";
import testimonialRoutes from './routes/testimonialRoutes.js';
import cartrouter from './routes/cartroutes.js'





//app config
const app=express()
const port =process.env.PORT || 5000
dotenv.config()
connectdb()
connectcloudinary()



//middleware
app.use(express.json())
const allowedOrigins = ['https://www.trendoor.in', 'http://localhost:5174']; // Add your localhost URL
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}))
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//api endpoints
app.use('/api/payment', router)
app.use('/api/user',userouter)
app.use('/api/product',productroutes)
app.use('/api/cart',cartrouter)

app.use('/api/order',orderrouter)
app.use('/api/mail',mailrouter)
app.use('/api/promo', promorouter)
app.use("/api/collaborator", collaboratorRoutes);
app.use("/api/admin/collaborator", adminCollaborator);
app.use("/api/testimonials", testimonialRoutes);
//api endpoint
app.get('/',(req,res)=>{
    res.send('api working')    
})
app.listen(port,()=>console.log('server started on port :' + port))