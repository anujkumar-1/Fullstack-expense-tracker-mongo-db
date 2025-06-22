import express from 'express';
const app= express()
import fs from 'fs';
import path from 'path';
import helmet from 'helmet';
import compression from 'compression'; 
import morgan from 'morgan';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
dotenv.config()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'views')));
console.log("expxessss", express.static(path.join(__dirname, 'views')))

const accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {flags: "a"})

app.use(helmet())
app.use(compression())
app.use(morgan("combined", {stream: accessLogStream}))
app.use(express.json())
app.use(express.urlencoded({ extended: false })); 

// Derive __dirname in ES module scope

import cors from 'cors';

import connectDB from "./utils/Mongodb.js"

import userRoute from './routes/userRoutes.js';
import awsroute from './routes/AwsRoutes.js';
import premiumroute from './routes/PremiumRoutes.js';
import incomeroute from './routes/IncomeRoutes.js';
import expenseroute from './routes/ExpenseRoutes.js';
import passwordroute from './routes/PasswordRoutes.js';
import deleteRoute from "./routes/DeleteExpense.js"


app.use(cors())

app.use("/users", userRoute)
app.use("/expenses", expenseroute)
app.use("/password", passwordroute)
app.use(premiumroute)
app.use(incomeroute)
app.use(awsroute)
app.use(deleteRoute)

app.use('/', (req, res) => {
    console.log("urlll", req)
  res.sendFile(path.join(__dirname, 'views', 'Signup.html'));
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(3000, () => {
      console.log(`Server running on port 3000`);
    });
  } catch (err) {
    console.error('Failed to connect to DB:', err);
  }
};

startServer()
