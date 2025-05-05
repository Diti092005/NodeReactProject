const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB)
    }
    catch (err) {
        console.log("error connecting to DataBase!!!");
    }
}

module.exports = connectDB