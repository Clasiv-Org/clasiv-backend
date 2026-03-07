import { Request, Response } from "express";
import * as authService from "@/modules/auth/auth.service";

export const register = async (req: Request, res: Response) => {
    try {
        const { roll_no, email } = req.body;
		await authService.register(roll_no, email);
        res.status(201).json({ message: "OTP sent!"});
	} catch (error) {
        res.status(500).send("Error getting user");
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
        res.status(500).send("Error registering account!");
    }
}

export const login = async (req: Request, res: Response) => {
	try {
		const { email } = req.body;
		const token = await authService.login(email);
		res.status(201).json(token);
	} catch (error) {
		res.status(500).send("Error getting user");
	}
}
