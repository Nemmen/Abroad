import  jwt from 'jsonwebtoken'
import UserModel from '../models/user.js'
import dotenv from 'dotenv'
dotenv.config()


const isAdmin=async(req,res,next)=>{
    try {
         const token=req.cookies.token
         if (!token) {
            return res.status(401).json({messsage:"'Unauthorized: No token provided'"})
         }

         const decoded= jwt.verify(token,process.env.JWT_SECRET)
         const user=await UserModel.findById(decoded.userId)
         if (!user) {
            return res.status(401).json({messsage:"'user not found'"})
         }

         if (user.role !=='admin') {
            return res.status(403).json({messsage:'Unauthorized: User is not an admin'})
         }
       req.user=user
         next()
      
    } catch (error) {
        console.log(error)
    }
}

const IsUser = async (req, res, next) => {
   try {
     const token = req.cookies.token || req.headers.authorization?.split(" ")[1]; // Extract from cookies or headers
     if (!token) {
       return res.status(401).json({ message: "Unauthorized: No token provided" });
     }
 
     const decoded = jwt.verify(token, process.env.JWT_SECRET);
     const user = await UserModel.findById(decoded.userId);
     if (!user) {
       return res.status(401).json({ message: "User not found" });
     }
 
     req.user = user; // Attach user to request
     next();
   } catch (error) {
     console.log("Auth error:", error);
     res.status(401).json({ message: "Invalid or expired token" });
   }
 };

export {isAdmin,IsUser}