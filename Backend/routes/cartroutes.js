import express from 'express'
import { addtocart, updatecart, getusercart  } from '../controller/cartcontroller.js'
import authuser from '../middleware/auth.js'

const cartrouter= express.Router()

cartrouter.post('/get', authuser ,getusercart)
cartrouter.post('/adds', authuser ,addtocart)
cartrouter.post('/update', authuser ,updatecart)


export default cartrouter