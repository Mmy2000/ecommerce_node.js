import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    orderId:{
        type: String,
        required: [ true, "Order ID is required" ],
        unique: true,
    },
    productId: {
        type:  mongoose.Schema.Types.ObjectId ,
        ref: "product",
    },
    product_details: {
        name: String,
        image: Array,
    },
    payment_id: {
        type: String,
        default: "",
    },
    payment_status: {
        type: String,
        default: "",
    },
    delivery_address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "address",
    },
    subTotalAmt: {
        type: Number,
        default: 0,
    },
    totalAmt: {
        type: Number,
        default: 0,
    },
    invoice_receipt: {
        type: String,
        default: "",
    }
}, {
    timestamps: true,
});

export const OrderModel = mongoose.model("order", orderSchema);
export default OrderModel;
