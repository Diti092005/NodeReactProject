const Monthly_scholarship_details = require("../models/Monthly_scholarship_details")
const StudentScholarship = require("../models/Student_Scholarship")
const User = require("../models/User")
const mongoose = require("mongoose")
const { getMonthlyScholarshipDetailsDate } = require("../controllers/monthlyScholarshipDetailsController")

const getAllStudentScholarships = async (req, res) => {//vvvvvvvvvvvv
    const studentScholarships = await StudentScholarship.find().populate("student", { fullname: 1,userId:1, _id: 1 }).lean()
    if (!studentScholarships?.length) {
        res.json([])
    }
    res.json(studentScholarships)
}

const getStudentScholarshipById = async (req, res) => {//vvvvvvvvvvv
    const { id } = req.params
    if (!id)
        return res.status(400).send("Id is required")
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).send("Not valid id")
    const studentScholarship = await StudentScholarship.findById(id).lean()
    if (!studentScholarship)
        return res.status(400).send("This studentScholarship isn't exists")
    res.json(studentScholarship)
}

const getStudentScholarshipByStudent = async (req, res) => {
    const { student } = req.params;
    if (!student)
        return res.status(400).send("Student is required");
    if (!mongoose.Types.ObjectId.isValid(student))
        return res.status(400).send("Not valid student")
    const existStudent = await User.findOne({ _id: student, role: "Student" }).lean()
    if (!existStudent)
        return res.status(400).send("Student is not exist")
    const scholarships = await StudentScholarship.find({ student }).populate("student", { fullname: 1, _id: 1 }).lean();
    if (!scholarships.length) {
        return res.json([])
    }
    res.json(scholarships);
};
const getCurrentMonthScholarship = async (req, res) => {
    try {
        const { student } = req.params; // studentId מגיע מה-URL
        if (!student)
            return res.status(400).send("student is required")
        const existStudent = await User.findOne({ _id: student, role: "Student" }).lean()
        if (!existStudent)
            return res.status(400).send("Student is not exist")
        // חישוב תחילת וסוף החודש הנוכחי
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        // חיפוש המילגה של הסטודנט בחודש הנוכחי
        const scholarship = await StudentScholarship.findOne({
            student: student,
            date: { $gte: startOfMonth, $lte: endOfMonth }
        });

        if (!scholarship) {
            return res.status(200).json("");
        }

        return res.json(scholarship);
    } catch (err) {
        return res.status(500).json({ message: "שגיאה בשרת", error: err.message });
    }
}

const addStudentScholarship = async (req, res) => {//vvvvvvvvvvvvvv
    const { sumMoney, numHours, date, student } = req.body
    if ( !date || !student)
        return res.status(400).send("All fields are required!!")
    const msd = getMonthlyScholarshipDetailsDate()
    if (numHours < 0 || numHours > msd.MaximumNumberOfHours)
        return res.status(400).send("Invalid num Hours")
    const newDate = new Date(date)
    if (newDate.getMonth() !== new Date().getMonth() || newDate.getFullYear() !== new Date().getFullYear())
        return res.status(400).send("Invalid date")
    const foundStudent = await User.findOne({ _id: student, role: "Student" })
    if (!foundStudent)
        return res.status(400).send("Not found student")
    const studentScholarship = await StudentScholarship.create({ sumMoney, numHours, date, student })
    res.json(studentScholarship)
}

const updateStudentScholarship = async (req, res) => {//vvvvvvvvvvvvvvvv
    const { sumMoney, numHours, date, student, id } = req.body
    if (!date)
        return res.status(400).send("Date is required")
    const newDate = new Date(date)
    if (newDate.getMonth() === new Date().getMonth() && newDate.getFullYear() === new Date().getFullYear()) {
        if (!id)
            return res.status(400).send("Id is required")
        const allStudentScholarship = await StudentScholarship.find()
        if (!allStudentScholarship)
            return res.status(404).send(" There is no studentScholarships !!")
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).send("Not valid id")
        const studentScholarship = await StudentScholarship.findById(id).exec()
        if (!studentScholarship)
            return res.status(400).send("studentScholarship is not exist!!")
        // if (sumMoney && sumMoney >= 0)/////////////////////////
            studentScholarship.sumMoney = sumMoney
        // if (numHours) {//////////////////////////////////////////
        //     const msd = getMonthlyScholarshipDetailsDate()
        //     if (numHours >= 0 && numHours <= msd.MaximumNumberOfHours)
               studentScholarship.numHours = numHours
        // }
        studentScholarship.date = date
        if (student) {
            if (!mongoose.Types.ObjectId.isValid(student))
                return res.status(400).send("Not valid student")
            const users = await User.find().lean()
            if (!users?.length) {
                return res.status(404).json({ message: 'No users found' })
            }
            const user = await User.findOne({ _id: student, role: "Student" }).exec()
            if (!user)
                return res.status(400).send("user is not exists")
            studentScholarship.student = student
        }
        const updatedStudentScholarship = await studentScholarship.save()
        return res.json(updatedStudentScholarship)
    }
    return res.status(400).send("Can't update from last monthes")
}
const deleteStudentScholarship = async (req, res) => {//vvvvvvvvvvvvvvvvvvvv
    const { id } = req.params
    if (!id)
        return res.status(400).send("Id is required")
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).send("Not valid id")
    const studentScholarship = await StudentScholarship.findById(id).exec()
    if (!studentScholarship)
        return res.status(400).send("studentScholarship is not exists")
    if (studentScholarship.date.getMonth() !== new Date().getMonth() || studentScholarship.date.getFullYear() !== new Date().getFullYear())
        return res.status(400).send("You can't delete from previous month")
    const result = await studentScholarship.deleteOne()
    res.send(result)
}
module.exports = { addStudentScholarship, getAllStudentScholarships, getStudentScholarshipById, updateStudentScholarship, getStudentScholarshipByStudent, deleteStudentScholarship, getCurrentMonthScholarship }
