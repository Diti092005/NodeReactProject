const express=require("express")
const router =express.Router()
const studentScholarshipController=require("../controllers/studentScholarshipController")
const verifyJWTAdmin = require("../middleware/verifyJWTAdmin")

router.post("/",verifyJWTAdmin,studentScholarshipController.addStudentScholarship)
router.get("/:id", verifyJWTAdmin,studentScholarshipController.getStudentScholarshipById)
router.get("/",verifyJWTAdmin, studentScholarshipController.getAllStudentScholarships)
router.put("/",verifyJWTAdmin, studentScholarshipController.updateStudentScholarship)
router.delete("/:id",verifyJWTAdmin, studentScholarshipController.deleteStudentScholarship)

module.exports = router