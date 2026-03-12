import z from "zod";

export const RefreshTokenSchema = z.object({
    id: z.string(),
});

export type RefreshTokenPayload = z.infer<typeof RefreshTokenSchema>;

export const AccessTokenSchema = z.object({
    id: z.string(),
    role: z.string(),
    extended_roles: z.array(z.string()),
});

export type AccessTokenPayload = z.infer<typeof AccessTokenSchema>;

export const EmailOtpSchema = z.object({
    id: z.string(),
    created_at: z.date(),
    user_id: z.string(),
    email_id: z.string(),
    hashed_otp: z.string(),
    verified: z.boolean(),
    attempts: z.number(),
    expires_at: z.date(),
});

export type EmailOtp = z.infer<typeof EmailOtpSchema>;
