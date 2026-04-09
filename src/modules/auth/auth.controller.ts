import type { 
	Request, 
	Response 
} from "express";
import * as authService from "@/modules/auth/auth.service";

export const activate = async (req: Request, res: Response) => {
	try {
		const { full_name } = await authService.activate(req.body);
		res.status(200).json({ 
			message: "Account found!",
			full_name
		});
	} catch (error) {
		if (error instanceof Error) {
			return res.status(400).json({ message: error.message });
		}
		return res.status(500).json({ message: "Unknown error" });
	}
}

export const login = async (req: Request, res: Response) => {
	try {
		const { tokens, user } = await authService.login(req.body);
		res.status(200).json({ 
			message: "Login successful!", 
			tokens,
			user
		});
	} catch (error) {
		if (error instanceof Error) {
			return res.status(400).json({ message: error.message });
		}
		return res.status(500).json({ message: "Unknown error" });
	}
}

export const otpVerification = async (req: Request, res: Response) => {
	try {
		const { user, tokens } = await authService.otpVerification(req.body);
		res.status(200).json({ 
			message: "Account verified successfully!" ,
			user,
			tokens
		});
	} catch (error) {
		if (error instanceof Error) {
			return res.status(400).json({ message: error.message });
		}
		return res.status(500).json({ message: "Unknown error" });
	}
}

export const resendOtp = async (req: Request, res: Response) => {
	try {
		const otpData = req.body;
		const { 
			session_id, 
			full_name: user 
		} = await authService.resendOtp(otpData);
		res.status(200).json({ 
			message: "OTP sent!",
			session_id,
			user
		});
	} catch (error) {
		if (error instanceof Error) {
			return res.status(400).json({ message: error.message });
		}
		return res.status(500).json({ message: "Unknown error" });
	}
}

export const changeEmail = async (req: Request, res: Response) => {
	try {
		const otpData = req.body;
		const { 
			session_id,
			full_name: user
		} = await authService.changeEmail(otpData);
		res.status(200).json({ 
			message: "OTP sent!",
			session_id, 
			user
		});
	} catch (error) {
		if (error instanceof Error) {
			return res.status(400).json({ message: error.message });
		}
		return res.status(500).json({ message: "Unknown error" });
	}
}

export const refreshTokens = async (req: Request, res: Response) => {
	try {
		const { token }  = req.body;
		const { user, tokens } = await authService.refreshTokens(token);
		res.status(200).json({
			message: "Token refreshed successfully!",
			user,
			tokens
		});
	} catch (error) {
		if (error instanceof Error) {
			return res.status(400).json({ message: error.message });
		}
		return res.status(500).json({ message: "Unknown error" });
	}
}
