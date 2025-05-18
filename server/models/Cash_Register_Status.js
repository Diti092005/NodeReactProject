const mongoose = require("mongoose")
const cashRegisterStatusSchema = new mongoose.Schema({
    action: {
        type: String,
        enum: ['Expense', 'Income'],
        required:true
    },
    date: {
        type: Date,
        required: true
    },
    sumPerAction:{type:Number,
        required: true
    },
    currentSum: { type: Number }
}, { timestamps: true })
module.exports = mongoose.model("Cash_Register_Status", cashRegisterStatusSchema)