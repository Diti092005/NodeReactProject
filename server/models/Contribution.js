const mongoose = require("mongoose")
const User = require("../models/User")
const contributionSchema = new mongoose.Schema({
    donor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    date: {
        type: Date,
        required: true
    },
    sumContribution: {
        type: Number,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model("Contribution", contributionSchema)