import { Router } from "express";
import emailValidator from "@/middleware/email.middleware";
import rollValidator from "@/middleware/rollNo.middleware";
import otpValidator from "@/middleware/otp.middleware";
import * as authController from "@/modules/auth/auth.controller";
import verificationValidator from "@/middleware/verification.middleware";

const router = Router();

router.post("/register", 
	emailValidator, 
	rollValidator, 
	authController.register
);
router.post("/login", 
	emailValidator, 
	authController.login
);
router.post("/otp/verification", 
	verificationValidator, 
	emailValidator, 
	otpValidator, 
	authController.otpVerification
);
router.post("/refresh", 
	authController.refreshTokens
);

export default router;
