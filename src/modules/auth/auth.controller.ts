import { Request, Response } from "express";
import * as authService from "@/modules/auth/auth.service";

export const register = async (req: Request, res: Response) => {
    try {
        const { roll_no, email } = req.body;
		const sessionId = await authService.register(roll_no, email);
        res.status(201).json({ 
			message: "OTP sent!",
			sessionId
		});
	} catch (error) {
		if(error instanceof Error)
			res.status(500).send(error.message);
    }
}

export const login = async (req: Request, res: Response) => {
	try {
		const { email } = req.body;
		const sessionId = await authService.login(email);
        res.status(201).json({ 
			message: "OTP sent!", 
			sessionId
		});
	} catch (error) {
		if(error instanceof Error)
			res.status(500).send(error.message);
	}
}

export const otpVerification = async (req: Request, res: Response) => {
    try {
        const { session_Id, email, otp, verification_type } = req.body;
        const { user, tokens } = await authService.otpVerification({
			id: session_Id, 
			email, 
			value: otp, 
			type: verification_type
		});
        res.status(201).json({ 
			message: "Account verified successfully!" ,
			user,
			tokens
		});
    } catch (error) {
		if(error instanceof Error)
			res.status(500).send(error.message);
    }
}

export const refreshTokens = async (req: Request, res: Response) => {
	try {
		const { refresh_token }  = req.body;
        const { user, tokens } = await authService.refreshTokens(refresh_token);
        res.status(201).json({
            message: "Token refreshed successfully!",
			user,
            tokens
        });
	} catch (error) {
        if(error instanceof Error)
            res.status(500).send(error.message);
	}
}
