import { Request, Response } from "express";
import * as authService from "@/modules/auth/auth.service";

export const register = async (req: Request, res: Response) => {
    try {
        const { roll_no, email } = req.body;
		await authService.register(roll_no, email);
        res.status(201).json({ message: "OTP sent!"});
	} catch (error) {
		if(error instanceof Error)
			res.status(500).send(error.message);
    }
}

export const registerVerification = async (req: Request, res: Response) => {
    try {
        const { roll_no, email, otp } = req.body;
        const { user, token } = await authService.registerVerification(roll_no, email, otp);
        res.status(201).json({ 
			message: "Account registered successfully!" ,
			user,
			token
		});
    } catch (error) {
		if(error instanceof Error)
			res.status(500).send(error.message);
    }
}

export const login = async (req: Request, res: Response) => {
	try {
		const { email } = req.body;
		await authService.login(email);
        res.status(201).json({ message: "OTP sent!"});
	} catch (error) {
		if(error instanceof Error)
			res.status(500).send(error.message);
	}
}

export const loginVerification = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;
        const { user, token } = await authService.loginVerification(email, otp);
        res.status(201).json({ 
			message: "Logged in successfully!" ,
			user,
			token
		});
    } catch (error) {
		if(error instanceof Error)
			res.status(500).send(error.message);
    }
}
