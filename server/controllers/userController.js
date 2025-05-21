const { default: mongoose } = require("mongoose")
const User = require("../models/User")

const getAllUsers = async (req, res) => {//vvvvvvvvvvv
    const users = await User.find().lean()
    if (!users?.length) {
         res.json([])
        }

    res.json(users)
}
const getAllStudents = async (req, res) => {//vvvvvvvvvvv
    const students = await User.find({role:"Student"}).lean()
    if (!students?.length) {
        res.json([])    }
    res.json(students)
}
const getAllDonors = async (req, res) => {//vvvvvvvvvvvvvvvvvv
    const donors = await User.find({role:"Donor"}).lean()
    
    res.json(donors)
}


const getUserById = async (req, res) => {//vvvvvvvvvvvvvvv
    const { id } = req.params
    const users = await User.find().lean()
    if (!users)
        return res.status(404).send("No users exists")
    if (!id)
        return res.status(400).send("Id is required")
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).send("Not valid id")
    const user = await User.findById(id).lean()
    if (!user)
        return res.status(400).send("This user isn't exists")
    res.json(user)
}

const addUser=async (req,res)=>{
    const { userId, password, fullname, email, phone, city,buildingNumber,street, birthDate, active, role } = req.body
    if (!userId || !password || !fullname || !role) {
        return res.status(400).json({ message: 'userId, role, password and fullname are required' })
    }
    const duplicate = await User.findOne({ userId }).lean()
    if (duplicate) {
        return res.status(409).json({ message: "Duplicate user id" })
    }
    if (role!== 'Donor' && role !== 'Admin' && role !== 'Student')
        return res.status(400).send("role must be User or Donor or Admin!!")
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log(hashedPassword);

    const userObject = { userId, password: hashedPassword, fullname, email, phone, address:{city,street,buildingNumber}, birthDate, active, role }
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

const updateUser = async (req, res) => {////vvvvvvvvvvvvv
    const { userId, password, fullname, email, phone, street, numOfBulding, city, dateOfBirth, role, id } = req.body
    if (!id)
        return res.status(400).send("Id is required")
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).send("Not valid id")
    const users = await User.find().lean()
    if (!users?.length) {
        return res.status(404).json({ message: 'No users found' })
    }
    const user = await User.findById(id).exec()

    if (!user)
        return res.status(400).send("user is not exists")
    if (userId) {
        
        const existingUser = await User.findOne({ userId });
        if (existingUser && user.userId!=userId) {
            return res.status(400).send("User with same userId already exists");
        }
        user.userId = userId
    }
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
    if (role) {
        if (role !== 'Donor' && role !== 'Admin' && role !== 'Student')
            return res.status(400).send("role must be User or Donor or Admin!!")
        user.role = role
    }
    const upuser = await user.save()
    res.json(upuser)
}

const deleteUserById = async (req, res) => {//vvvvvvvvvvvvvvv
    const { id } = req.params
    if (!id)
        return res.status(400).send("Id is required")
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).send("Not valid id")
    const users = await User.find().lean()
    if (!users?.length) {
        return res.status(404).json({ message: 'No users found' })
    }
    const user = await User.findById(id).exec()
    if (!user)
        return res.status(400).send("user is not exists")
    const result = await user.deleteOne()
    res.send(result)
}

module.exports = { getAllUsers, getUserById, updateUser, deleteUserById,getAllDonors,getAllStudents,addUser }