import deleteExpense from "../controllers/deleteExpense.js"
import authMiddleware from "../middleware/Auth.js";

import express from 'express';
const router=express.Router()

router.delete("/deleteExpense", authMiddleware, deleteExpense)

export default router;