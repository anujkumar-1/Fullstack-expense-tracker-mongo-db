import {IncomePostReq, abcIncome} from "../controllers/Income.js"
import authMiddleware from '../middleware/Auth.js';

import express from 'express';
const router=express.Router()

router.post("/registerIncome",authMiddleware, IncomePostReq)
router.get("/abc/:pageId", abcIncome)

export default router;
