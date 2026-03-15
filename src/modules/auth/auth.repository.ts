import { 
	User 
} from "@/types/users";
import { 
	createClient, 
	PostgrestSingleResponse 
} from "@supabase/supabase-js";
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

export const getUserById = async (id: string): Promise<PostgrestSingleResponse<User>> => {
    return await supabase.rpc("get_user_by_id", {
		_user_id: id
	}).single();
}

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
        .from("otp_sessions")
        .insert({
			user_id: id,
			email_id: email,
            otp_hash: otpHash,
		})
		.select()
		.single();
}

export const updateOtpStatus = async (otp_id: string, attempts: number, status: string) => {
    return await supabase
        .from("otp_sessions")
        .update({ 
            otp_attempts: attempts,
            status: status
		})
        .eq("id", otp_id);
}

export const getOtpStatus = async (otp_id: string) => {
    return await supabase
        .from("otp_sessions")
        .select("*")
        .eq("id", otp_id)
        .single();
}

export const deleteOtpStatus = async (otp_id: string) => {
    return await supabase
        .from("otp_sessions")
        .delete()
        .eq("id", otp_id);
}

export const registerUser = async (user_id: string, email: string): Promise<PostgrestSingleResponse<User>> => {
    return await supabase.rpc("register_student_user", {
		_user_id: user_id,
        _email_id: email
	}).single();
}

export const loginUser = async (user_id: string): Promise<PostgrestSingleResponse<User>> => {
    return await supabase.rpc("login_user", {
		_user_id: user_id,
    }).single();
}
