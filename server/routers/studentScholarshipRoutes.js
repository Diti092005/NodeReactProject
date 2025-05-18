const express=require("express")
const router =express.Router()
const studentScholarshipController=require("../controllers/studentScholarshipController")
const verifyJWTAdmin=require("../middleware/verifyJWT_admin")
const vevifyJWTStudent=require("../middleware/vevifyJWTStudent")

router.post("/",verifyJWTAdmin,studentScholarshipController.addStudentScholarship)
router.get("/:id",verifyJWTAdmin, studentScholarshipController.getStudentScholarshipById)
router.get("/", verifyJWTAdmin,studentScholarshipController.getAllStudentScholarships)
router.put("/", vevifyJWTStudent,studentScholarshipController.updateStudentScholarship)
router.delete("/:id",verifyJWTAdmin, studentScholarshipController.deleteStudentScholarship)

module.exports = router