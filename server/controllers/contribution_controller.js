//vvvvvvvvvvvvv
const { default: mongoose } = require("mongoose");
const Contribution = require("../models/Contribution")
const User = require("../models/User")
const addContrbution = async (req, res) => {///////////vvvvvvvvv
    const { donor, date, sumContribution } = req.body
    if (!donor || !date || !sumContribution)
        return res.status(400).send("All fields are required ")
    const existDonor = await User.findOne({ _id: donor }).lean()
    if (!existDonor)
        return res.status(400).send("Donor is not exist")
    if (sumContribution <= 0)
        return res.status(400).send("Invalid sumContribution")
    const newDate = new Date(date)
    if (newDate.getMonth() !== new Date().getMonth() || newDate.getFullYear() !== new Date().getFullYear())
        return res.status(400).send("Invalid date")
    const contribution = await Contribution.create({ donor, date, sumContribution })
    res.json(contribution)
}
const addContrbutionByDonorId = async (req, res) => {///////////vvvvvvvvv
    const { donor, date, sumContribution } = req.body
    if (!donor || !date || !sumContribution)
        return res.status(400).send("All fields are required ")
    const existDonor = await User.findOne({ _id: donor }).lean()
    if (!existDonor)
        return res.status(400).send("Donor is not exist")
    if (sumContribution <= 0)
        return res.status(400).send("Invalid sumContribution")
    const newDate = new Date(date)
    if (newDate.getMonth() !== new Date().getMonth() || newDate.getFullYear() !== new Date().getFullYear())
        return res.status(400).send("Invalid date")
    const contribution = await Contribution.create({ donor, date, sumContribution })
    res.json(contribution)
}
const getAllContrbutions = async (req, res) => {//vvvvvvvvvv
    const allContrbutions = await Contribution.find().populate("donor", { fullname: 1, _id: 1 }).lean()
    if (!allContrbutions?.length)
        return res.json([])
    res.json(allContrbutions)
}

const getContrbutionById = async (req, res) => {//vvvvvvvvv
    const { id } = req.params
    if (!id)
        return res.status(400).send("Id is required")
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).send("Not valid id")
    const contribution = await Contribution.findById(id).populate("donor", { fullname: 1, _id: 1 }).lean()
    if (!contribution)
        return res.status(400).send("contribution is not exists")
    res.json(contribution)
}
const getContrbutionByDonorId = async (req, res) => {//vvvvvvvvv
    const { id } = req.params
    console.log(id);
    if (!id)
        return res.status(400).send("Id is required")
    // if (!mongoose.Types.ObjectId.isValid(id))
    //     return res.status(400).send("Not valid id")
    const contribution = await Contribution.find({ donor: id }).populate("donor", { fullname: 1, _id: 1 }).lean()
    if (!contribution)
        return res.status(400).send("contribution is not exists")
    res.json(contribution)
}
const updateContributionByDonorId = async (req, res) => {
    const { id, donor, date, sumContribution } = req.body
    if (!id)
        return res.status(400).send("Id is required")
    const contribution = await Contribution.findOne({ _id: id, donor: donor }).exec()
    if (!contribution)
        return res.status(400).send("contribution is not exists")
    const newDate = new Date(date)
    if (newDate.getMonth() === new Date().getMonth() && newDate.getFullYear() === new Date().getFullYear()) {
        contribution.date = date
        if (sumContribution > 0)
            contribution.sumContribution = sumContribution
    }
    const updatedContribution = await contribution.save()
    res.json(updatedContribution)
}
const updateContribution = async (req, res) => {/////////vvvvvvvvvvvvvvv
    const { id, donor, date, sumContribution } = req.body
    const newDate = new Date(date)
    if (newDate.getMonth() === new Date().getMonth() && newDate.getFullYear() === new Date().getFullYear()) {
        if (!id)
            return res.status(400).send("Id is required")
        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).send("Not valid id")
        const contribution = await Contribution.findById(id).exec()
        if (!contribution)
            return res.status(400).send("contribution is not exists")
        if (donor) {
            const existDonor = await User.findOne({ _id: donor }).lean()
            if (existDonor)
                contribution.donor=donor
        }
        contribution.date = date
        if (sumContribution > 0)
            contribution.sumContribution = sumContribution
        const updatedContribution = await contribution.save()
        return res.json(updatedContribution)
    }
    return res.status(400).send("Can't update from last monthes")
}
const deleteContribution = async (req, res) => {//vvvvvvvvvvvvvvvvvvvv
    const { id } = req.params
    if (!id)
        return res.status(400).send("Id is required")
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).send("Not valid id")
    const contribution = await Contribution.findById(id).exec()
    if (!contribution)
        return res.status(400).send("Contribution is not exists")
    if (contribution.date.getMonth() !== new Date().getMonth() || contribution.date.getFullYear() !== new Date().getFullYear())
        return res.status(400).send("You can't delete contribution from previous month")
    const result = await contribution.deleteOne()
    res.send(result)
}
module.exports = { addContrbution, addContrbutionByDonorId, getAllContrbutions, getContrbutionByDonorId, getContrbutionById, updateContribution, updateContributionByDonorId, deleteContribution }