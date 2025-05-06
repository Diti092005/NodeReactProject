const MonthlyScholarshipDetails = require("../models/MonthlyScholarshipDetails")

const getAllMonthlyScholarshipDetails = async (req, res) => {//vvvvvvvvvvvvv
    const allMonthlyScholarshipDetails = await MonthlyScholarshipDetails.find().lean()
    res.json(allMonthlyScholarshipDetails)
}

const getMonthlyScholarshipDetailsById = async (req, res) => {//vvvvvvvvvvvvvvv
    const { id } = req.params
    if (!id)
        return res.status(400).send("Id is required")
    const allMonthlyScholarshipDetails = await MonthlyScholarshipDetails.find().lean()
    if (!allMonthlyScholarshipDetails?.length)
        return res.status(400).send("No monthlyScholarshipDetails exists")
    const monthlyScholarshipDetails = await MonthlyScholarshipDetails.findById(id).lean()
    if (!monthlyScholarshipDetails)
        return res.status(400).send("monthlyScholarshipDetails is not exists")
    res.json(monthlyScholarshipDetails)
}

const addMonthlyScholarshipDetails = async (req, res) => {//vvvvvvvvvv
    const { sumPerHour, MaximumNumberOfHours, date } = req.body
    if (!date || !sumPerHour || !MaximumNumberOfHours)
        return res.status(400).send("All fields are required")
    const monthlyScholarshipDetails = await MonthlyScholarshipDetails.create({ sumPerHour, MaximumNumberOfHours, date })
    res.json(monthlyScholarshipDetails)
}

const updateMonthlyScholarshipDetails = async (req, res) => {//vvvvvvvvvvvvvvvvv
    const { id, sumPerHour, MaximumNumberOfHours, date } = req.body
    if (!id)
        return res.status(400).send("Id is required")
    const monthlyScholarshipDetails = await MonthlyScholarshipDetails.findById(id).exec()
    if (!monthlyScholarshipDetails)
        return res.status(400).send("monthlyScholarshipDetails is not exists")
    if (sumPerHour)
        monthlyScholarshipDetails.sumPerHour = sumPerHour
    if (MaximumNumberOfHours)
        monthlyScholarshipDetails.MaximumNumberOfHours = MaximumNumberOfHours
    if (date)
        monthlyScholarshipDetails.date = date
    const updatedmonthlyScholarshipDetails = await monthlyScholarshipDetails.save()
    res.json(updatedmonthlyScholarshipDetails)
}
const deleteMonthlyScholarshipDetails = async (req, res) => {//vvvvvvvvvv
    const { id } = req.params
    if (!id)
        return res.status(400).send("Id is required")
    const msd = await MonthlyScholarshipDetails.findById(id).exec()
    if (!msd)
        return res.status(400).send("MonthlyScholarshipDetails is not exists")
    const result = await msd.deleteOne()
    res.send(result)
}

module.exports = { addMonthlyScholarshipDetails, getMonthlyScholarshipDetailsById, getAllMonthlyScholarshipDetails, updateMonthlyScholarshipDetails, deleteMonthlyScholarshipDetails }