import jwt from "jsonwebtoken";

const adminauth = async (req, res, next) => {
 try {
    const {token}=req.headers 
    if (!token) {
        return res.json({success:false,message:"not authorized again"})
        
    }
    const tokendecode =jwt.verify(token,process.env.JWT_SECRET)
    if  (
      tokendecode.email !== process.env.ADMIN_EMAIL ||
      tokendecode.password !== process.env.ADMIN_PASSWORD
    ) {
           return res.json({success:false,message:"not authorized again"})
    }
    next()
 } catch (error) {
    console.log(error)
    res.json({success:false, message:error.message})
 }
}
export default adminauth
