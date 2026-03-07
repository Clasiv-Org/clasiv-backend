import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if(!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error("Missing Supabase credentials");
}

const supabase = createClient(
    SUPABASE_URL as string,
    SUPABASE_KEY as string
);

export const getUserByEmail = async (email: string) => {
    return await supabase
        .from("users")
        .select("*, student:students(*), teacher:teachers(*)")
        .eq("email_id", email)
        .single();
}

export const getUserByRoll = async (roll_no: string) => {
	return await supabase
		.from("users")
		.select("*, student:students!inner(roll_no)")
		.eq("students.roll_no", roll_no)
		.single();
}

export const setOtpStatus = async (id: number, email: string, otpHash: string) => {
    return await supabase
        .from("otp_verification")
        .insert({
			user_id: id,
			email_id: email,
            hashed_otp: otpHash,
		});
}

export const updateOtpStatus = async (
    email: string, 
	attempts: number,
	verified: boolean
) => {
    return await supabase
        .from("otp_verification")
        .update({ 
            attempts: attempts,
            verified: verified
		})
        .eq("email_id", email);
}

export const getOtpStatus = async (email: string) => {
    return await supabase
        .from("otp_verification")
        .select("*")
        .eq("email_id", email)
        .single();
}

export const deleteOtpStatus = async (email: string) => {
    return await supabase
        .from("otp_verification")
        .delete()
        .eq("email_id", email);
}

export const registerUser = async (roll_no: string, email: string) => {
    return await supabase.rpc("register_student_user", {
		_roll_no: roll_no,
        _email_id: email
	})
}
