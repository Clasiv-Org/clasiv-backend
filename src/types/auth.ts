import z from "zod";

export const RefreshTokenSchema = z.object({
    id: z.string(),
});

export const AccessTokenSchema = z.object({
    id: z.string(),
    role: z.string(),
    extended_roles: z.array(z.string()),
});

export const OtpSessionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  email_id: z.string().email(),
  purpose: z.string(),
  otp_hash: z.string(),
  status: z.enum(["pending", "used", "expired"]).default("pending"),
  otp_attempts: z.number().int().nonnegative(),
  max_otp_attempts: z.number().int().positive().default(5),
  resend_count: z.number().int().nonnegative(),
  max_resend: z.number().int().positive().default(3),
  change_email_count: z.number().int().nonnegative(),
  max_email_change: z.number().int().positive().default(3),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  expires_at: z.coerce.date(),
  ip: z.string().nullable().optional(),
  user_agent: z.string().nullable().optional(),
});

export const UpdateOtpSessionSchema = OtpSessionSchema.omit({
	id: true,
	user_id: true,
	purpose: true,
	max_otp_attempts: true,
    max_resend: true,
    max_email_change: true,
    created_at: true,
	ip: true,
    user_agent: true
}).partial();

export const OtpPayloadSchema = z.object({
    id: z.string(),
    email: z.string(),
	value: z.string(),
	type: z.string(),
});

export type RefreshTokenPayload = z.infer<typeof RefreshTokenSchema>;
export type AccessTokenPayload = z.infer<typeof AccessTokenSchema>;
export type OtpSession = z.infer<typeof OtpSessionSchema>;
export type UpdateOtpSession = z.infer<typeof UpdateOtpSessionSchema>;
export type OtpPayload = z.infer<typeof OtpPayloadSchema>;
