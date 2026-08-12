import { Router } from "express";
import { authController } from "../controllers/auth.controller";

export const authRouter = Router();

authRouter.post("/signup", authController.createUser);
authRouter.post("/verify-signup", authController.verifySignupOtp);
authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logout);
authRouter.post("/google", authController.googleLogin);
authRouter.post("/refresh", authController.refershToken);
authRouter.post("/forgot-password", authController.forgotPasswordVerification);
authRouter.post("/verify-forgot-password", authController.verifyForgotPasswordOtp);
authRouter.post("/reset-password", authController.forgotPasswordChange);


export default authRouter;
