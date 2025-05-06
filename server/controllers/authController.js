const User = require("../models/User")
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const login = async (req, res) => {
    const { userId, password } = req.body
    if (!userId || !password)
        return res.status(400).json({ message: "password and userid are required!!" })
    const users = await User.find().lean()
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' })
    }
    const foundUser = await User.findOne({ userId }).lean()
    if (!foundUser || !foundUser.active)
        return res.status(401).json({ message: 'Unauthorized' })
    const match = await bcrypt.compare(password, foundUser.password)
    if (!match)
        return res.status(401).json({ message: "Unauthorized" })
    const userInfo = {
        _id: foundUser._id,
        fullname: foundUser.fullname,
        roles: foundUser.roles,
        userid: foundUser.userid,
        email: foundUser.email,
        phone: foundUser.phone,
        dateOfBirth: foundUser.dateOfBirth,
        address: { street: foundUser.address.street, numOfBulding: foundUser.address.numOfBulding, city: foundUser.address.city }
    }
    const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET)
    res.status(200).json({ accesstoken: accessToken })//==================
}
const register = async (req, res) => {
    const { userId, password, fullname, email, phone, street, numOfBulding, city, dateOfBirth, roles } = req.body
    if (!fullname || !userId || !password || !roles) {// Confirm data
        return res.status(400).json({ message: 'All fields are required' })
    }
    const users = await User.find().lean()
    if (users?.length) {
        const duplicate = await User.findOne({ userId }).lean()
        if (duplicate) {
            return res.status(409).json({ message: "Duplicate userid" })
        }
    }
    if (roles !== 'Donor' && roles !== 'Admin' && roles !== 'Student')
        return res.status(400).send("roles must be User or Donor or Admin!!")
    const hashedPwd = await bcrypt.hash(password, 10)
    const userObject = { fullname, email, userId, phone, email, address: { city, street, numOfBulding }, dateOfBirth, roles, password: hashedPwd }
    const user = await User.create(userObject)
    if (user) { // Created
        return res.status(201).json({
            message: `New user ${user.userid} created`
        })
    } else {
        return res.status(400).json({ message: 'Invalid user received' })
    }
}
module.exports = { login, register }