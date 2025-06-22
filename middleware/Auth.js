import User from "../models/User.js"
import jwt from "jsonwebtoken"

const auth = async (req, res, next)=>{
    try {
        const token = req.header("Authorization")
        const user= jwt.verify(token, process.env.JWT_TOKEN_SECRET) 
        const getCurrentUser = await User.findById(user.userId)

        req.activeUser = getCurrentUser
        req.user = user
        next()
    } catch (error) {
        console.error("auth :", error)
        res.status(500).json({message: "internal server error in auth"})
    }
}
export default auth;