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
import { OtpPayload } from "@/types/auth";

export const register = async (roll_no: string, email: string) => {
	const { data: user, error: userErr } = await authRepository.getUserByRoll(roll_no);
	if(userErr){
        throw new Error(userErr.message);
    }
	if(!user){
		throw new Error("User not found");
	}
    if(user.email_id){
        throw new Error("User is already registered");
    }

	const otp = generateOtp();
	const otpHash = hashOtp(otp);

    const { data: otpSession, error: otpErr } = await authRepository.setOtpStatus({
		id: user.id, 
		email: email, 
		value: otpHash, 
        type: "resgister"
	});
    if(otpErr){
        throw new Error(otpErr.message);
    }

	await sendEmail(user.full_name, email, otp);
	return {
        session_Id: otpSession.id, 
		full_name: user.full_name
	};
}

export const login = async (email: string) => {
	const { data: user, error: userErr } = await authRepository.getUserByEmail(email);
	if(userErr){
		throw new Error(userErr.message);
	}
	if(!user){
		throw new Error("User is not Resgistered");
	}

	const otp = generateOtp();
	const otpHash = hashOtp(otp);

    const { data: otpSession, error: otpErr } = await authRepository.setOtpStatus({
		id: user.id, 
        email: email, 
		value: otpHash, 
        type: "login"
	});
    if(otpErr){
        throw new Error(otpErr.message);
    }

	await sendEmail(user.full_name, email, otp);
	return {
        session_Id: otpSession.id, 
		full_name: user.full_name
	};
}

export const otpVerification = async (otp: OtpPayload) => {
    const { data: otpData, error: otpErr } = await authRepository.getOtpStatus(otp.id);
	const now = new Date();

    if(otpErr){
        throw new Error(otpErr.message);
    }
    if(!otpData){
        throw new Error("User not found");
    }
	if(otpData.otp_attempts === otpData.max_otp_attempts){
        throw new Error("OTP attempt limit exceeded");
	}
	const expiresAt = new Date(otpData.expires_at);
	if(now.getTime() >= expiresAt.getTime()){
		await authRepository.updateOtpStatus(otp.id, {
            status: "expired"
		});
        throw new Error("OTP expired");
	}

	const isValid = verifyOTP(otp.value, otpData.otp_hash);
    if(!isValid){
        await authRepository.updateOtpStatus(otp.id, {
            otp_attempts: ++otpData.otp_attempts, 
            status: "pending"
		});
        throw new Error("Invalid OTP");
    }

    await authRepository.updateOtpStatus(otp.id, {
        otp_attempts: ++otpData.otp_attempts, 
        status: "used"
	});

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

export const resendOtp = async (otp_Id: string, full_name: string) => {
    const { data: otpSession, error: otpErr } = await authRepository.getOtpStatus(otp_Id);

    if(otpErr){
        throw new Error(otpErr.message);
    }
    if(!otpSession){
        throw new Error("User not found");
    }
	if(otpSession.resend_count === otpSession.max_resend){
		await authRepository.updateOtpStatus(otpSession.id, {
            status: "expired"
		});
        throw new Error("OTP resend limit exceeded");
	}

    const otp = generateOtp();
    const otpHash = hashOtp(otp);

    await authRepository.updateOtpStatus(otp_Id, {
        otp_hash: otpHash, 
        resend_count: ++otpSession.resend_count,
		otp_attempts: 0,
		expires_at: new Date(Date.now() + 3 * 60 * 1000)
    });

	await sendEmail(full_name, otpSession.email_id, otp);
	return {
        session_Id: otpSession.id, 
		full_name: full_name
	};
}

export const changeEmail = async (otp_Id: string, email: string, full_name: string) => {
    const { data: otpSession, error: otpErr } = await authRepository.getOtpStatus(otp_Id);

    if(otpErr){
        throw new Error(otpErr.message);
    }
    if(!otpSession){
        throw new Error("User not found");
    }
    if(otpSession.change_email_count === otpSession.max_email_change){
		await authRepository.updateOtpStatus(otpSession.id, {
            status: "expired"
		});
        throw new Error("Email change limit exceeded");
    }

    const otp = generateOtp();
    const otpHash = hashOtp(otp);

    await authRepository.updateOtpStatus(otp_Id, {
        email_id: email,
        otp_hash: otpHash, 
        change_email_count: ++otpSession.change_email_count,
        otp_attempts: 0,
		resend_count: 0,
        expires_at: new Date(Date.now() + 3 * 60 * 1000)
    });

    await sendEmail(full_name, email, otp);
    return {
        session_Id: otpSession.id, 
        full_name: full_name
    };
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
