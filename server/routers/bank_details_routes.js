const express=require("express")
const verifyJWTAdmin=require("../middleware/verifyJWT_admin")
const router =express.Router()
const verifyJWT=require("../middleware/verifyJWTDonor")
const bankDetailsController=require("../controllers/Bank_detail_controller")
router.post("/",verifyJWTAdmin,bankDetailsController.addBankDetails)
router.get("/:id",verifyJWTAdmin, bankDetailsController.getBankDetailsById)
router.get("/",verifyJWTAdmin ,bankDetailsController.getAllBankDetails)
router.put("/",verifyJWTAdmin, bankDetailsController.updateBankDetails)
router.delete("/:id",verifyJWTAdmin, bankDetailsController.deleteBankDetails)

module.exports = router