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
import type { 
    ActivationPayload, 
    LoginPayload,
} from "@/types/auth";
import type {
    OtpVerifyPayload,
    OtpResendPayload,
    OtpChangeEmailPayload
} from "@/types/otp";

export const activate = async (activateData: ActivationPayload) => {
	const { data: user, error: userErr } = await authRepository.getUserByUserName(activateData.user_name);
	if(userErr) throw new Error(userErr.message);
	if(!user) throw new Error("User not found");
	if(user.email_id) throw new Error("User is already activated");

	return {
		full_name: user.full_name
	};
}

export const login = async (loginData: LoginPayload) => {
	const { data: user, error: userErr } =
		"user_name" in loginData
			? await authRepository.getUserByUserName(loginData.user_name)
			: await authRepository.getUserByEmail(loginData.email_id);

	if(userErr) throw new Error(userErr.message);
	if(!user) throw new Error("User not found");
	if(!user.email_id) throw new Error("User is not activated");

	const refresh_token = generateRefreshToken({ 
		id: user.id 
	});
	const access_token = generateAccessToken({
		id: user.id,
		role: user.base_role,
		extended_roles: user.extended_roles
	});

	return {
		user,
		tokens: {
			access_token,
			refresh_token
		}
	};
};

export const otpVerification = async (otpData: OtpVerifyPayload) => {
	const { data: otpSession, error: otpErr } = await authRepository.getOtpStatus(otpData.session_id);
	const now = new Date();

	if(otpErr) throw new Error(otpErr.message);
	if(!otpSession) throw new Error("User not found");
	if(otpSession.otp_attempts === otpSession.max_otp_attempts){
		await authRepository.updateOtpStatus(otpSession.id, {
			status: "expired"
		})
		throw new Error("OTP attempt limit exceeded");
	}
	const expiresAt = new Date(otpSession.expires_at);
	if(now.getTime() >= expiresAt.getTime()){
		await authRepository.updateOtpStatus(otpSession.id, {
			status: "expired"
		});
		throw new Error("OTP expired");
	}

	const isValid = verifyOTP(otpData.value, otpSession.otp_hash);
	if(!isValid){
		await authRepository.updateOtpStatus(otpSession.id, {
			otp_attempts: otpSession.otp_attempts + 1, 
		});
		throw new Error("Invalid OTP");
	}

	await authRepository.updateOtpStatus(otpSession.id, {
		otp_attempts: otpSession.otp_attempts + 1, 
		status: "used"
	});

	const actionUser = otpSession.purpose === "register"
		? authRepository.registerUser(otpSession.user_id, otpSession.email_id)
		: authRepository.loginUser(otpSession.user_id);
	const { data: user, error: userErr } = await actionUser;

	if(userErr) throw new Error(userErr.message);
	if(!user) throw new Error("User not found");
	
	const refresh_token = generateRefreshToken({ 
		id: user.id 
	});
	const access_token = generateAccessToken({
		id: user.id,
		role: user.base_role,
		extended_roles: user.extended_roles
	});

	return {
		user, 
		tokens: {
			access_token, 
			refresh_token
		}
	};
}

export const resendOtp = async (otpData: OtpResendPayload) => {
	const { data: otpSession, error: otpErr } = await authRepository.getOtpStatus(otpData.session_id);

	if(otpErr) throw new Error(otpErr.message);
	if(!otpSession) throw new Error("User not found");
	if(otpSession.resend_count === otpSession.max_resend){
		await authRepository.updateOtpStatus(otpSession.id, {
			status: "expired"
		});
		throw new Error("OTP resend limit exceeded");
	}

	const otp = generateOtp();
	const otpHash = hashOtp(otp);

	await authRepository.updateOtpStatus(otpSession.id, {
		otp_hash: otpHash, 
		resend_count: otpSession.resend_count + 1,
		otp_attempts: 0,
		updated_at: new Date(),
		expires_at: new Date(Date.now() + 3 * 60 * 1000)
	});

	await sendEmail(otpSession.users.full_name, otpSession.email_id, otp);
	return {
		session_id: otpSession.id, 
		full_name: otpSession.users.full_name
	};
}

export const changeEmail = async (otpData: OtpChangeEmailPayload) => {
	const { data: otpSession, error: otpErr } = await authRepository.getOtpStatus(otpData.session_id);

	if(otpErr) throw new Error(otpErr.message);
	if(!otpSession) throw new Error("User not found");
	if(otpSession.change_email_count === otpSession.max_email_change){
		await authRepository.updateOtpStatus(otpSession.id, {
			status: "expired"
		});
		throw new Error("Email change limit exceeded");
	}

	const otp = generateOtp();
	const otpHash = hashOtp(otp);

	await authRepository.updateOtpStatus(otpSession.id, {
		email_id: otpData.email_id,
		otp_hash: otpHash, 
		change_email_count: otpSession.change_email_count + 1,
		otp_attempts: 0,
		resend_count: 0,
		updated_at: new Date(),
		expires_at: new Date(Date.now() + 3 * 60 * 1000)
	});

	await sendEmail(otpSession.users.full_name, otpData.email_id, otp);
	return {
		session_id: otpSession.id, 
		full_name: otpSession.users.full_name
	};
}

export const refreshTokens = async (token: string) => {
	const decode = verifyRefreshToken(token);

	const { data: user, error } = await authRepository.getUserById(decode.id);
	if(error) throw new Error(error.message);
	if(!user) throw new Error("User not found");

	const refresh_token = generateRefreshToken({ 
		id: user.id 
	});
	const access_token = generateAccessToken({
		id: user.id,
		role: user.base_role,
		extended_roles: user.extended_roles
	});
	return { 
		user, 
		tokens: { 
			access_token, 
			refresh_token 
		} 
	};
}
