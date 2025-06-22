import {downloadExpense} from "../controllers/ExpenseData.js";
import authMiddleware from "../middleware/Auth.js";

import express from 'express';
const router=express.Router()

router.get("/downloadS3Data", authMiddleware, downloadExpense)

export default router;