import Expense from "../models/Expense.js"
import User from "../models/User.js"
import Income from "../models/Income.js"


const deleteExpense = async (req, res, next)=>{
    try {
        
        const expenseId = +req.query.id
        const activeUserId = req.activeUser._id
        const expCategory = req.query.category
        const expAmount = req.query.amount
        const expDescription = req.query.description
        
        console.log(expenseId, activeUserId, expCategory, expAmount, expDescription) 
        if (expCategory === "Income") {
            await Income.deleteOne({
                userId: activeUserId,
                category: expCategory,
                amount: expAmount,
                description: expDescription
            });
            

            const user = await User.findById(req.user.userId);
            const new_total_income = Number(user.totalIncome || 0) - Number(expAmount);
            console.log("new_total_income", new_total_income);

            const updatedUser = await User.findByIdAndUpdate(
                req.user.userId,
                { totalIncome: new_total_income },
                { new: true }
            );

            res.status(200).json({ updatedTotalCost: updatedUser.totalIncome });

        } else {
            await Expense.deleteOne({
                userId: activeUserId,
                category: expCategory,
                amount: expAmount,
                description: expDescription
            });
            

            const user = await User.findById(req.user.userId);
            const new_total_cost = Number(user.totalCost || 0) - Number(expAmount);
            console.log("new_total_cost", new_total_cost);

            const updatedUser = await User.findByIdAndUpdate(
                req.user.userId,
                { totalCost: new_total_cost },
                { new: true }
            );

            res.status(200).json({ updatedTotalCost: updatedUser.totalCost });
        }

                
        
    } catch (error) {
        throw new Error(error)
    }
    
}

export default deleteExpense
