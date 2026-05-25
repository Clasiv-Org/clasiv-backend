import { z } from "zod";

export const RefreshTokenSchema = z.object({
	id: z.string().uuid(),
	userId: z.string().uuid(),
});

export const AccessTokenSchema = z.object({
	id: z.string().uuid(),
	role: z.string(),
	extendedRoles: z.array(z.string()),
    permissions: z.array(z.string()),
});

export const ActivationInitiateSchema = z.object({
	userName: z.string().trim().toLowerCase().min(2).max(32)
		.regex(/^(?!\.)(?!.*\.\.)(?!.*\.$)(?=.*[a-zA-Z0-9])[a-zA-Z0-9_.]+$/),
    password: z.string().min(8),
}); 
export const ActivationOtpSendSchema = z.object({
	activationSessionId: z.string().uuid(),
	emailId: z.string().email().toLowerCase(),
}); 
export const ActivationOtpVerifySchema = z.object({
	activationSessionId: z.string().uuid(),
	otp: z.string().length(6),
}); 
export const ActivationOtpResendSchema = z.object({
	activationSessionId: z.string().uuid()
}); 
export const ActivationOtpChangeEmailSchema = z.object({
	activationSessionId: z.string().uuid(),
	newEmailId: z.string().email().toLowerCase(),
}); 
export const ActivationCompleteSchema = z.object({
	activationSessionId: z.string().uuid(),
	userName: z.string().trim().toLowerCase().min(2).max(32)
		.regex(/^(?!\.)(?!.*\.\.)(?!.*\.$)(?=.*[a-zA-Z0-9])[a-zA-Z0-9_.]+$/)
		.nullable().optional(),
	password: z.string().min(8),
	emailId: z.string().email().toLowerCase(),
	phoneNo: z.string().trim().length(10).regex(/^\d+$/).nullable().optional(),
}); 

export const ActivationCompleteRPCSchema = ActivationCompleteSchema.omit({ 
	activationSessionId: true,
	password: true 
}).extend({
	userId: z.string().uuid(),
    passwordHash: z.string(),
    refreshTokenId: z.string().uuid(),
	refreshTokenHash: z.string(),
});

export const UpdateActivationSessionSchema = z.object({
    status: z.enum([
		"initiated", 
		"otp_sent", 
		"otp_verified", 
		"completed", 
		"expired"
	]),
	otpSessionId: z.string().uuid(),
	updatedAt: z.string(),
	expiresAt: z.string(),
}).partial();

const LoginBaseSchema = z.object({
	userName: z.string().toLowerCase().nullable(),
	emailId: z.string().email().toLowerCase().nullable(),
	password: z.string(),
});

export const LoginSchema = LoginBaseSchema.refine(
	(data) =>
		(data.userName !== null && data.emailId === null) ||
		(data.userName === null && data.emailId !== null),
	{
		message: "Provide either userName or emailId, but not both",
	}
);

export const LoginRPCSchema = LoginBaseSchema.omit({ password: true }).extend({
	refreshTokenId: z.string().uuid(),
	refreshTokenHash: z.string(),
});

export type RefreshTokenPayload				= z.infer<typeof RefreshTokenSchema>;
export type AccessTokenPayload				= z.infer<typeof AccessTokenSchema>;

export type ActivationInitiatePayload		= z.infer<typeof ActivationInitiateSchema>;
export type ActivationOtpSendPayload		= z.infer<typeof ActivationOtpSendSchema>;
export type ActivationOtpVerifyPayload		= z.infer<typeof ActivationOtpVerifySchema>;
export type ActivationOtpResendPayload		= z.infer<typeof ActivationOtpResendSchema>;
export type ActivationOtpChangeEmailPayload	= z.infer<typeof ActivationOtpChangeEmailSchema>;
export type ActivationCompletePayload		= z.infer<typeof ActivationCompleteSchema>;
export type ActivationCompleteRPCPayload	= z.infer<typeof ActivationCompleteRPCSchema>;
export type UpdateActivationSession			= z.infer<typeof UpdateActivationSessionSchema>;

export type LoginPayload					= z.infer<typeof LoginSchema>;
export type LoginRPCPayload					= z.infer<typeof LoginRPCSchema>;
