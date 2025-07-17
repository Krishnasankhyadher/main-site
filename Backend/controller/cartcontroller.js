
import usermodel from '../models/usermodel.js'



const addtocart = async (req,res)=>{
    try {
        const { itemid, size }= req.body
        const userid= req.user.id
        const userdata =await usermodel.findById(userid)
        
        let cartdata= userdata.cartdata
        if(cartdata[itemid]){
          if(cartdata[itemid][size]){
            cartdata[itemid][size] += 1
          }else{
            cartdata[itemid][size] = 1
          }
        }else{
            cartdata[itemid]={}
            cartdata[itemid][size] = 1
        }
       await usermodel.findByIdAndUpdate(userid, {cartdata})
       
     res.json({success:true, message:'added to cart'})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
        
    }
    
}
const updatecart = async (req,res)=>{
    try {
        const { itemid, size, quantity } = req.body
const userid = req.user.id

        const userdata =await usermodel.findById(userid)
        let cartdata= userdata.cartdata
        cartdata[itemid][size]=quantity

         await usermodel.findByIdAndUpdate(userid, {cartdata})
       
     res.json({success:true, message:'cart updated'})

    } catch (error) {
                console.log(error);
        res.json({success:false, message:error.message})
        
    }
}
const getusercart = async (req,res)=>{
      try {
        const userid = req.user.id

        const userdata =await usermodel.findById(userid)
        let cartdata= userdata.cartdata
        res.json({success:true, cartdata})
      } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
      }
}

export {getusercart,updatecart,addtocart}