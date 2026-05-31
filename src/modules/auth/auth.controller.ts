import type { 
    NextFunction,
	Request, 
	Response 
} from "express";
import * as authService from "@/modules/auth/auth.service";

/* Activation Routes, these routes manages the whole activation process/flow
* Initiate -> Sumbit New Data -> Verify Email -> Complete
*
* ROUTE: POST /auth/activation/initiate
* BODY: 
* {
*     message: string,
*     statusCode: number,
*     activationSessionId: string,
*     user: {
*         fullName: string,
*         userName: string,
*         phoneNo: string,
*         emailId: string
*     }
* }
*/
export const activationInitiate = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { activationSessionId, user } = await authService.activationInitiate(req.body);
		res.status(200).json({ 
			message: "Activation session initiated!",
			statusCode: 200,
			activationSessionId,
            user
		});
	} catch (error) {
		next(error);
	}
}

/* ROUTE: POST /auth/activation/otp
* BODY: 
* {
*     message: string,
*     statusCode: number
* }
*/
export const activationOtpSend = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await authService.activationOtpSend(req.body);
		res.status(200).json({ 
			message: "OTP sent!",
			statusCode: 200
		});
	} catch (error) {
        next(error);
	}
}

/* ROUTE: POST /auth/activation/otp/verify
* BODY: 
* {
*     message: string,
*     statusCode: number
* }
*/
export const activationOtpVerify = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await authService.activationOtpVerify(req.body);
		res.status(200).json({ 
			message: "Email verified successfully!",
            statusCode: 200
		});
	} catch (error) {
        next(error);
	}
}

/* 
* ROUTE: POST /auth/activation/otp/resend
* BODY: 
* {
*     message: string,
*     statusCode: number
* }
*/ 
export const activationOtpResend = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await authService.activationOtpResend(req.body);
		res.status(200).json({ 
			message: "OTP resent!",
            statusCode: 200
		});
	} catch (error) {
        next(error);
	}
}

/* ROUTE: POST /auth/activation/otp/change-email
* BODY: 
* {
*     message: string,
*     statusCode: number
* }
*/
export const activationOtpChangeEmail = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await authService.activationOtpChangeEmail(req.body);
		res.status(200).json({ 
			message: "OTP resent to new email!",
            statusCode: 200
		});
	} catch (error) {
        next(error);
	}
}

/* ROUTE: POST /auth/activation/complete
* BODY: 
* {
*     message: string, 
*     statusCode: number, 
*     user: <UserProfile> [REFERENCE: @/types/users]  
*     token: { accessToken: string, refreshToken: string }
* }   
*/  
export const activationComplete = async (req: Request, res: Response, next: NextFunction) => {
    try {  
        const { user, tokens } = await authService.activationComplete(req.body);
        res.status(200).json({   
            message: "Account activated successfully!", 
            statusCode: 200,
            user,  
            tokens  
        }); 
    } catch (error) {
		next(error);
    }
}

/* ROUTE: POST /auth/login
* BODY: 
* {
*     message: string, 
*     statusCode: number, 
*     user: <UserProfile> [REFERENCE: @/types/users]  
*     token: { accessToken: string, refreshToken: string }
* }   
*/  
export const login = async (req: Request, res: Response, next: NextFunction) => {
	try {  
		const { user, tokens } = await authService.login(req.body);
		res.status(200).json({   
			message: "Login successful!", 
            statusCode: 200,
			user,  
			tokens  
		}); 
	} catch (error) {
		next(error);
	}
}

/* ROUTE: POST /auth/refresh
* BODY: 
* {
*     message: string, 
*     statusCode: number, 
*     user: <UserProfile> [REFERENCE: @/types/users]  
*     token: { accessToken: string, refreshToken: string }
* }   
*/  
export const refreshTokens = async (req: Request, res: Response, next: NextFunction) => {
	try {  
		const clientType = req.headers['x-client-type'];

		const token = clientType === "mobile"
			? req.headers["x-refresh-token"] as string
            : req.cookies?.refresh_token;

		const tokenData = req.refreshToken; 
		const { user, tokens } = await authService.refreshTokens(token, tokenData!);
		res.status(200).json({  
			message: "Token refreshed successfully!", 
            statusCode: 200,
			user,  
			tokens 
		});
	} catch (error) {
		next(error);
	}
}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const clientType = req.headers['x-client-type'];

		const token = clientType === "mobile"
			? req.headers["x-refresh-token"] as string
            : req.cookies?.refresh_token;

		const tokenData = req.refreshToken;
		await authService.logout(token, tokenData!);

		if (clientType !== "mobile") {
			res.clearCookie("refresh_token");
		}

		res.status(200).json({ 
			message: "Logout successful!",
			statusCode: 200
		});
    } catch (error) {
        next(error);
    }
}
