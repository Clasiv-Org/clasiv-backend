import { 
	generateRefreshToken,
	verifyRefreshToken,
	generateAccessToken,
    hashToken,
    verifyTokenHash
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
import { AppError } from "@/utils/error";
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
import { handleAuthRPCError } from "@/mappers/errors";

export const activationInitiate = async (activationData: ActivationInitiatePayload) => {
	const user = await authRepository.getUserByUserName(activationData.userName);
	if(!user) throw new AppError("User not found", 404);
	if(user.activatedAt) throw new AppError("User is already activated", 409);

	if(!user.passwordHash) throw new AppError("User has no password set", 500);
	const isValidPassword = await verifyPassword(activationData.password, user.passwordHash);
    if(!isValidPassword) throw new AppError("Invalid password", 401);

    const activationSession = await authRepository.createActivationSession(user.id);
    if(!activationSession) throw new AppError("Failed to create Activation Session", 500);

	return {
        user: mapper.cleanUserBase(user),
		activationSessionId: activationSession.id
    }
}

export const activationOtpSend = async (activationData: ActivationOtpSendPayload) => {
    const activationSession = await authRepository.getActivationSession(activationData.activationSessionId);
    if(!activationSession) throw new AppError("Activation Session not found", 404);
	
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
    if(!otpSession) throw new AppError("Failed to create OTP Session", 500);

    await authRepository.updateActivationSession(activationSession.id, {
		status: "otp_sent",
        otpSessionId: otpSession.id,
    });

    await sendEmail(activationSession.userFullName, activationData.emailId, otp);
}

export const activationOtpVerify = async (activationData: ActivationOtpVerifyPayload) => {
	const activationSession = await authRepository.getActivationSession(activationData.activationSessionId);
    if(!activationSession) throw new AppError("Activation Session not found", 404);

	const data = await authRepository.getOtpSession(activationSession.otpSessionId!);
	if(!data) throw new AppError("OTP Session not found", 500);
	const { otp_sessions: otpSession } = data;
	const now = new Date();

	if(otpSession.status === "used") throw new AppError("OTP already used", 409);
	if(otpSession.status === "expired") throw new AppError("OTP expired", 410);
	if(otpSession.otpAttempts === otpSession.maxOtpAttempts){
		await authRepository.updateOtpSession(otpSession.id, {
			status: "expired"
		})
		throw new AppError("OTP attempt limit exceeded", 429);
	}
	const expiresAt = new Date(otpSession.expiresAt!);
	if(now.getTime() >= expiresAt.getTime()){
		await authRepository.updateOtpSession(otpSession.id, {
			status: "expired"
		});
		throw new AppError("OTP expired", 410);
	}

	const isValid = verifyOTP(activationData.otp, otpSession.otpHash);
	if(!isValid){
		await authRepository.updateOtpSession(otpSession.id, {
			otpAttempts: (otpSession.otpAttempts! + 1), 
		});
		throw new AppError("Invalid OTP", 401);
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
    if(!activationSession) throw new AppError("Activation Session not found", 404);

	const data = await authRepository.getOtpSession(activationSession.otpSessionId!);
	if(!data) throw new AppError("OTP Session not found", 500);
	const { otp_sessions: otpSession, users: user} = data;

	if(otpSession.status === "used") throw new AppError("OTP already used", 409);
	if(otpSession.status === "expired") throw new AppError("OTP expired", 410);
	if(otpSession.resendCount === otpSession.maxResend){
		await authRepository.updateOtpSession(otpSession.id, {
			status: "expired"
		});
		throw new AppError("OTP resend limit exceeded", 429);
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
    if(!activationSession) throw new AppError("Activation Session not found", 404);

	const data = await authRepository.getOtpSession(activationSession.otpSessionId!);
	if(!data) throw new AppError("OTP Session not found", 500);
	const { otp_sessions: otpSession, users: user}= data;

	if(otpSession.status === "used") throw new AppError("OTP already used", 409);
	if(otpSession.status === "expired") throw new AppError("OTP expired", 410);
	if(otpSession.changeEmailCount === otpSession.maxEmailChange){
		await authRepository.updateOtpSession(otpSession.id, {
			status: "expired"
		});
		throw new AppError("Email change limit exceeded", 429);
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
    if(!activationSession) throw new AppError("Activation Session not found", 404);
    if(activationSession.status !== "otp_verified") throw new AppError("Email not verified", 403);

    await authRepository.updateActivationSession(activationSession.id, {
        status: "completed"
    });

    const passwordHash = await hashPassword(activationData.password);

    const pendingToken = await authRepository.createRefreshToken(activationSession.userId, "pending");
    if(!pendingToken) throw new AppError("Failed to create refresh token", 500);

    const refreshToken = generateRefreshToken({
        id:     pendingToken.id,
        userId: activationSession.userId
    });
    const refreshTokenHash = hashToken(refreshToken);

    const { success, error, data: updatedUser } = await authRepository.setupUser({
        userId:           activationSession.userId,
        refreshTokenId:   pendingToken.id,
        emailId:          activationData.emailId,
        passwordHash:     passwordHash,
        refreshTokenHash: refreshTokenHash,
        userName:         activationData.userName ?? null,
        phoneNo:          activationData.phoneNo  ?? null,
    });
    if(!success) handleAuthRPCError(error);
    if(!updatedUser) throw new AppError("User not found", 500);

    const accessToken = generateAccessToken({
        id:            updatedUser.id,
        role:          updatedUser.baseRole,
        extendedRoles: updatedUser.extentionRoles,
        permissions:   updatedUser.permissions
    });

    return {
        user:   mapper.cleanUserProfile(updatedUser),
        tokens: { accessToken, refreshToken }
    };
}

export const login = async (loginData: LoginPayload) => {
    const user =
        loginData.userName
        ? await authRepository.getUserByUserName(loginData.userName)
        : await authRepository.getUserByEmail(loginData.emailId!);
    if(!user) throw new AppError("User not found", 404);
    if(!user.emailId) throw new AppError("User is not activated", 403);
    if(!user.passwordHash) throw new AppError("User has no password set", 500);

    const isValidPassword = await verifyPassword(loginData.password, user.passwordHash);
    if(!isValidPassword) throw new AppError("Invalid password", 401);

    const pendingToken = await authRepository.createRefreshToken(user.id, "pending");
    if(!pendingToken) throw new AppError("Failed to create refresh token", 500);

    const refreshToken = generateRefreshToken({
        id:     pendingToken.id,
        userId: user.id
    });
    const refreshTokenHash = hashToken(refreshToken);

    const { success, error, data: updatedUser } = await authRepository.loginUser({
        refreshTokenId:   pendingToken.id,
        refreshTokenHash: refreshTokenHash,
        userName:         loginData.userName  ?? null,
        emailId:          loginData.emailId   ?? null,
    });
    if(!success) handleAuthRPCError(error);
	if(!updatedUser) throw new AppError("User not found", 500);

    const accessToken = generateAccessToken({
        id:            updatedUser.id,
        role:          updatedUser.baseRole,
        extendedRoles: updatedUser.extentionRoles,
        permissions:   updatedUser.permissions
    });

    return {
        user:   mapper.cleanUserProfile(updatedUser),
        tokens: { accessToken, refreshToken }
    };
};

export const refreshTokens = async (token: string) => {
	const decode = verifyRefreshToken(token);

	const user = await authRepository.getUserProfile(decode.id);
	if(!user) throw new AppError("User not found", 404);

	const refreshTokenSession = await authRepository.getRefreshToken(user.id);
    if(!refreshTokenSession) throw new AppError("Refresh token session not found", 404);
	const isValidToken = verifyTokenHash(token, refreshTokenSession.tokenHash);
    if(!isValidToken) throw new AppError("Invalid refresh token", 401);

	const refreshToken = generateRefreshToken({ 
		id: user.id 
	});
    const refreshTokenHash = hashToken(refreshToken);

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
