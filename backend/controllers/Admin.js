import UserModel from "../models/user.js"
import { sendApprovalEmail, sendRejectionEmail, sendBlockNotification,sendUnblockNotification } from '../services/emailService.js';
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
const blockUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await UserModel.findByIdAndUpdate(userId, { userStatus: "block" }, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Send email notification
        await sendBlockNotification(user.email, user.name);

        res.status(200).json({ message: "User blocked successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
        console.error(error);
    }
};
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

const unblockUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await UserModel.findByIdAndUpdate(userId, { userStatus: "active" }, { new: true });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Send email notification
        await sendUnblockNotification(user.email, user.name);

        res.status(200).json({ message: "User unblocked successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
        console.error(error);
    }
};
// pending to either active or block
const approveUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await UserModel.findByIdAndUpdate(userId, { userStatus: "active" });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await sendApprovalEmail(user.email); // Send approval email
        res.status(200).json({ message: "User approved successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
        console.error(error);
    }
};

const rejectUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await UserModel.findByIdAndUpdate(userId, { userStatus: "block" });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await sendRejectionEmail(user.email); // Send rejection email
        res.status(200).json({ message: "User rejected successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
        console.error(error);
    }
};








export {Getuser,deletUser, addUser, blockUser, getDeletedUser, getPendingUser, getBlockUser, unblockUser, approveUser, rejectUser}