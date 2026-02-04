
import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import VerificationEmail from "../helpers/verifyEmailTemplate.js";
import sendEmailFun from "../config/sendEmail.js";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import generatedRefreshToken from "../utils/generatedRefreshToken.js";


export async function registerUserController(req, res) {
    try {

        let user;

        const {name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required",
                error: true,
            });
        }

        user = await UserModel.findOne({ email : email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email",
                error: true,
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        user = new UserModel({
            name,
            email,
            password: hashedPassword,
            otp: verifyCode,
            otp_expiry: Date.now() + 10 * 60 * 1000, // 10 minutes from now
        });
        await user.save();        
        await sendEmailFun(
            email,
            "Please verify your email",
            ``,
            VerificationEmail(name, verifyCode)
        );

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(201).json({
            success: true,
            message: "User registered successfully. Please verify your email.",
            token:token,
            error: false,
        });
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || error,
            error: true,
        });
    }
}

export async function verifyEmailController(req, res) {
    try {
       const { email, otp } = req.body;
       const user = await UserModel.findOne({ email: email });

       if (!user) {
        return res.status(400).json({
            success: false,
            message: "User not found",
            error: true,
        });
       }

       const isCodeValid = user.otp === otp
       const isCodeExpired = user.otp_expiry > Date.now();

       if (isCodeValid && isCodeExpired) {
        user.verify_email = true;
        user.otp = null;
        user.otp_expiry = null;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Email verified successfully",
            error: false,
        });
       }else if (!isCodeValid) {
        return res.status(400).json({
            success: false,
            message: "Invalid OTP code",
            error: true,
        });
       } else {
        return res.status(400).json({
            success: false,
            message: "OTP code has expired",
            error: true,
        });
       }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || error,
            error: true,
        });
    }
}


export async function loginUserController(req, res) {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email: email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
                error: true,
            });
        }

        if (user.status !== "active") {
            return res.status(400).json({
                success: false,
                message: "Your account has been deactivated. Please contact support.",
                error: true,
            });
        }

        if (!user.verify_email) {
            return res.status(400).json({
                success: false,
                message: "Please verify your email before logging in",
                error: true,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
                error: true,
            });
        }

        const accessToken = await generatedAccessToken(user._id);
        const refreshToken = await generatedRefreshToken(user._id);

        const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
            last_login_date : new Date()
        })

        const cookiesOption = {
            httpOnly : true,
            secure:true,
            sameSite:"None"
        }

        res.cookie("accessToken" , accessToken , cookiesOption)
        res.cookie("refreshToken" , refreshToken , cookiesOption)

        return res.json({
            message : "Login successfully" , 
            error : false,
            success : true,
            data : {
                accessToken,
                refreshToken
            }
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message || error,
            error:true,
            success:false
        })
    }
}

export async function logoutController(req,res) {
    try {
        const userId = req.userId
        const cookiesOption = {
            httpOnly : true,
            secure:true,
            sameSite:"None"
        }
        res.clearCookie("accessToken",cookiesOption)
        res.clearCookie("refreshToken",cookiesOption)

        const removeRefreshToken = await UserModel.findByIdAndUpdate(userId , {
            refresh_token : ""
        })

        return res.json({
            message : "logout successfully",
            error:false,
            success:true
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message || error,
            error:true,
            success:false
        })
    }
}