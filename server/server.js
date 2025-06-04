require("dotenv").config()
const express = require("express")
const cors = require("cors")
const cron = require('node-cron');
const mongoose = require("mongoose")
const fs = require('fs');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

const corsOptions = require("./config/corsOptions");
const User = require('./models/User');
const { sendBirthdayEmails } = require("./controllers/sendEmailOnBirthdayToDonors");
const happenOnceAMonth = require("./controllers/happenOnceAMonth")
const connectDB = require("./config/dbConn")

connectDB()

// const { addMonthlyScholarshipDetails } = require("./controllers/monthlyScholarshipDetailsController")
// const { addStudentScholarshipOnceAMonth } = require("./controllers/studentScholarshipController")

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
//app.use("/api/hapenOnceAMonth",require("./routers/hapenOnceAMonthRoutes"))
app.use("/api/user", require("./routers/userRoutes"))

app.use('/uploads', express.static('uploads'));

app.get("/", (req, res) => {
    res.send("This is the home page")
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const scheduleMonthlyTask = async () => {
    const now = new Date();
    const currentDate = now.getDate();
    if (currentDate === 1) {
        await happenOnceAMonth.addMonthlyContributionsToCRS();
        await happenOnceAMonth.addStudentScholarshipOnceAMonthAndUpdateCRS();
    }
};

app.delete('/api/user/delete-image', async (req, res) => {
    const { url, _id } = req.body;
    if (!url) return res.status(400).json({ error: 'No URL provided' });
    if (!_id) return res.status(400).json({ error: 'No User ID provided' });
    const filename = path.basename(url);

    await User.findByIdAndUpdate(_id, { image: null });

    const otherUsersCount = await User.countDocuments({ image: url });

    if (otherUsersCount === 0) {
        const filePath = path.join(__dirname, 'uploads', filename);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Delete image error:', err);
                return res.json({ success: true, message: 'Image reference removed, file not found' });
            }
            res.json({ success: true, message: 'Image reference removed and file deleted' });
        });
    } else {
        res.json({ success: true, message: 'Image reference removed, file kept (in use by others)' });
    }
});

app.post('/api/user/upload-image', upload.array("image", 10), async (req, res) => {
    if (!req.files) return res.status(400).json({ error: 'No file uploaded' });

    let files = [];

    for (const file of req.files) {
        // חשב hash של התוכן
        const fileBuffer = fs.readFileSync(file.path);
        const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
        const ext = path.extname(file.originalname);
        const newFilename = `${hash}${ext}`;
        const newPath = path.join('uploads', newFilename);

        if (!fs.existsSync(newPath)) {
            // אם לא קיים – העתק את הקובץ
            fs.renameSync(file.path, newPath);
        } else {
            // אם קיים – מחק את הקובץ הזמני
            fs.unlinkSync(file.path);
        }

        files.push({
            url: `http://localhost:1111/uploads/${newFilename}`,
        });
    }

    res.json(files);
});

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