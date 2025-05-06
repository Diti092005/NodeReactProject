const express=require("express")
const router=express.Router()
const userConroller=require("../controllers/userController")
const verifyJWTAdmin = require("../middleware/verifyJWTAdmin")
router.get("/",verifyJWTAdmin,userConroller.getAllUsers)
router.get("/:id",verifyJWTAdmin,userConroller.getUserById)
router.put("/",verifyJWTAdmin,userConroller.updateUser)
router.delete("/:id",verifyJWTAdmin,userConroller.deleteUserById)
module.exports=router