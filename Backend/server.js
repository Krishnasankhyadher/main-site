import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectdb from './config/mongodb.js'
import connectcloudinary from './config/cloudinary.js'
import userouter from './routes/userroutes.js'
import productroutes from './routes/productroutes.js'
import cartrouter from './routes/cartroutes.js'
import orderrouter from './routes/orderroutes.js'
import mailrouter from './routes/mailrouter.js'
import promorouter from './routes/promoroutes.js'
import router from './routes/payment.js'

// App config
const app = express()
const port = process.env.PORT || 5000
connectdb()
connectcloudinary()

// --- ROBUST CORS CONFIGURATION ---
const allowedOrigins = [
    'https://www.trendoor.in',
    'https://trendoor.in',
    'http://localhost:5173',
    'http://localhost:3000'
];

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or server-to-server)
        if (!origin) return callback(null, true);
        
        // Check if origin is in the allowed list
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            // Don't crash, just reject politely
            console.log('Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token']
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Handle Preflight Requests Explicitly
app.options('*', cors(corsOptions));

// 2. Apply CORS to all routes
app.use(cors(corsOptions));
// ---------------------------------

// API Endpoints
app.use('/api/payment', router)
app.use('/api/user', userouter)
app.use('/api/product', productroutes)
app.use('/api/cart', cartrouter)
app.use('/api/order', orderrouter)
app.use('/api/mail', mailrouter)
app.use('/api/promo', promorouter)

app.get('/', (req, res) => {
    res.send('API Working')
})

app.listen(port, () => console.log('Server started on port :' + port))
