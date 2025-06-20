const  jwt=require("jsonwebtoken")
const verifyJWTStudent=(req,res,next)=>{
    const authHeader=req.headers.authorization||req.headers.Authorization
    if(!authHeader?.startsWith("Bearer ")){
        return res.status(401).json({ message: 'Unauthorized' })
    }
    const token=authHeader.split(' ')[1]
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err,decode)=>{
            if (err||(decode.role!=="Admin"&&decode.role!=="Student"))
                 return res.status(403).json({ message:'Forbidden' })
            req.user=decode
            next()    
        }
    )

}
module.exports=verifyJWTStudent