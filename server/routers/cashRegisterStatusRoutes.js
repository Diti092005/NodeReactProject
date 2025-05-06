const express = require("express")
const router = express.Router()
const CashRegisterStatusController = require("../controllers/cashRegisterStatusController")
const verifyJWTAdmin = require("../middleware/verifyJWTAdmin")
router.get("/", verifyJWTAdmin, CashRegisterStatusController.getAllCashRegisterSatus)
router.get("/:id", verifyJWTAdmin, CashRegisterStatusController.getCashRegisterStatusById)
router.post("/", verifyJWTAdmin, CashRegisterStatusController.addCashRegisterStatus)
router.put("/", verifyJWTAdmin, CashRegisterStatusController.updateCashRegisterStatus)
router.delete("/:id", verifyJWTAdmin, CashRegisterStatusController.deleteCashRegisterStatusById)
module.exports = router

