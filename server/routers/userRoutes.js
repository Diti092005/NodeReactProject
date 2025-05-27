const express=require("express")
const router=express.Router()
const userConroller=require("../controllers/userController")
const verifyJWTDonor=require("../middleware/verifyJWTDonor")
const verifyJWTAdmin=require("../middleware/verifyJWT_admin")
const verifyJWTStudent=require("../middleware/vevifyJWTStudent")

router.get("/",verifyJWTAdmin,userConroller.getAllUsers)
router.get("/donor",verifyJWTDonor,userConroller.getAllDonors)
router.get("/student",verifyJWTAdmin,userConroller.getAllStudents)
router.get("/:id",userConroller.getUserById)
router.put("/:id",verifyJWTAdmin,userConroller.inactiveUserById)
router.put("/",verifyJWTStudent,userConroller.updateUser)
router.post("/",verifyJWTDonor,userConroller.addUser)

module.exports=router