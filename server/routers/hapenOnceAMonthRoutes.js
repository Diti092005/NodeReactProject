const express=require("express")
const router=express.Router()
const verifyJWTAdmin=require("../middleware/verifyJWT_admin")

const happenOnceAMonth=require("../controllers/happenOnceAMonth")
router.post("/Income",verifyJWTAdmin,happenOnceAMonth.addMonthlyContributionsToCRS)
router.post("/Expense",verifyJWTAdmin,happenOnceAMonth.addStudentScholarshipOnceAMonthAndUpdateCRS)


module.exports=router