import { BrevoClient }  from "@getbrevo/brevo";

const BREVO_API_KEY = process.env.BREVO_API_KEY as string;
const CLASIV_EMAIL  = process.env.CLASIV_EMAIL as string;
const OTP_EXPIRY_TIME = process.env.OTP_EXPIRY_TIME as string;
const YEAR = new Date().getFullYear();

if (!BREVO_API_KEY) throw new Error("BREVO_API_KEY is not defined");
if (!CLASIV_EMAIL)  throw new Error("BREVO_API_KEY is not defined");

export const brevo = new BrevoClient({
    apiKey: BREVO_API_KEY
});

export const clasivEmail = CLASIV_EMAIL;
export const otpExpiryTime = Number(OTP_EXPIRY_TIME);
export const year = YEAR;
