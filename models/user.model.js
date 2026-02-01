import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [ true, "Name is required" ],
    },
    email: {
        type: String,
        required: [ true, "Email is required" ],
        unique: true,
    },
    password: {
        type: String,
        required: [ true, "Password is required" ],
    },
    avatar: {
        type: String,
        default: "",
    },
    mobile:{
        type: Number,
        default: "",
    },
    refresh_token: {
        type: String,
        default: "",
    },
    verify_email: {
        type: Boolean,
        default: false,
    },
    last_login_date: {
        type: Date,
        default: null,
    },
    status: {
        type: String,
        enum: [ "active", "inactive", "blocked" ],
        default: "active",
    },
    address_details: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "address",
    }],
    shopping_cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "cartProduct",
    }],
    orderHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
    }],
    forget_password_otp: {
        type: String,
        default: null,
    },
    forget_password_otp_expiry: {
        type: Date,
        default: null,
    },
    role: {
        type: String,
        enum: [ "USER", "ADMIN" ],
        default: "USER",
    },

}, {
    timestamps: true,
}); 

const UserModel = mongoose.model("User", userSchema);

export default UserModel;