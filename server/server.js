require("dotenv").config()
const express = require("express")
const cors = require("cors")
const cron = require('node-cron');
const mongoose = require("mongoose")
const fs = require('fs');
const happenOnceAMonth = require("./controllers/happenOnceAMonth")
const connectDB = require("./config/dbConn")
connectDB()
const multer = require('multer');
const path = require('path');
const corsOptions = require("./config/corsOptions");
const { sendBirthdayEmails } = require("./controllers/sendEmailOnBirthdayToDonors");
const { log } = require("console");
// const { addMonthlyScholarshipDetails } = require("./controllers/monthlyScholarshipDetailsController")
// const { addStudentScholarshipOnceAMonth } = require("./controllers/studentScholarshipController")

const PORT = process.env.PORT || 99999
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
//app.use("/api/hapenOnceAMonth",require("./routers/hapenOnceAMonthRoutes"))
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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
app.delete('/api/user/delete-image', (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'No URL provided' });
    const filename = path.basename(url);
    const filePath = path.join(__dirname, 'uploads', filename);
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Delete image error:', err);
            return res.status(404).json({ error: 'File not found or could not be deleted' });
        }
        res.json({ success: true, message: 'File deleted' });
    });
});

app.post('/api/user/upload-image', upload.array("image", 10), (req, res) => {
    if (!req.files) return res.status(400).json({ error: 'No file uploaded' });
    const files = req.files.map((file) => ({
        url: `http://localhost:1111/uploads/${file.filename}`, // Construct file URL
    }));
    res.json(files);
});

cron.schedule('0 0 * * *', scheduleMonthlyTask);

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