const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
    },
    address: {
        street: {
            type: String
        },
        numOfBulding: {
            type: String
        },
        city: {
            type: String
        } 
    },
    birthDate: {
        type: Date
    }, 
    role: {
        type: String,
        enum: ['Student', 'Admin','Donor'],
        default: "Student",
        required:true
    },
    active:{
        type:Boolean,
        default:true
    }
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)