const mongoose = require("mongoose")
const User = require("../models/User")
const studentScholarshipSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    date: {type: Date,
        required: true
    },
    numHours: { type: Number,
        required: true
     },
    sumMoney: { type: Number,
        required: true
     }
}, { timestamps: true })

module.exports = mongoose.model("StudentScholarship", studentScholarshipSchema)