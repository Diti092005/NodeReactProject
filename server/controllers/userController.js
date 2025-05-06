const User = require("../models/User")

const getAllUsers = async (req, res) => {
    const users = await User.find().lean()
    res.json(users)
}

const getUserById = async (req, res) => {
    const { id } = req.params
    const users = await User.find().lean()
    if (!users)
        return res.status(400).send("No users exists")
    if (!id)
        return res.status(400).send("Id is required")
    const user = await User.findById(id).lean()
    if (!user)
        return res.status(400).send("This user isn't exists")
    res.json(user)
}

// const addUser=async (req,res)=>{//auto!!!!
//     const user={}
// }

const updateUser = async (req, res) => {
    const { userId, password, fullname, email, phone, street, numOfBulding, city, dateOfBirth, roles, id } = req.body
    if (!id)
        return res.status(400).send("Id is required")
    const users = await User.find().lean()
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }
    const user = await User.findById(id).exec()
    if (!user)
        return res.status(400).send("user is not exists")
    if (userId)
        user.userId = userId
    if (password)
        user.password = password
    if (fullname)
        user.fullname = fullname
    if (email)
        user.email = email
    if (phone)
        user.phone = phone
    if (street)
        user.street = street
    if (city)
        user.city = city
    if (numOfBulding)
        user.numOfBulding = numOfBulding
    if (dateOfBirth)
        user.dateOfBirth = dateOfBirth
    if (roles) {
        if (roles !== 'Donor' && roles !== 'Admin' && roles !== 'Student')//=====================================
            return res.status(400).send("roles must be User or Donor or Admin!!")
        user.roles = roles
    }
    const upuser = await user.save()
    res.json(upuser)
}

const deleteUserById = async (req, res) => {
    const { id } = req.params
    if (!id)
        return res.status(400).send("Id is required")
    const users = await User.find().lean()
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }
    const user = await User.findById(id).exec()
    if (!user)
        return res.status(400).send("user is not exists")
    const result = await user.deleteOne()
    res.send(result)
}

module.exports = { getAllUsers, getUserById, updateUser, deleteUserById }