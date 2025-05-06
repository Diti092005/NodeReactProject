const mongoose = require("mongoose");
const monthlyScholarshipDetailsSchema = new mongoose.Schema({
    date: {
        type: date,
        required: true
    },
    maximumNumberOfHours: {
        type: Number,
        required: true
    },
    sumPerHour: {
        type: Number,
        required: true
    }

},{timestamps:true})
module.exports=mongoose.model("MonthlyScholarshipDetails",monthlyScholarshipDetailsSchema)