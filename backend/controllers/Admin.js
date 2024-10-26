import UserModel from "../models/user.js"

const Getuser=async(req,res)=>{
    try {
        const users=await UserModel.find()
         res.status(200).json({users})
    } catch (error) {
        res.status(500).json({message:"intenral server error"})
        console.log(error)
    }
}

// deleteUser but the user is not deleted just flaged as deleted
const deletUser=async(req,res)=>{
    try {
        const userId=req.params.id
        // check if the user is admin
        const checkAdmin=await UserModel.findById(userId )
        if (checkAdmin.role =='admin') {
            return  res.status(409).json({message:"you can not delete admin"})
        }
        const user=await UserModel.findByIdAndUpdate(userId,{isDeleted:true})
        if (!user) {
            return  res.status(404).json({message:"user not found"})
            }
        res.status(200).json({message:"user deleted successfully",user})
    } catch (error) {
        res.status(500).json({message:"intenral server error"})
        console.log(error)
    }
}

// addUser
const addUser=async(req,res)=>{
    try {
        const {name,email,password,role,organization,phoneNumber, state, city}=req.body
        const user=await UserModel.create({name,email,password,role,organization,phoneNumber, state, city,userStatus:"active"})
        res.status(200).json({message:"user added successfully",user})
    } catch (error) {
        res.status(500).json({message:"intenral server error"})
        console.log(error)
    }
}

// blockUser
const blockUser=async(req,res)=>{
    try {
        const userId=req.params.id
        const user=await UserModel.findByIdAndUpdate(userId,{userStatus:"block"})
        if (!user) {
          return  res.status(404).json({message:"user not found"})
        }
        res.status(200).json({message:"user block successfully",user})
    } catch (error) {
        res.status(500).json({message:"intenral server error"})
        console.log(error)
    }
}

// get user that are flagged as deleted

const getDeletedUser=async()=>{
    try {
        const users=await UserModel.find({isDeleted:true})
        return users
    } catch (error) {
        console.log(error)
    }
}

// get users that are flagged as pending
const getPendingUser=async()=>{
    try {
        const users=await UserModel.find({userStatus:"pending"})
        return users
    } catch (error) {
        console.log(error)
    }
}

// get users that are flagged as block
const getBlockUser=async()=>{
    try {
        const users=await UserModel.find({userStatus:"block"})
        return users
    } catch (error) {
        console.log(error)
    }
}
// unblock user

const unblockUser=async(req,res)=>{
    try {
        const userId=req.params.id
        const user=await UserModel.findByIdAndUpdate(userId,{userStatus:"active"})
        if (!user) {
          return  res.status(404).json({message:"user not found"})
        }
        res.status(200).json({message:"user unblock successfully",user})
    } catch (error) {
        res.status(500).json({message:"intenral server error"})
        console.log(error)
    }
}

// pending to either active or block
const approveUser=async(req,res)=>{
    try {
        const userId=req.params.id
        const user=await UserModel.findByIdAndUpdate(userId,{userStatus:"active"})
        if (!user) {
          return  res.status(404).json({message:"user not found"})
        }
        res.status(200).json({message:"user approved successfully",user})
    } catch (error) {
        res.status(500).json({message:"intenral server error"})
        console.log(error)
    }
}
const rejectUser=async(req,res)=>{
    try {
        const userId=req.params.id
        const user=await UserModel.findByIdAndUpdate(userId,{userStatus:"block"})
        if (!user) {
          return  res.status(404).json({message:"user not found"})
        }
        res.status(200).json({message:"user rejected successfully",user})
    } catch (error) {
        res.status(500).json({message:"intenral server error"})
        console.log(error)
    }
}








export {Getuser,deletUser, addUser, blockUser, getDeletedUser, getPendingUser, getBlockUser, unblockUser, approveUser, rejectUser}