const express=require("express")
const router=express.Router()
const verifyJWTAdmin=require("../middleware/verifyJWT_admin")

const CashRegisterStatusController=require("../controllers/cashRegisterStatusController")
router.get("/",verifyJWTAdmin,CashRegisterStatusController.getAllCashRegisterStatus)
router.get("/:id",verifyJWTAdmin,CashRegisterStatusController.getCashRegisterStatusById)
router.post("/",verifyJWTAdmin,CashRegisterStatusController.addCashRegisterStatus)
router.put("/",verifyJWTAdmin,CashRegisterStatusController.updateCashRegisterStatus)
router.delete("/:id",verifyJWTAdmin,CashRegisterStatusController.deleteCashRegisterStatusById)
module.exports=router

