import mongoose from "mongoose";

const userSechmea= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    userStatus:{
        type:String,
        enum:['active','block'],
        default:'active'
    },
    organization:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['admin',"user"],
        default:"user"
    },
    password:{
        type:String,
        required:true
    }
},{timestamps:true})


const UserModel= mongoose.model('users',userSechmea)


export default UserModel