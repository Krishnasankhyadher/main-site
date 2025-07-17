import express from "express"
import { addproduct,removeproduct,listproduct,singleproduct } from "../controller/productcontroller.js"
import upload from "../middleware/multer.js"
import adminauth from "../middleware/adminauth.js"
const productroutes = express.Router()

productroutes.post("/add",adminauth,upload.fields([{name:'image1', maxCount:1},{name:'image2', maxCount:1},{name:'image3', maxCount:1},{name:'image4', maxCount:1}]),addproduct)
productroutes.post("/single",adminauth,singleproduct)
productroutes.post("/remove",removeproduct)
productroutes.get("/list",listproduct)

export default productroutes