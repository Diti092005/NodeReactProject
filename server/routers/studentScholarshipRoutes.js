const express=require("express")
const router =express.Router()
const studentScholarshipController=require("../controllers/studentScholarshipController")
const verifyJWTAdmin=require("../middleware/verifyJWT_admin")
const vevifyJWTStudent=require("../middleware/vevifyJWTStudent")

router.post("/",vevifyJWTStudent,studentScholarshipController.addStudentScholarship)
router.get("/:id",vevifyJWTStudent, studentScholarshipController.getStudentScholarshipById)
router.get("/",verifyJWTAdmin,studentScholarshipController.getAllStudentScholarships)
router.put("/", vevifyJWTStudent,studentScholarshipController.updateStudentScholarship)
router.delete("/:id",verifyJWTAdmin, studentScholarshipController.deleteStudentScholarship)
router.get("/currentMonth/:student",vevifyJWTStudent, studentScholarshipController.getCurrentMonthScholarship);
router.get("/byStudent/:student",vevifyJWTStudent, studentScholarshipController.getStudentScholarshipByStudent);

module.exports = router