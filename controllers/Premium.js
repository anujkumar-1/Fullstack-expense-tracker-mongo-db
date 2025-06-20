import Order from "../models/Order.js";
import User from "../models/User.js";
import Razorpay from "razorpay";
import jwt from 'jsonwebtoken';

export const buyPremiumGetReq = async (req, res) => {
  try {
    var rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const amount = 100;
    rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
      try {
        if (err) {
          throw new Error(JSON.stringify(err));
        }
        console.log(req.user);
        const data = await Order.create({orderid: order.id, status: "PENDING", userId: req.user.userId});
        res.status(201).json({ order, key_id: rzp.key_id, status: "PENDING", data });
      } catch (error) {
        throw new Error(error);
      }
    });
  } catch (error) {
    console.log("Something went wrong in buyPremiumGetReq");
  }
};

export const updatePremiumReqSuccess = async function (req, res) {
  try {
    const token = req.header("Authorization");
    console.log(token);
    console.log("req.user", req.user);
    const { order_id, payment_id } = req.body;
    const promise1 = await Order.findOneAndUpdate(
      { orderid: order_id },
      {
        paymentstatus: payment_id,
        status: "SUCESSFULL"
      },
      {
        new: true // returns the updated document
      }
    );
    
    const promise2 = await User.findByIdAndUpdate(
      req.user.userId,
      {ispremiumuser: true},
      {new: true}
    );
    console.log(promise2.ispremiumuser);
    res
      .status(200)
      .json({
        sucess: true,
        message: "you are a premium user",
        promise1,
        promise2,
        token: jwt.sign(
          {
            userId: req.user.userId,
            name: req.user.name,
            ispremiumuser: promise2.ispremiumuser,
            totalCost: promise2.totalCost
          },
          process.env.JWT_TOKEN_SECRET
        ),
      });
  } catch (error) {
    throw new Error(error);
  }
};

export const updatePremiumReqFailed = async function (req, res) {
  try {
    const { order_id, payment_id } = req.body;
    const promise1 = await Order.updateOne(
      { orderid: order_id },
      {
        $set: {
          paymentstatus: payment_id,
          status: "Failed"
        }
      }
    );

    // t.commit()
    res.status(200).json({ sucess: false, message: "Transaction Failed" });
  } catch (error) {
    // t.rollback()
    throw new Error(error);
  }
};

export const getAllLeaderboardUser = async function (req, res) {
  try {
    const arrOfAllUsers = await User.find(
      { totalCost: { $ne: 0 } },              
    )
    .sort({ totalCost: -1 })                   // descending order
    .limit(30);                                // limit to 30 results


    res.status(200).json({ arrOfAllUsers, user: req.user });
  } catch (error) {
    console.log(error);
    throw new Error("Problem in getAllLeaderboardUser");
  }
};

