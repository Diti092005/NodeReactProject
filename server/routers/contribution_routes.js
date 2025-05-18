const express=require("express")
const router=express.Router()
const verifyJWTDonor=require("../middleware/verifyJWTDonor")
const verifyJWTAdmin=require("../middleware/verifyJWT_admin")


const contributionController=require("../controllers/contribution_controller")
router.post("/",verifyJWTDonor,contributionController.addContrbution)
router.get("/", verifyJWTAdmin,contributionController.getAllContrbutions)
router.get("/:id",verifyJWTAdmin,contributionController.getContrbutionById)
router.put("/",verifyJWTDonor,contributionController.updateContribution)
router.delete("/:id",verifyJWTDonor,contributionController.deleteContribution)
 
module.exports=router