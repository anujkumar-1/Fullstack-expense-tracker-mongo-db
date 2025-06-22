import Income from "../models/Income.js"
import User from "../models/User.js"


 export const IncomePostReq = async(req, res)=>{
    try {
        // const t = await sequelize.transaction()
        console.log("req income", req.user);
        const {amount, description, category} = req.body
        const token = req.header("Authorization")
        console.log("IncomePostReq :",token);
        const postData = await Income.create({amount:amount, description:description, category: category, userId: req.user.userId})
        const updatedIncome = Number(req.activeUser.totalIncome) + Number(amount)
        console.log(updatedIncome)
        const updateTotalIncome = await User.updateOne({ _id: req.user.userId },{ $set: { totalIncome: updatedIncome } });

        // await t.commit()
        res.status(201).json({data:postData, totalIncome:updatedIncome, updateTotalIncome})
    } catch (error) {
        // await t.rollback()
        console.log(error)
    }

}
export const abcIncome = async(req, res)=>{
    try {
        console.log(req.params.pageId, req.query.pageId, req.query.username, req.header("Authorization"))
    } catch (error) {
        console.log(error)
    }
    res.end()
}
