const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const userConroller = require("../controllers/userController");
const verifyJWTDonor = require("../middleware/verifyJWTDonor");
const verifyJWTAdmin = require("../middleware/verifyJWT_admin");
const verifyJWTStudent = require("../middleware/vevifyJWTStudent");

router.get("/", verifyJWTAdmin, userConroller.getAllUsers);
router.get("/donor", verifyJWTDonor, userConroller.getAllDonors);
router.get("/student", verifyJWTAdmin, userConroller.getAllStudents);
router.get("/:id", userConroller.getUserById);
router.put("/:id", verifyJWTAdmin, userConroller.inactiveUserById);
router.put("/", userConroller.updateUser);
// router.post('/upload-image', ImageUpload);
router.post("/", userConroller.addUser);

module.exports = router;