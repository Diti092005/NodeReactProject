require("dotenv").config()
const express = require("express")
const cors = require("cors")
const cron = require('node-cron');
const mongoose = require("mongoose")

const corsOptions = require("./config/corsOptions");
const { sendBirthdayEmails } = require("./controllers/sendEmailOnBirthdayToDonors");
const happenOnceAMonth = require("./controllers/happenOnceAMonth")
const connectDB = require("./config/dbConn")

connectDB()

const PORT = process.env.PORT || 1234
const app = express()

app.use(cors(corsOptions))
app.use(express.json())

//routres
app.use("/api/auth", require("./routers/authRoutes"))
app.use("/api/bankDetails", require("./routers/bank_details_routes"))
app.use("/api/contribution", require("./routers/contribution_routes"))
app.use("/api/cashRegisterStatus", require("./routers/cashRegisterStatusRoutes"))
app.use("/api/monthlyScholarshipDetails", require("./routers/monthlyScholarshipDetailsRoutes"))
app.use("/api/studentScholarship", require("./routers/studentScholarshipRoutes"))
app.use("/api/user", require("./routers/userRoutes"))

app.use('/uploads', express.static('uploads'));

app.get("/", (req, res) => {
    res.send("This is the home page")
})

const scheduleMonthlyTask = async () => {
    const now = new Date();
    const currentDate = now.getDate();
    if (currentDate === 1) {
        await happenOnceAMonth.addMonthlyContributionsToCRS();
        await happenOnceAMonth.addStudentScholarshipOnceAMonthAndUpdateCRS();
    }
};

// app.delete('/api/user/delete-image', async (req, res) => {
//     const { url, _id } = req.body;
//     if (!url) return res.status(400).json({ error: 'No URL provided' });
//     if (!_id) return res.status(400).json({ error: 'No User ID provided' });
//     const filename = path.basename(url);

//     await User.findByIdAndUpdate(_id, { image: null });

//     const otherUsersCount = await User.countDocuments({ image: url });

//     if (otherUsersCount === 0) {
//         const filePath = path.join(__dirname, 'uploads', filename);
//         fs.unlink(filePath, (err) => {
//             if (err) {
//                 console.error('Delete image error:', err);
//                 return res.json({ success: true, message: 'Image reference removed, file not found' });
//             }
//             res.json({ success: true, message: 'Image reference removed and file deleted' });
//         });
//     } else {
//         res.json({ success: true, message: 'Image reference removed, file kept (in use by others)' });
//     }
// });


cron.schedule('0 9 * * *', scheduleMonthlyTask);

cron.schedule('0 9 * * *', sendBirthdayEmails);

mongoose.connection.once('open', () => {
    console.log("connectDB");
    app.listen(PORT, () => {
        console.log(`Project is running in port : ${PORT}`);
    })
})

mongoose.connection.on('error', (err) => {
    console.log(err);
})