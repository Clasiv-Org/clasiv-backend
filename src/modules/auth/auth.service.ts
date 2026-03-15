import { 
	generateRefreshToken,
	verifyRefreshToken,
	generateAccessToken
} from "@/utils/token";
import * as authRepository from "@/modules/auth/auth.repository";
import { 
	generateOtp, 
	hashOtp, 
	verifyOTP 
} from "@/utils/otp";
import { sendEmail } from "@/utils/email";
import { Otp } from "@/types/auth";

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

    const { data: otpData } = await authRepository.setOtpStatus(
		user.id, 
		email, 
		otpHash, 
	);

	await sendEmail(user.full_name, email, otp);
	return otpData.id;
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

    const { data: otpData } = await authRepository.setOtpStatus(
		user.id, 
		email, 
		otpHash, 
	);

	await sendEmail(user.full_name, email, otp);
	return otpData.id;
}

export const otpVerification = async (otp: Otp) => {
    const { data: otpData, error: otpErr } = await authRepository.getOtpStatus(otp.id);
	const now = new Date();
	const expiresAt = new Date(otpData.expires_at);

    if(otpErr){
        throw new Error(otpErr.message);
    }
    if(!otpData){
        throw new Error("User not found");
    }
	if(otpData.otp_attempts === otpData.max_otp_attempts){
        throw new Error("OTP attempt limit exceeded");
	}
	if(now.getTime() >= expiresAt.getTime()){
		await authRepository.updateOtpStatus(otp.id, otpData.otp_attempts, "expired");
        throw new Error("OTP expired");
	}

	const isValid = verifyOTP(otp.value, otpData.otp_hash);
    if(!isValid){
        await authRepository.updateOtpStatus(otp.id, ++otpData.otp_attempts, "pending");
        throw new Error("Invalid OTP");
    }

    await authRepository.updateOtpStatus(otp.id, ++otpData.otp_attempts, "used");

	const actionUser = otp.type === "register"
		? authRepository.registerUser(otpData.id, otp.email)
		: authRepository.loginUser(otpData.id);
	const { data: user, error: userErr } = await actionUser;

    if(userErr){
        throw new Error(userErr.message);
    }
    if(!user){
        throw new Error("User not found");
    }

	const refreshToken = generateRefreshToken({ 
		id: user.id 
	});
	const accessToken = generateAccessToken({
		id: user.id,
		role: user.base_role,
		extended_roles: user.extended_roles
	});

    return {user, tokens: {accessToken, refreshToken}};
}

export const refreshTokens = async (refresh_token: string) => {
	const decode = verifyRefreshToken(refresh_token);

    const { data: user, error } = await authRepository.getUserById(decode.id);
    if(error){
        throw new Error(error.message);
    }
    if(!user){
        throw new Error("User not found");
    }

	const refreshToken = generateRefreshToken({ 
		id: user.id 
	});
	const accessToken = generateAccessToken({
		id: user.id,
		role: user.base_role,
		extended_roles: user.extended_roles
	});
    return { user, tokens: { accessToken, refreshToken } };
}
