const CashRegisterStatus = require("../models/Cash_Register_Status")

const getAllCashRegisterStatus = async (req, res) => {//vvvvvvvvvvvvvvvvvv
    const cashregistersatuses = await CashRegisterStatus.find().lean()
    if (!cashregistersatuses?.length) {
        res.json([])    }
    res.json(cashregistersatuses)
}
const getCashRegisterStatusById = async (req, res) => {//vvvvvvvvvvvv
    const { id } = req.params
    const cashregistersatuses = await CashRegisterStatus.find().lean()
    if (!cashregistersatuses?.length)
        return res.status(404).send("No cashregistersatuses exists")
    if (!id)
        return res.status(400).send("Id is required")
    const cashregistersatus = await CashRegisterStatus.findById(id).lean()
    if (!cashregistersatus)
        return res.status(400).send("This cashregistersatus isn't exists")
    res.json(cashregistersatus)
}

const addCashRegisterStatus = async (req, res) => {//vvvvvvvvvvvvvvvvvvvvv
    const { action, sumPerAction ,currentSum,date} = req.body
    if (!action||!sumPerAction||!currentSum||!date)//currentSum האם נכון לדרוש שליחה של
        return res.status(400).send("All fields are required!!")
     if(action!=='Income'&&action!=='Expense')
        return res.status(400).send("action must be Income or Expense!!")


    const cashregistersatus = await CashRegisterStatus.create({ currentSum, sumPerAction, action,date })
    res.json(cashregistersatus)
}
const updateCashRegisterStatus = async (req, res) => {//vvvvvvvvvvvvvvv
    const { currentSum, sumPerAction, action, id,date } = req.body
    if (!id)
        return res.status(400).send("Id is required")
    const cashregistersatuses = await CashRegisterStatus.find().lean()
    if (!cashregistersatuses?.length)
        return res.status(404).send("No cashregistersatuses exists")
    const cashregistersatus = await CashRegisterStatus.findById(id).exec()
    if (!cashregistersatus)
        return res.status(400).send("cashregistersatus is not exists")
    if (currentSum)
        cashregistersatus.currentSum = currentSum
    if (sumPerAction)
        cashregistersatus.sumPerAction = sumPerAction
    if (action)
        cashregistersatus.action = action
    if (date)
        cashregistersatus.date = date
    const upcashregistersatus = await cashregistersatus.save()
    res.json(upcashregistersatus)
}

const deleteCashRegisterStatusById = async (req, res) => {//vvvvvvvvvvvv
    const { id } = req.params
    if (!id)
        return res.status(400).send("Id is required")
    const cashregistersatuses = await CashRegisterStatus.find().lean()
    if (!cashregistersatuses?.length)
        return res.status(404).send("No cashregistersatuses exists")
    const cashregistersatus = await CashRegisterStatus.findById(id).exec()
    if (!cashregistersatus)
        return res.status(400).send("cashregistersatus is not exists")
    const result = await cashregistersatus.deleteOne()
    res.send(result)
}
module.exports = { getAllCashRegisterStatus, getCashRegisterStatusById, addCashRegisterStatus, updateCashRegisterStatus, deleteCashRegisterStatusById }