const BankDetails=require("../models/Bank_details")
const User = require("../models/User")
const isNumeric = (str) => {
    return /^[0-9]+$/.test(str);}
const addBankDetails=async(req,res)=>{
    const{student,bankNumber,bankAccount,bankBranch}=req.body
    if(!student||!bankBranch||!bankAccount||!bankNumber)
        return res.status(400).send("All fields are required ")
    if (  !isNumeric(bankBranch)||!isNumeric(bankNumber)||!isNumeric(bankAccount)) {//////////////////////////////
        return res.status(400).send(" field must be a number ")//////////////////////////////////////אם ריק יש שגיאה
    }
    if(!User.find())
        return res.status(404).send("There are no users ")
    const existStudent = await User.findOne({_id:student}).lean()
    if (existStudent)
        return res.status(400).send("BankDetails of this student exists")
    const bankDetails = await BankDetails.create({student,bankNumber,bankAccount,bankBranch})
    
    res.json(bankDetails)
}
const getAllBankDetails = async (req, res) => {/////////vvvvvvvvvvvvvvvvvvv
    const allBankDetails = await BankDetails.find().lean()
    if(!allBankDetails?.length)
        res.json([])
    res.json(allBankDetails)
}
const getBankDetailsById = async (req, res) => {/////////vvvvvvvvvvvvvvvvvvv
    const { id } = req.params
    if (!id)
        return res.status(400).send("Id is required")
    if(!User.find())
        return res.status(404).send("There are no users ")
    const allBankDetails = await BankDetails.find().lean()
    if (!allBankDetails?.length)
        return res.status(404).send("No bankDetails exists")
    const bankDetails = await BankDetails.findById(id).lean()
    if (!bankDetails)
        return res.status(400).send("bankDetails is not exists")
    res.json(bankDetails)
}
const updateBankDetails=async(req,res)=>{//////////////////vvvvvvvvvvvvvvvvvvv
    const{student,bankNumber,bankAccount,bankBranch,id}=req.body
    if (!id)
        return res.status(400).send("Id is required")
    if (  !isNumeric(bankBranch)||!isNumeric(bankNumber)||!isNumeric(bankAccount)) {
        //console.log(bankNumber);console.log(bankBranch);console.log(bankAccount);
        return res.status(400).send(" field must be a number ")
    }
    if(!User.find())
        return res.status(404).send("There are no users ")
    const bankDetails = await BankDetails.findById(id).exec()
    
    if (!bankDetails)
        return res.status(400).send("etails is not exists")
    if(student)
        bankDetails.student=student
    if(bankNumber)
        bankDetails.bankNumber=bankNumber
    if(bankAccount)
        bankDetails.bankAccount=bankAccount
    if(bankBranch)
        bankDetails.bankBranch=bankBranch
    const updatedBankDetails=await bankDetails.save()
    res.json(updatedBankDetails)

}
const deleteBankDetails = async (req, res) => {//////////////////////vvvvvvvvvvvvvvvvvvv
    const { id } = req.params
    if (!id)
        return res.status(400).send("Id is required")
    if(!User.find())
        return res.status(404).send("There are no users ")
    const bankDetails = await BankDetails.findById(id).exec()
    if (!bankDetails)
        return res.status(400).send("BankDetails is not exists")
    const result = await bankDetails.deleteOne()
    res.send(result)
}
module.exports={addBankDetails,getAllBankDetails,deleteBankDetails,getBankDetailsById,updateBankDetails}