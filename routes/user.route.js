import { Router } from "express";
import { registerUserController,verifyEmailController,loginUserController,logoutController } from "../controllers/user.controller.js";
import auth from "../middlewares/auth.js";

const userRouter = Router();

userRouter.post("/register", registerUserController);
userRouter.post("/verify-email", verifyEmailController);
userRouter.post("/login", loginUserController);
userRouter.post("/logout",auth, logoutController);


export default userRouter;