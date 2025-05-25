const { default: mongoose } = require("mongoose")
const CashRegisterStatus = require("../models/Cash_Register_Status")

const getAllCashRegisterStatus = async (req, res) => {//vvvvvvvvvvvvvvvvvv
    const cashregistersatuses = await CashRegisterStatus.find().lean()
    if (!cashregistersatuses?.length) {
        return res.json([])
    }
    res.json(cashregistersatuses)
}
const getCashRegisterStatusById = async (req, res) => {//vvvvvvvvvvvv
    const { id } = req.params
    const cashregistersatuses = await CashRegisterStatus.find().lean()
    if (!cashregistersatuses?.length)
        return res.status(404).send("No cashregistersatuses exists")
    if (!id)
        return res.status(400).send("Id is required")
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).send("Not valid id")
    const cashregistersatus = await CashRegisterStatus.findById(id).lean()
    if (!cashregistersatus)
        return res.status(400).send("This cashregistersatus isn't exists")
    res.json(cashregistersatus)
}

const addCashRegisterStatus = async (req, res) => {//vvvvvvvvvvvvvvvvvvvvv
    const { action, sumPerAction, date } = req.body
    if (!action || !sumPerAction || !date)
        return res.status(400).send("All fields are required!!")
    if (action !== 'Income' && action !== 'Expense')
        return res.status(400).send("action must be Income or Expense!!")
    const cashregistersatuses = await CashRegisterStatus.find().lean()
    if (!cashregistersatuses?.length) {
        let sum = 0;
        if (action === "Income")
            sum = Number(sumPerAction)
        else
            sum = - Number(sumPerAction)
        const cashregistersatus = await CashRegisterStatus.create({ currentSum: sum, sumPerAction, action, date })
        res.json(cashregistersatus)
    }
    else {
        let sum = cashregistersatuses[cashregistersatuses.length - 1].currentSum
        if (action === "Income")
            sum += Number(sumPerAction)

        else
            sum -= Number(sumPerAction)
        const cashregistersatus = await CashRegisterStatus.create({ currentSum: sum, sumPerAction, action, date })
        res.json(cashregistersatus)
    }
}
const updateCashRegisterStatus = async (req, res) => {//vvvvvvvvvvvvvvv
    const { currentSum, sumPerAction, action, _id, date } = req.body
    const newDate = new Date(date)
    if (newDate.getMonth() === new Date().getMonth()) {
        if (!_id)
            return res.status(400).send("Id is required")
        if (!mongoose.Types.ObjectId.isValid(_id))
            return res.status(400).send("Not valid id")
        const cashregistersatuses = await CashRegisterStatus.find().lean()
        if (!cashregistersatuses?.length)
            return res.status(404).send("No cashregistersatuses exists")
        const cashregistersatus = await CashRegisterStatus.findById(_id).exec()
        if (!cashregistersatus)
            return res.status(400).send("cashregistersatus is not exists")
        if (currentSum)
            cashregistersatus.currentSum = currentSum
        if (sumPerAction)
            cashregistersatus.sumPerAction = sumPerAction
        if (action)
            cashregistersatus.action = action
        if (date)
            cashregistersatus.date = newDate
        const upcashregistersatus = await cashregistersatus.save()
        return res.json(upcashregistersatus)
    }
    return res.status(400).send("Can't update from last monthes")
}

const deleteCashRegisterStatusById = async (req, res) => {//vvvvvvvvvvvv
    const { id } = req.params
    if (!id)
        return res.status(400).send("Id is required")
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).send("Not valid id")
    const cashregistersatuses = await CashRegisterStatus.find().lean()
    if (!cashregistersatuses?.length)
        return res.status(404).send("No cashregistersatuses exists")
    const cashregistersatus = await CashRegisterStatus.findById(id).exec()
    if (!cashregistersatus)
        return res.status(400).send("cashregistersatus is not exists")
    if (cashregistersatus.date.getMonth() === new Date().getMonth()) {
        const result = await cashregistersatus.deleteOne()
        return res.send(result)
    }
    return res.status(400).send("You can't delete from previous month")
}
module.exports = { getAllCashRegisterStatus, getCashRegisterStatusById, addCashRegisterStatus, updateCashRegisterStatus, deleteCashRegisterStatusById }