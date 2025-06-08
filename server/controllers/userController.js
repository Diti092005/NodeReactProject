const { default: mongoose } = require("mongoose")
const User = require("../models/User")
const bcrypt = require("bcrypt")
const path = require('path');
const crypto = require('crypto');

const fs = require("fs")
const validator = require('validator');

function isValidPhone(phone) {
    return validator.isMobilePhone(phone, 'he-IL');
}

function isValidEmail(email) {
    return /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email);
}

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
}

const getAllUsers = async (req, res) => {//vvvvvvvvvvv
    const users = await User.find({ active: true }).lean()
    if (!users?.length) {
        return res.json([])
    }

    res.json(users)
}
const getAllStudents = async (req, res) => {//vvvvvvvvvvv
    const students = await User.find({ role: "Student", active: true }).lean()
    if (!students?.length) {
        return res.json([])
    }
    res.json(students)
}
const getAllDonors = async (req, res) => {//vvvvvvvvvvvvvvvvvv
    const donors = await User.find({ role: "Donor", active: true }).lean()
    if (!donors?.length) {
        return res.json([])
    }
    res.json(donors)
}

const getUserById = async (req, res) => {//vvvvvvvvvvvvvvv
    const { id } = req.params
    const users = await User.find().lean({ active: true })
    if (!users)
        return res.status(404).send("No users exists")
    if (!id)
        return res.status(400).send("Id is required")
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).send("Not valid id")
    const user = await User.findOne({ _id: id, active: true }).lean()
    if (!user)
        return res.status(400).send("This user isn't exists")
    res.json(user)
}

const addUser = async (req, res) => {

    const { userId, password, fullname, email, phone, city, numOfBuilding, street, birthDate, role, image } = req.body;
    if (!userId || !password || !fullname || !role) {
        return res.status(400).json({ message: 'userId, role, password and fullname are required' });
    }
    if (!isValidIsraeliID(userId)) {
        return res.status(400).json({ message: 'Invalid Israeli ID number.' });
    }
    const duplicate = await User.findOne({ userId }).lean();
    if (duplicate) {
        return res.status(409).json({ message: "Duplicate user id" });
    }
    if (role !== 'Donor' && role !== 'Admin' && role !== 'Student')
        return res.status(400).send("Role must be Donor, Student or Admin!");
    const hashedPassword = await bcrypt.hash(password, 10);
    if (phone && isValidPhone(phone) === false)
        return res.status(400).send("Invalid phone");
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
    }
    if (email && isValidEmail(email) === false) {
        return res.status(400).json({ message: 'Invalid email' });
    }
    if (numOfBuilding && isNaN(Number(numOfBuilding))) {
        return res.status(400).json({ message: 'Building number must be a number.' });
    }
    const newNum = Number(numOfBuilding);

    const userObject = {
        userId,
        password: hashedPassword,
        fullname,
        email,
        phone,
        address: { city, street, numOfBuilding: newNum },
        birthDate,
        active: true,
        role,
        image
    };
    const user = await User.create(userObject);
    if (user) { 
        return res.status(201).json({
            message: `New user ${user.fullname} created`,
            user
        });
    } else {
        return res.status(400).json({ message: 'Invalid user received' });
    }
};

const updateUser = async (req, res) => {
    const { userId, fullname, email, phone, street, numOfBuilding, city, birthDate, role, id, image } = req.body;
    if (!id)
        return res.status(400).send("Id is required");
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).send("Not valid id");

    const users = await User.find({ active: true }).lean();
    if (!users?.length) {
        return res.status(404).json({ message: 'No users found' });
    }

    const user = await User.findOne({ _id: id, active: true }).exec();
    if (!user)
        return res.status(400).send("user is not exists");

    if (userId) {
        if (!isValidIsraeliID(userId)) {
            return res.status(400).json({ message: 'Invalid Israeli ID number.' });
        }
        const existingUser = await User.findOne({ userId, active: true });
        if (existingUser && user.userId !== userId) {
            return res.status(400).send("User with same userId already exists");
        }
        user.userId = userId;
    }

    if (fullname)
        user.fullname = fullname;
    if (email && isValidEmail(email) === true)
        user.email = email;
    if (phone && isValidPhone(phone) === true)
        user.phone = phone;
    if (street)
        user.address.street = street;
    if (city)
        user.address.city = city;
    if (numOfBuilding && !isNaN(Number(numOfBuilding)))
        user.address.numOfBuilding = Number(numOfBuilding);
    if (birthDate) {
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        if (age > 18) {
            user.birthDate = birthDate;
        }
    }
    if (role) {
        if (role !== 'Donor' && role !== 'Admin' && role !== 'Student')
            return res.status(400).send("role must be Donor, Student or Admin!!");
        user.role = role;
    }

    if (image) {
        user.image = image[0];
    }

    const upUser = await user.save();
    res.json(upUser);
}

const inactiveUserById = async (req, res) => {//vvvvvvvvvvvvvvv
    const { id } = req.params
    if (!id)
        return res.status(400).send("Id is required")
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).send("Not valid id")
    const users = await User.find().lean()
    if (!users?.length) {
        return res.status(404).json({ message: 'No users found' })
    }
    const user = await User.findOne({ _id: id, active: true }).exec()
    if (!user)
        return res.status(400).send("user is not exists")
    user.active = false
    const deletedUser = await user.save()
    res.send(`Now User ${deletedUser.fullname} is Not Active!!`)
}

const uploadImage = async (req, res) => {
    if (!req.files) return res.status(400).json({ error: 'No file uploaded' });
    let files = [];
    for (const file of req.files) {
        const fileBuffer = fs.readFileSync(file.path);
        const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
        const ext = path.extname(file.originalname);
        const newFilename = `${hash}${ext}`;
        const newPath = path.join('uploads', newFilename);

        if (!fs.existsSync(newPath)) {
            fs.renameSync(file.path, newPath);
        } else {
            fs.unlinkSync(file.path);
        }

        files.push({
            url: `http://localhost:1111/uploads/${newFilename}`,
        });
    }

    res.json(files);
}

const deleteImage = async (req, res) => {
    const { url, _id } = req.body;
    if (!url) return res.status(400).json({ error: 'No URL provided' });
    if (!_id) return res.status(400).json({ error: 'No User ID provided' });
    const filename = path.basename(url);

    await User.findByIdAndUpdate(_id, { image: null });

    const otherUsersCount = await User.countDocuments({ image: url });
    const dirpath = "M:\\NodeReactPro\\server\\"
    if (otherUsersCount === 0) {
        const filePath = path.join(dirpath, 'uploads', filename);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Delete image error:', err);
                return res.json({ success: true, message: 'Image reference removed, file not found' });
            }
            res.json({ success: true, message: 'Image reference removed and file deleted' });
        });
    } else {
        res.json({ success: true, message: 'Image reference removed, file kept (in use by others)' });
    }
}
module.exports = { getAllUsers, getUserById, updateUser, inactiveUserById, getAllDonors, getAllStudents, addUser, uploadImage, deleteImage }