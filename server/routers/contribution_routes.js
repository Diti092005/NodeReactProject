const express=require("express")
const router=express.Router()
const verifyJWTDonor=require("../middleware/verifyJWTDonor")
const verifyJWTAdmin=require("../middleware/verifyJWT_admin")
const contributionController=require("../controllers/contribution_controller")
router.post("/",verifyJWTDonor,contributionController.addContrbution)
router.post("/donor/:id",verifyJWTDonor,contributionController.addContrbutionByDonorId)

router.get("/", verifyJWTAdmin,contributionController.getAllContrbutions)
router.get("/:id",verifyJWTDonor,contributionController.getContrbutionById)
router.get("/donor/:id",verifyJWTDonor,contributionController.getContrbutionByDonorId)

router.put("/",verifyJWTDonor,contributionController.updateContribution)
router.put("/donor/:id",verifyJWTDonor,contributionController.updateContributionByDonorId)

router.delete("/:id",verifyJWTDonor,contributionController.deleteContribution)
 
module.exports=router