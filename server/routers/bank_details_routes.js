const express = require("express")
const router = express.Router()
const bankDetailsController = require("../controllers/bankDetailsConroller")
const verifyJWTAdmin = require("../middleware/verifyJWTAdmin")
router.post("/", verifyJWTAdmin, bankDetailsController.addBankDetails)
router.get("/:id", verifyJWTAdmin, bankDetailsController.getBankDetailsById)
router.get("/", verifyJWTAdmin, bankDetailsController.getAllBankDetails)
router.put("/", verifyJWTAdmin, bankDetailsController.updateBankDetails)
router.delete("/:id", verifyJWTAdmin, bankDetailsController.deleteBankDetails)

module.exports = router