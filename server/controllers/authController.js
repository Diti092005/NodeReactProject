const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
//const { JsonWebTokenError } = require("jsonwebtoken")
const login = async (req, res) => {
    const { password, userId } = req.body
    // console.log(userId);//to change/////////////////////////////////////////////////////////////////////
    // if (!userId || !password) {
    //     return res.status(400).json({ message: 'userId and password are required' })
    // }
    // const users = await User.find().lean()
    // if (!users?.length) {
    //     return res.status(404).json({ message: 'No users found' })
    // }
    const foundUser = await User.findOne({ userId }).lean()

    if (!foundUser || !foundUser.active) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
     const match = await bcrypt.compare(password, foundUser.password)///////////vvvvvvvvvvv

    if (!match)
        return res.status(401).json({ message: 'Unauthorized' })
    const userInfo = {
        _id: foundUser._id, fullname: foundUser.fullname,
        role:foundUser.role,
        phone: foundUser.phone, address: foundUser.address,
        email: foundUser.email, birthDate: foundUser.birthDate, active: foundUser.active, userId: foundUser.userId
    }
    const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET)
    res.json({ accessToken: accessToken ,user:userInfo,role:foundUser.role})
}

const register = async (req, res) => {////vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    console.log("hdiohf;sh");
    const { userId, password, fullname, email, phone, address, birthDate, active, role } = req.body
    if (!userId || !password || !fullname || !role) {
        return res.status(400).json({ message: 'userId, roles, password and fullname are required' })
    }
    const duplicate = await User.findOne({ userId }).lean()
    if (duplicate) {
        return res.status(409).json({ message: "Duplicate user id" })
    }
    if (role !== 'Donor' && role !== 'Admin' && role !== 'Student')
        return res.status(400).send("roles must be User or Donor or Admin!!")
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log(hashedPassword);

    const userObject = { userId, password: hashedPassword, fullname, email, phone, address, birthDate, active, role }
    const user = await User.create(userObject)
    if (user) { // Created
        return res.status(201).json({
            message: `New user ${user.fullname} created`,
            user
        })
    } else {
        return res.status(400).json({ message: 'Invalid user received' })
    }
}
module.exports = { login, register }
