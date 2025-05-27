const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const validator = require('validator');

function isValidIsraeliID(id) {
    id = String(id).trim();
    if (id.length < 5 || id.length > 9 || !/^\d+$/.test(id)) return false;
    id = id.padStart(9, '0');
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        let num = Number(id[i]) * ((i % 2) + 1);
        if (num > 9) num -= 9;
        sum += num;
    }
    return sum % 10 === 0;
}//
function isValidPhone(phone) {
    return validator.isMobilePhone(phone, 'he-IL');
}//

function isValidEmail(email) {
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email);
}//
//const { JsonWebTokenError } = require("jsonwebtoken")
const login = async (req, res) => {
    const { password, userId } = req.body
    if (!userId || !password) {
        return res.status(400).json({ message: 'userId and password are required' })
    }
    const foundUser = await User.findOne({ userId }).lean()
    if (!foundUser)
        return res.status(401).json({ message: 'Unauthorized' })

    // if (!foundUser || !foundUser.active) {///active????????????????
    //     return res.status(401).json({ message: 'Unauthorized' })
    // }
    const match = await bcrypt.compare(password, foundUser.password)///////////vvvvvvvvvvv

    if (!match)
        return res.status(401).json({ message: 'Unauthorized' })

    const userInfo = {
        _id: foundUser._id, fullname: foundUser.fullname,
        role: foundUser.role,
        phone: foundUser.phone, address: foundUser.address,
        email: foundUser.email, birthDate: foundUser.birthDate, active: foundUser.active, userId: foundUser.userId
    }
    const accessToken = jwt.sign(userInfo, process.env.ACCESS_TOKEN_SECRET)
    res.json({ accessToken: accessToken, user: userInfo, role: foundUser.role })
}

const register = async (req, res) => {////vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    const { userId, password, fullname, email, phone, address, birthDate, active, role } = req.body
    if (!userId || !password || !fullname || !role) {
        return res.status(400).json({ message: 'userId, roles, password and fullname are required' })
    }
    if (!isValidIsraeliID(userId)) {
        return res.status(400).json({ message: 'Invalid Israeli ID number.' });
    }
    const duplicate = await User.findOne({ userId }).lean()
    if (duplicate && duplicate.active) {
        return res.status(409).json({ message: "Duplicate user id" })
    }
    if (role !== 'Donor' && role !== 'Admin' && role !== 'Student')
        return res.status(400).send("roles must be User or Donor or Admin!!")
    const hashedPassword = await bcrypt.hash(password, 10)
    if (phone && isValidPhone(phone) === false)//
        return res.status(400).send("Invalid phone")//
    if (email) {//
        if (isValidEmail(email) === false)//
            return res.status(400).json({ message: 'Invalid email' });//
    }//
    if (address&&address.numOfBuilding&&isNaN(Number(address.numOfBuilding))) {
        return res.status(400).json({ message: 'Building number must be a number.' });
    }//
    if (birthDate) {
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        if (age < 18) {
            return res.status(400).json({ message: 'You must be at least 18 years old.' });
        }
    }//
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
