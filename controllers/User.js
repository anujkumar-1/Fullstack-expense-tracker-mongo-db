import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

export function generateAccessTokens(id, name, ispremiumuser, totalCost){
    const token = jwt.sign({userId: id, name:name, ispremiumuser, totalCost}, process.env.JWT_TOKEN_SECRET)
    return token
}



export const signUp = async (req, res)=>{
    try {
        // const t = await sequelize.transaction()
        const username = req.body.username
        const email = req.body.email
        const password = req.body.password
        const saltrounds = 10

        const userAlreadyExist = await User.find({ email: email });
        console.log("userAlreadyExist", userAlreadyExist.length)

        if(userAlreadyExist.length > 0){
            res.status(401).json({message: 'User Already Exist. Try Another'});
            
        }
        else{
            bcrypt.hash(password, saltrounds, async(err, hash)=>{
                if(err){
                
                    throw new Error("Something went wrong")
                }
                const data = await User.create({username: username, email: email, password: hash})
                // await t.commit()
                res.status(201).json({user: data})
            })
            
        }

    } catch (error) {
        // await t.rollback()
        console.log("signUp :", error)
    }
}

export const login = async (req, res)=>{
    try {
        const email = req.query.verifyEmail
        const password = req.query.verifyPassword
        console.log(email, password)
        const user = await User.find({email: email});
        console.log(user)

        if (user.length > 0) {
            bcrypt.compare(password, user[0].password, function(err, result) {
                // result == true
                if(err){
                    throw new Error("Something went wrong")
                }
                if(result===true){
                    console.log("user result", user[0]._id, user[0].username, user[0].email, user[0].ispremiumuser, user[0].totalCost)
                    res.status(200).json({user: user, message: "logged in sucessfully", token: generateAccessTokens(user[0]._id, user[0].username, user[0].ispremiumuser, user[0].totalCost)});
                }
                else{
                    res.status(401).json({message: "User not authorized"});
                }
            });
            
            
        }else {
            res.status(404).json({ message: 'User not found' });
        }
        
        
    } catch (error) {
        console.log("login :", error)
    }
}