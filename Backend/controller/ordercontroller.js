
import ordermodel from "../models/ordermodel.js"
import usermodel from "../models/usermodel.js";
const  placeorder = async (req, res)=>{
try {
    const {userid, items, amount, address}= req.body
    const orderdata ={
        userid,
        items,
        address,
        amount,
        paymentmethod:"cod",
        payment: false,
        date: Date.now()
    }
     const neworder= new ordermodel(orderdata)
     await neworder.save()
    await usermodel.findByIdAndUpdate(userid,{cartdata:{}})
    res.json({success:true, message:"order successful"})
} catch (error) {
    console.log(error);
    res.json({success:false , message:error.message})
    
}
}



const  placeorderrazorpay = async (req, res)=>{
    
}


const allorders = async (req, res) => {
  try {
    const orders = await ordermodel.find({});  // ✅ Await the actual data
    res.json({ success: true, orders });       // ✅ Return plain JSON-safe array
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


const  userorder = async (req, res)=>{
    try {
        const userid =req.user.id
        const order=await ordermodel.find({userid})
        res.json({success:true, order})
    } catch (error) {
        console.log(error)
        res.json({success:false ,message:error.message})
    }
}


const  updatestatus = async (req, res)=>{
    try {
      const {orderid, status}= req.body
      await ordermodel.findByIdAndUpdate(orderid,{status})
      res.json({success:true, message:'status updated'})
    } catch (error) {
      console.log(error)
        res.json({success:false ,message:error.message})
    }
}


export {placeorder,placeorderrazorpay,allorders,updatestatus,userorder}