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

//routres
app.use("/api/auth",require("./routers/authRoutes"))
app.use("/api/bankDetails",require("./routers/bank_details_routes"))
app.use("/api/contribution",require("./routers/contribution_routes"))
app.use("/api/cashRegisterStatus", require("./routers/cashRegisterStatusRoutes"))
app.use("/api/monthlyScholarshipDetails",require("./routers/monthlyScholarshipDetailsRoutes"))
app.use("/api/studentScholarship",require("./routers/studentScholarshipRoutes"))
app.use("/api/user",require("./routers/userRoutes"))

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