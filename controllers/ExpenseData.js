
import dotenv from 'dotenv';
dotenv.config()

import Expense from "../models/Expense.js";
import User from "../models/User.js";
import Income from "../models/Income.js";
import s3Urls from "../models/s3Url.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import {generateAndUploadPDF} from "./helper.js"


export const uploadToS3 = async (data, filename) => {
  const IAM_USER_KEY = process.env.AWS_S3_ACCESS_KEY;
  const IAM_USER_SECRET = process.env.AWS_S3_SECRET_KEY;
  const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

  const client = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET,
    },
  });

  var params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };
  const command = new PutObjectCommand(params);
  try {
    const response = await client.send(command);
    if (response.$metadata.httpStatusCode == 200) {
      let url = `https://${params.Bucket}.s3.us-east-1.amazonaws.com/${params.Key}`;
      return url;
    }
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

export const expensePostData = async (req, res) => {
  try {
    const { amount, description, category } = req.body;
    const token = req.header("Authorization");
    const response = await Expense.create({
      amount: amount,
      description: description,
      category: category,
      userId: req.user.userId,
    });
    const updatedCost = Number(req.activeUser.totalCost) + Number(amount);
    console.log("updatedCost", updatedCost)
    const updatedTotalCost = await User.updateOne(
      { _id: req.user.userId },
      { $set: { totalCost: updatedCost } }
    );
    res
      .status(201)
      .json({ data: response, totalAmount: updatedCost, updatedTotalCost });
  } catch (error) {
    console.log(error);
  }
};

export const expenseGetData = async (req, res, next) => {
  try {
    const page = +req.params.pageId;
    const rowsPerPage = +req.query.rowsPerPage;
    const dailyWeeklyYearly = req.query.dailyWeeklyMonthlyYearlyData;
    const rowsPerPageFrmExpense = Math.floor((rowsPerPage * 4) / 5);
    const rowsPerPageFrmIncome = Math.floor((rowsPerPage * 1) / 5);
    let arr = [];
    const today = new Date();
    let startTime = null;
    let endTime = null;

    switch (dailyWeeklyYearly) {
      case "daily":
        startTime = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );
        endTime = new Date(startTime.getTime() + 86399999); // Add one day minus 1ms
        break;
      case "weekly":
        endTime = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          23,
          59,
          59,
          999
        );
        startTime = new Date(endTime.getTime() - 7 * 86400000); // Subtract 7 days
        break;
      case "monthly":
        startTime = new Date(today.getFullYear(), today.getMonth(), 1);
        endTime = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0,
          23,
          59,
          59,
          999
        );
        break;
      default:
        startTime = new Date(today.getFullYear(), 0, 1);
        endTime = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);
        break;
    }
    console.log(startTime, endTime);

    const response4Expense = await Expense.find(
      {
        userId: req.user.userId,
        createdAt: {
          $gte: new Date(startTime),
          $lte: new Date(endTime)
        }
      },
      {
        amount: 1,
        description: 1,
        category: 1,
        createdAt: 1
      }
    )
    .sort({ createdAt: 1 }) // ASC order
    .skip((page - 1) * rowsPerPageFrmExpense)
    .limit(rowsPerPageFrmExpense);


    const response4Income = await Income.find(
      {
        userId: req.user.userId,  // assuming 'userId' is the field in your MongoDB model
        createdAt: {
          $gte: new Date(startTime),
          $lte: new Date(endTime)
        }
      },
      {
        amount: 1,
        description: 1,
        category: 1,
        createdAt: 1
      }
    )
    .sort({ createdAt: 1 }) // ascending order by createdAt
    .skip((page - 1) * rowsPerPageFrmIncome)
    .limit(rowsPerPageFrmIncome);


    if (
      response4Income.length != rowsPerPageFrmIncome &&
      response4Expense.length == rowsPerPageFrmExpense
    ) {
      const deficitInIncomeData = rowsPerPageFrmIncome - response4Income.length;
      const defecitedExpenseData4Income = await Expense.find(
      {
        userId: req.user.userId, // replace with actual user ID field in your MongoDB schema
        createdAt: {
          $gte: new Date(startTime),
          $lte: new Date(endTime)
        }
      },
      {
        amount: 1,
        description: 1,
        category: 1,
        createdAt: 1
      }
    )
    .sort({ createdAt: 1 }) // ascending order
    .skip((page - 1) * rowsPerPageFrmExpense)
    .limit(deficitInIncomeData);

    arr = [
      ...response4Expense,
      ...response4Income,
      ...defecitedExpenseData4Income,
    ];
    } else if (
      response4Expense.length != rowsPerPageFrmExpense &&
      response4Income.length == rowsPerPageFrmIncome
    ) {
      const deficitInExpenseData =
        rowsPerPageFrmExpense - response4Expense.length;
      
      const defecitedIncomeData4Expense = await Income.find(
      {
        userId: req.user.userId, // Ensure this field matches your schema
        createdAt: {
          $gte: new Date(startTime),
          $lte: new Date(endTime)
        }
      },
      {
        amount: 1,
        description: 1,
        category: 1,
        createdAt: 1
      }
    )
    .sort({ createdAt: 1 }) // Ascending order by createdAt
    .skip((page - 1) * rowsPerPageFrmIncome)
    .limit(deficitInExpenseData);
      

      arr = [
        ...response4Expense,
        ...response4Income,
        ...defecitedIncomeData4Expense,
      ];
    } else {
      arr = [...response4Expense, ...response4Income];
    }

    const sortedArray = sortArr(arr);

    const allExpenseCount = await Expense.countDocuments({
      userId: req.user.userId, // Make sure this matches your schema field
      createdAt: {
        $gte: new Date(startTime),
        $lte: new Date(endTime)
      }
    });

    const allIncomeCount = await Income.countDocuments({
      userId: req.user.userId, // adjust based on your schema
      createdAt: {
        $gte: new Date(startTime),
        $lte: new Date(endTime)
      }
    });

    // Total Expense Amount
    const expenseTotalResult = await Expense.aggregate([
      {
        $match: {
          userId: req.user.userId, // make sure it matches your schema field
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" }
        },
      },
    ]);

    const totalAmount = expenseTotalResult[0]?.totalAmount || 0;

    // Total Income Amount
    const incomeTotalResult = await Income.aggregate([
      {
        $match: {
          userId: req.user.userId,
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: "$amount" }
        },
      },
    ]);

    const totalIncome = incomeTotalResult[0]?.totalIncome || 0;

    res.status(200).json({
      allData: sortedArray,
      totalExpense: totalAmount,
      totalIncome: totalIncome,
      allExpenseCount,
      allIncomeCount,
      currentPage: page,
      lastPage: Math.ceil((allExpenseCount + allIncomeCount) / rowsPerPage),
      arr: arr
    });
  } catch (error) {
    console.error("expenseGetData :", error);
  }
};

export const sortArr = function (arr) {
  return arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
};

export const downloadExpense = async (req, res) => {
  try {
    const uuid = uuidv4();
    if (req.user.ispremiumuser == true) {
      const filename = `Expense-${req.user.name}-${uuid}.txt`;
            // Get user info
      const getAllData = await User.findById(req.user.userId, {
        username: 1,
        email: 1,
        ispremiumuser: 1,
        totalCost: 1,
        totalIncome: 1,
      });

      // Get all expense entries
      const getAllExpense = await Expense.find(
        { userId: req.user.userId },
        { amount: 1, description: 1, createdAt: 1 }
      );

      const allData = [getAllData, ...getAllExpense];

      console.log("getAllData", getAllData, getAllExpense)
      const stringifiedData = JSON.stringify(allData);
      const s3Data = await generateAndUploadPDF(getAllData, getAllExpense, filename)
      // const s3Data = await uploadToS3(stringifiedData, filename);

      const s3Link = await s3Urls.create({
        link: s3Data,
        userId: req.user.userId,
      });
      console.log("s3Data", s3Data);
      res.status(200).json({ data: s3Data});
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
  }
};
