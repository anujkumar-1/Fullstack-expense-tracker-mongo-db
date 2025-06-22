import {expensePostData, expenseGetData} from "../controllers/ExpenseData.js";
import authMiddleware from '../middleware/Auth.js';

import express from 'express';
const router=express.Router()

router.post("/expenseForm",authMiddleware, expensePostData)
router.get("/expenseAllData/:pageId",authMiddleware , expenseGetData)


export default router;