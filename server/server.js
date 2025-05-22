require("dotenv").config()
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

const connectDB = require("./config/dbConn")
connectDB()
const corsOptions = require("./config/corsOptions")
// const { addMonthlyScholarshipDetails } = require("./controllers/monthlyScholarshipDetailsController")
// const { addStudentScholarshipOnceAMonth } = require("./controllers/studentScholarshipController")

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
app.use("/api/hapenOnceAMonth",require("./routers/hapenOnceAMonthRoutes"))
app.use("/api/user",require("./routers/userRoutes"))

app.get("/", (req, res) => {
    res.send("This is the home page")
})
// const scheduleMonthlyTask = async () => {
//     const now = new Date();
//     const currentDate = now.getDate();
//     if (currentDate === 1) {
//         await addStudentScholarshipOnceAMonth();
//     }
// };

// // This function will run every 24 hours (86400000 milliseconds)
// setInterval(scheduleMonthlyTask, 86400000);

mongoose.connection.once('open', () => {
    console.log("connectDB");
    app.listen(PORT, () => {
        console.log(`Project is running in port : ${PORT}`);
    })
})

mongoose.connection.on('error', (err) => {
    console.log(err);
})