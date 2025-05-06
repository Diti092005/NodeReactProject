const User=require("../models/User")
const mongoose=require("mongoose")
const bankDetailsSchema=new mongoose.Schema({
    student:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"

    },
    bankNumber:{
        type:Number,
        required:true
    },
    bankAccount:{
        type:Number,
        required:true
    },
    bankBranch:{
        type:Number,
        required:true
    }
},{timestamps:true})
module.exports=mongoose.model("BankDetails",bankDetailsSchema)