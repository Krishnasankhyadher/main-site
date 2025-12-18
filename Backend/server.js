// ... (imports remain the same)
import express from'express'
import cors from 'cors'
import 'dotenv/config'
import connectdb from './config/mongodb.js'
import connectcloudinary from './config/cloudinary.js'
// ... (keep all your router imports)
import userouter from './routes/userroutes.js'
import productroutes from './routes/productroutes.js'
import cartrouter from './routes/cartroutes.js'
import orderrouter from './routes/orderroutes.js'
import mailrouter from './routes/mailrouter.js'
import promorouter from './routes/promoroutes.js'
import router from './routes/payment.js'

//app config
const app=express()
const port =process.env.PORT || 5000
dotenv.config()
connectdb()
connectcloudinary()

// --- UPDATED MIDDLEWARE & CORS ---
const allowedOrigins = [
    'https://www.trendoor.in',
    'https://www.trendoor.in/', // Handle trailing slash
    'https://trendoor.in',
    'http://localhost:5173', 
    'http://localhost:3000'
];

const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token']
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply CORS globally
app.use(cors(corsOptions));

// Explicitly handle Preflight (OPTIONS) requests
app.options('*', cors(corsOptions));
// ---------------------------------

//api endpoints
app.use('/api/payment', router)
// ... (keep the rest of your endpoints)
app.use('/api/user',userouter)
app.use('/api/product',productroutes)
app.use('/api/cart',cartrouter)
app.use('/api/order',orderrouter)
app.use('/api/mail',mailrouter)
app.use('/api/promo', promorouter)

app.get('/',(req,res)=>{
    res.send('api working')    
})
app.listen(port,()=>console.log('server started on port :' + port))
