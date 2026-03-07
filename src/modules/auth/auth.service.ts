import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import * as authRepository from "@/modules/auth/auth.repository";
import { generateOtp, hashOtp, isOtpExpired, setOtpExpiry, verifyOTP } from "@/utils/otp";
import { sendEmail } from "@/utils/email";

dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

if(!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET){
    throw new Error("Missing JWT credentials");
}

export const register = async (roll_no: string, email: string) => {
	const { data: user, error } = await authRepository.getUserByRoll(roll_no);
	if(error){
        throw new Error("Error getting user");
    }
	if(!user){
		throw new Error("User not found");
	}
    if(user.email_id){
        throw new Error("User is already registered");
    }

	const otp = generateOtp();
	const otpHash = hashOtp(otp);

    await authRepository.setOtpStatus(
		user.id, 
		email, 
		otpHash, 
	);

	await sendEmail(user.full_name, email, otp);
	return;
}

export const registerVerification = async (roll_no: string, email: string, otp: string) => {
    const { data: otpData, error: otpErr } = await authRepository.getOtpStatus(email);
    if(otpErr){
        throw new Error(otpErr.message);
    }
    if(!otpData){
        throw new Error("User not found");
    }
	if(otpData.otp_attempts > otpData.max_otp_attempts){
        throw new Error("OTP limit exceeded");
	}
	if(otpData.created_at < otpData.expires_at){
        throw new Error("OTP expired");
	}

	const isValid = verifyOTP(otp, otpData.hashed_otp);
    if(!isValid){
        await authRepository.updateOtpStatus(email, ++otpData.attempts, false);
        throw new Error("Invalid OTP");
    }

    await authRepository.updateOtpStatus(email, ++otpData.attempts, true);
	const { data: user, error: userError } = await authRepository.registerUser(roll_no, email);
    if(userError){
        throw new Error(userError.message);
    }
    if(!user){
        throw new Error("User not found");
    }
	await authRepository.deleteOtpStatus(email);
	const refreshToken = jwt.sign(
		{
            id: user.id,
            base_role: user.base_role
		},
		REFRESH_TOKEN_SECRET,
		{expiresIn: "30d"}
	);
	const accessToken = jwt.sign(
		{
            id: user.id,
			role: user.base_role,
			role_extentions: [user.base_role]
		},
		ACCESS_TOKEN_SECRET,
		{expiresIn: "30m"}
	);

    return { user, token: { accessToken, refreshToken } };
}

export const login = async (email: string) => {
	const { data: user, error } = await authRepository.getUserByEmail(email);
	if(error){
		throw new Error(error.message);
	}
	if(!user){
		throw new Error("User is not Resgistered");
	}

	const otp = generateOtp();
	const otpHash = hashOtp(otp);

    await authRepository.setOtpStatus(
		user.id, 
		email, 
		otpHash, 
	);

	await sendEmail(user.full_name, email, otp);
	return;
}
