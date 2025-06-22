import {forgetPasswordReq, resetPasswordReq, updatePasswordReq} from "../controllers/ForgetPassword.js"
import authMiddleware from '../middleware/Auth.js';

import express from 'express';
const router=express.Router()

router.post("/forgotpassword", authMiddleware, forgetPasswordReq)
router.use("/resetpassword/:id",  resetPasswordReq)
router.get("/updatepassword/:resetpasswordid", updatePasswordReq)


export default router;