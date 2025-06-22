import {buyPremiumGetReq, updatePremiumReqSuccess, updatePremiumReqFailed, getAllLeaderboardUser} from "../controllers/Premium.js"
import authMiddleware from '../middleware/Auth.js';

import express from 'express';
const router=express.Router()

router.get("/buyPremiumMembership", authMiddleware, buyPremiumGetReq)
router.post("/updatePremiumMembership", authMiddleware, updatePremiumReqSuccess)
router.post("/updateErrorPremiumMembership", authMiddleware, updatePremiumReqFailed)
router.get("/leaderboardAllUser", authMiddleware, getAllLeaderboardUser)


export default router;
