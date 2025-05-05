require("dotenv").config()
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

const connectDB = require("./config/dbConn")
connectDB()
const corsOptions = require("./config/corsOptions")

const PORT = process.env.PORT || 99999
const app = express()

app.use(cors(corsOptions))
app.use(express.json())

//routers
//app.use("/api/auth", require("./routers/authRoutes"))

app.get("/", (req, res) => {
    res.send("This is the home page")
})
mongoose.connection.once('open', () => {
    console.log("connectDB");
    app.listen(PORT, () => {
        console.log(`Project is running in port : ${PORT}`);
    })
})

mongoose.connection.on('error', (err) => {
    console.log(err);
})