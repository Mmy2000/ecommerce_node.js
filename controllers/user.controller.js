
import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import VerificationEmail from "../helpers/verifyEmailTemplate.js";
import sendEmailFun from "../config/sendEmail.js";


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