const { default: mongoose } = require("mongoose")
const StudentScholarship = require("../models/Student_Scholarship")
const User = require("../models/User")
const getAllStudentScholarships = async (req, res) => {//vvvvvvvvvvvv
    const studentScholarships = await StudentScholarship.find().populate("student", { fullname: 1, _id: 1 }).lean();
    if (!studentScholarships?.length) {
        return res.json([])
    }
    res.json(studentScholarships)
}

const getStudentScholarshipById = async (req, res) => {
    const { id } = req.params;
    if (!id)
        return res.status(400).send("Id is required");
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).send("Not valid id");
    const studentScholarship = await StudentScholarship.findById(id)
        .populate("student", { fullname: 1, _id: 1 })
        .lean();
    if (!studentScholarship)
        return res.status(404).send("This studentScholarship doesn't exist");
    res.json(studentScholarship);
};

const addStudentScholarship = async (req, res) => {//vvvvvvvvvvvvvv
    const { sumMoney, numHours, date, student } = req.body
    if (!sumMoney || !numHours || !date || !student)
        return res.status(400).send("All fields are required!!")
    const studentScholarship = await StudentScholarship.create({ sumMoney, numHours, date, student })
    res.json(studentScholarship)
}


const updateStudentScholarship = async (req, res) => {//vvvvvvvvvvvvvvvv
    const { sumMoney, numHours, date, student, id } = req.body
    if (!id)
        return res.status(400).send("Id is required")
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).send("Not valid id")
    const allStudentScholarship = await StudentScholarship.find()
    if (!allStudentScholarship)
        return res.status(404).send(" There is no studentScholarships !!")
    const studentScholarship = await StudentScholarship.findById(id).exec()
    if (!studentScholarship)
        return res.status(400).send("studentScholarship is not exist!!")
    if (sumMoney)
        studentScholarship.sumMoney = sumMoney
    if (numHours)
        studentScholarship.numHours = numHours
    if (date)
        studentScholarship.date = date
    if (student) {
        const users = await User.find().lean()
        if (!users?.length) {
            return res.status(404).json({ message: 'No users found' })
        }
        const user = await User.findById(id).exec()
        if (!user)
            return res.status(400).send("user is not exists")
        studentScholarship.student = student
    }
    const updatedStudentScholarship = await studentScholarship.save()
    res.json(updatedStudentScholarship)
}
const deleteStudentScholarship = async (req, res) => {
    const { id } = req.params
    if (!id)
        return res.status(400).send("Id is required")
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).send("Not valid id")
    const studentScholarship = await StudentScholarship.findById(id).exec()
    if (!studentScholarship)
        return res.status(400).send("studentScholarship is not exists")
    const result = await studentScholarship.deleteOne()
    res.send(result)
}
const getCurrentScholarships = async (req, res) => {
    try {
        const { date } = req.params; // studentId מגיע מה-URL
        // חישוב תחילת וסוף החודש הנוכחי
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        // חיפוש המילגה של הסטודנט בחודש הנוכחי
        const scholarship = await StudentScholarship.findOne({
            date: date,
            date: { $gte: startOfMonth, $lte: endOfMonth }
        });

        if (!scholarship) {
            return res.status(200).json("");
        }

        res.json(scholarship);
    } catch (err) {
        res.status(500).json({ message: "שגיאה בשרת", error: err.message });
    }
};
module.exports = { addStudentScholarship, getAllStudentScholarships, getStudentScholarshipById, getCurrentScholarships,updateStudentScholarship, deleteStudentScholarship }
