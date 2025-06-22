import {signUp, login} from "../controllers/User.js";


import express from 'express';
const router=express.Router()


router.post("/signup", signUp)
router.get("/login", login)


export default router;