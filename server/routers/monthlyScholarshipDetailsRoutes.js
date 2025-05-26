const express=require("express")
const router=express.Router()
const msdController=require("../controllers/monthlyScholarshipDetailsController")
const verifyJWTAdmin=require("../middleware/verifyJWT_admin")
const verifyJWTStudent = require("../middleware/vevifyJWTStudent")

router.post("/",verifyJWTAdmin,msdController.addMonthlyScholarshipDetails)
router.get("/",verifyJWTAdmin,msdController.getAllMonthlyScholarshipDetails)

router.get("/thisMonth",verifyJWTStudent,msdController.getMonthlyScholarshipDetailsDate)
router.get("/:id",verifyJWTAdmin,msdController.getMonthlyScholarshipDetailsById)
router.put("/",verifyJWTAdmin,msdController.updateMonthlyScholarshipDetails)
router.delete("/:id",verifyJWTAdmin,msdController.deleteMonthlyScholarshipDetails)

module.exports=router