import { 
	generateRefreshToken,
	verifyRefreshToken,
	generateAccessToken,
    hashToken,
    verifyToken
} from "@/utils/token";
import * as authRepository from "@/modules/auth/auth.repository";
import { 
	generateOtp, 
	hashOtp, 
	verifyOTP 
} from "@/utils/otp";
import { 
	hashPassword, 
	verifyPassword 
} from "@/utils/password";
import { sendEmail } from "@/utils/email";
import * as mapper from "@/mappers/users";
import type { 
    ActivationInitiatePayload,
	ActivationOtpSendPayload,
    ActivationOtpChangeEmailPayload,
    ActivationOtpResendPayload,
    ActivationOtpVerifyPayload,
    ActivationCompletePayload,
    LoginPayload,
} from "@/types/auth";

export const activationInitiate = async (activationData: ActivationInitiatePayload) => {
	const user = await authRepository.getUserByUserName(activationData.userName);
	if(!user) throw new Error("User not found");
	if(user.activatedAt) throw new Error("User is already activated");

	if(!user.passwordHash) throw new Error("User has no password set");
	const isValidPassword = await verifyPassword(activationData.password, user.passwordHash);
    if(!isValidPassword) throw new Error("Invalid password");

    const activationSession = await authRepository.createActivationSession(user.id);
    if(!activationSession) throw new Error("Failed to create Activation Session");

	return {
        user: mapper.cleanUserBase(user),
		activationSessionId: activationSession.id
    }
}

export const activationOtpSend = async (activationData: ActivationOtpSendPayload) => {
    const activationSession = await authRepository.getActivationSession(activationData.activationSessionId);
    if(!activationSession) throw new Error("Activation Session not found");
	
    const otp = generateOtp();
    const otpHash = hashOtp(otp);

    const otpSession = await authRepository.createOtpSession({
        userId: activationSession.userId,
        emailId: activationData.emailId,
        purpose: "email_verification",
        otpHash: otpHash,
        ip: null,
        userAgent: null
    });
    if(!otpSession) throw new Error("Failed to create OTP Session");

    await authRepository.updateActivationSession(activationSession.id, {
		status: "otp_sent",
        otpSessionId: otpSession.id,
    });

    await sendEmail(activationSession.userFullName, activationData.emailId, otp);
}

export const activationOtpVerify = async (activationData: ActivationOtpVerifyPayload) => {
	const activationSession = await authRepository.getActivationSession(activationData.activationSessionId);
    if(!activationSession) throw new Error("Activation Session not found");

	const data = await authRepository.getOtpSession(activationSession.otpSessionId!);
	if(!data) throw new Error("OTP Session not found");
	const { otp_sessions: otpSession } = data;
	const now = new Date();

	if(otpSession.status === "used") throw new Error("OTP already sent");
	if(otpSession.status === "expired") throw new Error("OTP expired");
	if(otpSession.otpAttempts === otpSession.maxOtpAttempts){
		await authRepository.updateOtpSession(otpSession.id, {
			status: "expired"
		})
		throw new Error("OTP attempt limit exceeded");
	}
	const expiresAt = new Date(otpSession.expiresAt!);
	if(now.getTime() >= expiresAt.getTime()){
		await authRepository.updateOtpSession(otpSession.id, {
			status: "expired"
		});
		throw new Error("OTP expired");
	}

	const isValid = verifyOTP(activationData.otp, otpSession.otpHash);
	if(!isValid){
		await authRepository.updateOtpSession(otpSession.id, {
			otpAttempts: (otpSession.otpAttempts! + 1), 
		});
		throw new Error("Invalid OTP");
	}

	await authRepository.updateOtpSession(otpSession.id, {
		otpAttempts: (otpSession.otpAttempts! + 1), 
		status: "used"
	});

    await authRepository.updateActivationSession(activationSession.id, {
        status: "otp_verified",
    });
}

export const activationOtpResend = async (activationData: ActivationOtpResendPayload) => {
	const activationSession = await authRepository.getActivationSession(activationData.activationSessionId);
    if(!activationSession) throw new Error("Activation Session not found");

	const data = await authRepository.getOtpSession(activationSession.otpSessionId!);
	if(!data) throw new Error("OTP Session not found");
	const { otp_sessions: otpSession, users: user} = data;

	if(otpSession.status === "used") throw new Error("OTP already sent");
	if(otpSession.status === "expired") throw new Error("OTP expired");
	if(otpSession.resendCount === otpSession.maxResend){
		await authRepository.updateOtpSession(otpSession.id, {
			status: "expired"
		});
		throw new Error("OTP resend limit exceeded");
	}

	const otp = generateOtp();
	const otpHash = hashOtp(otp);

	await authRepository.updateOtpSession(otpSession.id, {
		otpHash: otpHash, 
		resendCount: (otpSession.resendCount! + 1),
		otpAttempts: 0,
		expiresAt: new Date(Date.now() + 3 * 60 * 1000).toISOString()
	});

	await sendEmail(user.fullName, otpSession.emailId, otp);
	return {
		sessionId: otpSession.id, 
		fullName: user.fullName
	};
}

export const activationOtpChangeEmail = async (activationData: ActivationOtpChangeEmailPayload) => {
	const activationSession = await authRepository.getActivationSession(activationData.activationSessionId);
    if(!activationSession) throw new Error("Activation Session not found");

	const data = await authRepository.getOtpSession(activationSession.otpSessionId!);
	if(!data) throw new Error("OTP Session not found");
	const { otp_sessions: otpSession, users: user}= data;

	if(otpSession.status === "used") throw new Error("OTP already sent");
	if(otpSession.status === "expired") throw new Error("OTP expired");
	if(otpSession.changeEmailCount === otpSession.maxEmailChange){
		await authRepository.updateOtpSession(otpSession.id, {
			status: "expired"
		});
		throw new Error("Email change limit exceeded");
	}

	const otp = generateOtp();
	const otpHash = hashOtp(otp);

	await authRepository.updateOtpSession(otpSession.id, {
		emailId: activationData.newEmailId,
		otpHash: otpHash, 
		changeEmailCount: (otpSession.changeEmailCount! + 1),
		otpAttempts: 0,
		resendCount: 0,
		updatedAt: new Date().toISOString(),
		expiresAt: new Date(Date.now() + 3 * 60 * 1000).toISOString()
	});

	await sendEmail(user.fullName, activationData.newEmailId, otp);
	return {
		sessionId: otpSession.id, 
		fullName: user.fullName
	};
}

export const activationComplete = async (activationData: ActivationCompletePayload) => {
	const activationSession = await authRepository.getActivationSession(activationData.activationSessionId);
    if(!activationSession) throw new Error("Activation Session not found");
    if(activationSession.status !== "otp_verified") throw new Error("Email not verified");

	await authRepository.updateActivationSession(activationSession.id, {
        status: "completed"    	
	});

	const passwordHash = await hashPassword(activationData.password);
	const refreshToken = generateRefreshToken({ 
		id: activationSession.userId
	});
	const refreshTokenHash = await hashToken(refreshToken);

	const user = await authRepository.setupUser({
		userId: activationSession.userId,
        emailId: activationData.emailId,
        passwordHash: passwordHash,
        userName: activationData.userName,
        phoneNo: activationData.phoneNo,
		refreshTokenHash: refreshTokenHash
	});
    if(!user) throw new Error("User not found");

	const accessToken = generateAccessToken({
		id: user.id,
		role: user.baseRole,
		extendedRoles: user.extentionRoles,
		permissions: user.permissions
	});

	return {
		user: mapper.cleanUserProfile(user), 
        tokens: {
            accessToken,
            refreshToken
        }
    };
}

export const login = async (loginData: LoginPayload) => {
	const user =
		loginData.userName
		? await authRepository.getUserByUserName(loginData.userName)
		: await authRepository.getUserByEmail(loginData.emailId!);

	if(!user) throw new Error("User not found");
	if(!user.emailId) throw new Error("User is not activated");

	
	if(!user.passwordHash) throw new Error("User has no password set");
	const isValidPassword = await verifyPassword(loginData.password, user.passwordHash);
    if(!isValidPassword) throw new Error("Invalid password");

	const refreshToken = generateRefreshToken({ 
		id: user.id 
	});
    const refreshTokenHash = await hashToken(refreshToken);

	const updatedUser = await authRepository.loginUser({
        userName: loginData.userName ?? null,
        emailId: loginData.emailId ?? null,
        refreshTokenHash: refreshTokenHash
	});

	const accessToken = generateAccessToken({
		id: updatedUser.id,
		role: updatedUser.baseRole,
		extendedRoles: updatedUser.extentionRoles,
		permissions: updatedUser.permissions
	});

	return {
		user: mapper.cleanUserProfile(updatedUser),
		tokens: {
			accessToken,
			refreshToken
		}
	};
};

export const refreshTokens = async (token: string) => {
	const decode = verifyRefreshToken(token);

	const user = await authRepository.getUserProfile(decode.id);
	if(!user) throw new Error("User not found");

	const refreshTokenSession = await authRepository.getRefreshToken(user.id);
    if(!refreshTokenSession) throw new Error("Refresh token session not found");
	const isValidToken = await verifyToken(token, refreshTokenSession.tokenHash);
    if(!isValidToken) throw new Error("Invalid refresh token");

	const refreshToken = generateRefreshToken({ 
		id: user.id 
	});
    const refreshTokenHash = await hashToken(refreshToken);

	await authRepository.updateRefreshToken(
		user.id, 
		refreshTokenHash
	);

	const accessToken = generateAccessToken({
		id: user.id,
		role: user.baseRole,
		extendedRoles: user.extentionRoles,
		permissions: user.permissions
	});

	return {
		user: mapper.cleanUserProfile(user),
		tokens: {
			accessToken,
			refreshToken
		}
	};
}
