import { Router } from "express";
import validator from "@/middleware/global.validator";
import * as authController from "@/modules/auth/auth.controller";
import { 
	LoginSchema, 
	OtpChangeEmailSchema, 
	OtpResendSchema, 
	OtpVerifySchema, 
	RegisterSchema 
} from "@/types/auth";

const router = Router();

router.post("/register", 
	validator(RegisterSchema),
	authController.register
);
router.post("/login", 
    validator(LoginSchema),
	authController.login
);
router.post("/otp/verification", 
    validator(OtpVerifySchema),
	authController.otpVerification
);
router.post("/otp/resend",
    validator(OtpResendSchema),
	authController.resendOtp
);
router.post("/otp/change-email",
    validator(OtpChangeEmailSchema),
	authController.changeEmail
);
router.post("/refresh", 
	authController.refreshTokens
);

export default router;
