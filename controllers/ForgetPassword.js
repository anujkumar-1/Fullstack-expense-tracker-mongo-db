import User from "../models/User.js"
import ForgetPassword from "../models/Forgetpassword.js"
import nodemailer from "nodemailer"
import { v4 as uuidv4 } from 'uuid';
import bcrypt from "bcrypt";
 
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "jesuoor@gmail.com",
    pass: process.env.NODEMAILER_GMAIL_PASSKEY,
  },
  
});


export async function sendMail(to, sub, msg, id, name){
    await transporter.sendMail({
        to: to,
        subject: sub,
        text: msg,
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Password</title>
            <style>
                body {
                font-family: 'Arial', sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
                color: #333333;
                line-height: 1.6;
                }
                .email-container {
                max-width: 600px;
                margin: 20px auto;
                background: #ffffff;
                border: 1px solid #ddd;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .email-header {
                background-color: #6c63ff;
                color: #ffffff;
                padding: 20px;
                text-align: center;
                border-radius: 8px 8px 0 0;
                }
                .email-header h1 {
                margin: 0;
                font-size: 24px;
                }
                .email-body {
                padding: 20px;
                }
                .email-body p {
                margin: 10px 0;
                font-size: 16px;
                }
                .reset-button {
                display: inline-block;
                margin: 20px 0;
                padding: 12px 24px;
                background-color: #6c63ff;
                color: #ffffff;
                text-decoration: none;
                font-size: 16px;
                font-weight: bold;
                border-radius: 6px;
                }
                .reset-button:hover {
                background-color: #5446cc;
                }
                .email-footer {
                text-align: center;
                font-size: 14px;
                color: #999999;
                padding: 20px;
                border-top: 1px solid #dddddd;
                }
                .email-footer a {
                color: #6c63ff;
                text-decoration: none;
                }
                .email-footer a:hover {
                text-decoration: underline;
                }
            </style>
            </head>
            <body>
            <div class="email-container">
                <div class="email-header">
                <h1>Reset Your Password</h1>
                </div>
                <div class="email-body">
                <p>Hi ${name},</p>
                <p>We received a request to reset your password. Click the button below to reset it:</p>
                <p style="text-align: center;">
                    <a href="http://localhost:3000/password/resetpassword/${id}" class="reset-button">Reset Password</a>
                </p>
                <p>If you didn’t request this, please ignore this email or contact support if you have concerns.</p>
                <p>Thanks,</p>
                <p>The Expenso Team</p>
                </div>
                <div class="email-footer">
                <p>If you're having trouble clicking the button, copy and paste the link below into your web browser:</p>
                <p><a href="#">Click here</a></p>
                <p>&copy; 2025 Expenso. All rights reserved.</p>
                </div>
            </div>
            </body>
            </html>

            `, // html body
    })
}


export const forgetPasswordReq = async(req, res) =>{
    try {
        const email = req.body.email
        console.log(email)
        console.log("req.body", req.user)
        const user = await User.findOne({ email });
        console.log(user)
        if(user){
            const id = uuidv4()
            const msg = await sendMail(email, `Reset Password for ${email}`, "Click on the link below", id, req.user.name)
            const data=await ForgetPassword.create({_id: id, userId: req.user.userId, isActive: true, userId: req.user.userId})
            console.log(id)
            res.status(200).json({msg})

        }else{
            res.status(404).json({message: "User not found"})
        }
        
        
    } catch (error) {
        console.log(error)
        res.status(500).json()

    }
}

export const resetPasswordReq = async (req, res) => {
    try {
        const uid = req.params.id
        const Fpid = await ForgetPassword.findOne({_id: uid})
        if(Fpid){
            Fpid.isActive = false;
            await Fpid.save();            
            res.status(200).send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Reset Password</title>
                    <style>
                    body {
                        margin: 0;
                        font-family: 'Arial', sans-serif;
                        background: linear-gradient(135deg, rgb(224, 247, 250), rgb(108, 99, 255));
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        color: #333;
                    }

                    .container {
                        background: white;
                        padding: 2rem;
                        border-radius: 10px;
                        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                        max-width: 320px;
                        width: 100%;
                    }

                    .reset-password-form h1 {
                        font-size: 1.8rem;
                        margin-bottom: 1.5rem;
                        color: color: rgb(51, 51, 51);;
                        text-align: center;
                    }

                    .input-group {
                        margin-bottom: 1.5rem;
                        position: relative;
                    }

                    .input-group label {
                        font-size: 0.9rem;
                        color: #555;
                        margin-bottom: 0.5rem;
                        display: block;
                    }

                    .input-group input {
                        width: 100%;
                        padding: 0.75rem;
                        border: 1px solid #ccc;
                        border-radius: 8px;
                        font-size: 1rem;
                        outline: none;
                        transition: all 0.3s ease;
                    }

                    .input-group input:focus {
                        border-color: rgb(108, 99, 255);
                        box-shadow: 0 0 4px rgba(108, 99, 255, 0.5);
                    }

                    .input-group .toggle-password {
                        position: absolute;
                        right: 10px;
                        top: 50%;
                        transform: translateY(-50%);
                        cursor: pointer;
                        font-size: 1.2rem;
                        color: #888;
                        transition: color 0.3s ease;
                    }

                    .input-group .toggle-password:hover {
                        color: rgb(108, 99, 255);
                    }

                    button {
                        width: 100%;
                        padding: 0.75rem;
                        border: none;
                        border-radius: 8px;
                        background: #ffa116;
                        color: white;
                        font-size: 1rem;
                        cursor: pointer;
                        transition: background 0.3s ease;
                    }

                    button:hover {
                        background: rgb(88, 79, 230);
                    }
                    </style>
                </head>

                <body>
                    <div class="container" id="container">
                        <form class="reset-password-form" action="/password/updatepassword/${uid}" method="get">
                            <h1>Reset Password</h1>
                            <div class="input-group">
                                <label for="resetPassword">New Password</label>
                                <input type="password" name="resetPassword" id="resetPassword" placeholder="Enter new password">
                            </div>
                            <button id="resetPasswordButton">Reset Password</button>
                        </form>
                    </div>
                </body>
                </html>
    
            `)
            res.end()
        }

    } catch (error) {
        console.log(error)
    }
}

export const updatePasswordReq = async(req, res)=>{
    const saltrounds = 10
    const newPassword = req.query.resetPassword
    const uuid = req.params.resetpasswordid
    const activeUser = await ForgetPassword.findOne({_id: uuid})
    bcrypt.hash(newPassword, saltrounds, async(err, hash)=>{
        if(err){
            throw new Error("Something went wrong")
        }
        const updatingPassword = await User.findByIdAndUpdate(
            activeUser.userId,
            { password: hash },
            { new: true }
        );

        res.status(200).json({newPassword: hash, updatingPassword})
    })
}
