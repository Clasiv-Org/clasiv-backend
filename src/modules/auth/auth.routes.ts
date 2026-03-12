import { Router } from "express";
import emailValidator from "@/middleware/email.middleware";
import rollValidator from "@/middleware/rollNo.middleware";
import otpValidator from "@/middleware/otp.middleware";
import * as userController from "@/modules/auth/auth.controller";

const router = Router();

router.post("/register", 
	emailValidator, 
	rollValidator, 
	userController.register
);
router.post("/register/verification", 
	emailValidator, 
	rollValidator, 
	otpValidator, 
	userController.registerVerification
);
router.post("/login", 
	emailValidator, 
	userController.login
);
router.post("/login/verification", 
    emailValidator, 
    otpValidator, 
    userController.loginVerification
);
router.post("/refresh", 
	userController.refreshTokens
);

export default router;
