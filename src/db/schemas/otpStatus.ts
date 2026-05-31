import { pgEnum } from "drizzle-orm/pg-core";

export const otpStatus = pgEnum(
	"otp_status", [
		'used', 
		'pending', 
		'expired'
	]
);
