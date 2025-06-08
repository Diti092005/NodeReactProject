const express = require("express");
const router = express.Router();
const multer = require('multer');
const path=require("path")
const userConroller = require("../controllers/userController");
const verifyJWTDonor = require("../middleware/verifyJWTDonor");
const verifyJWTAdmin = require("../middleware/verifyJWT_admin");
const verifyJWTAll = require("../middleware/verifyJWTAll");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get("/", verifyJWTAdmin, userConroller.getAllUsers);
router.get("/donor", verifyJWTDonor, userConroller.getAllDonors);
router.get("/student", verifyJWTAdmin, userConroller.getAllStudents);
router.get("/:id",verifyJWTAll, userConroller.getUserById);
router.put("/:id", verifyJWTAdmin, userConroller.inactiveUserById);
router.put("/",verifyJWTAll, userConroller.updateUser);
router.post("/",verifyJWTAll, userConroller.addUser);
router.post("/upload-image", upload.array("image", 10),userConroller.uploadImage)
router.delete('/delete-image',verifyJWTAll,userConroller.deleteImage)
module.exports = router;