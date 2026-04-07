import type { 
	OtpSession, 
	OtpSessionWithUser, 
	CreateOtpSession, 
	UpdateOtpSession, 
} from "@/types/otp";
import { UpdateOtpSessionSchema } from "@/types/otp";
import type { 
	User 
} from "@/types/users";
import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import { supabase } from "@/config/supabase";

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

export const setOtpStatus = async (
	otp: CreateOtpSession
): Promise<PostgrestSingleResponse<OtpSession>> => {
    return await supabase
        .from("otp_sessions")
        .insert({
			user_id: otp.user_id,
			email_id: otp.email_id,
            otp_hash: otp.value,
			purpose: otp.type
		})
		.select()
		.single();
}

export const updateOtpStatus = async (
	session_id: string,
	updates: UpdateOtpSession
): Promise<PostgrestSingleResponse<OtpSession>> => {
    const parsedUpdates = UpdateOtpSessionSchema.parse(updates);
    return await supabase
        .from("otp_sessions")
        .update({
			...parsedUpdates,
            updated_at: new Date(),
		})
        .eq("id", session_id)
		.select()
		.single();
}

export const getOtpStatus = async (
	session_id: string
): Promise<PostgrestSingleResponse<OtpSessionWithUser>> => {
    return await supabase
        .from("otp_sessions")
        .select("*, users!inner(full_name)")
        .eq("id", session_id)
        .single();
}

export const deleteOtpStatus = async (session_id: string) => {
    return await supabase
        .from("otp_sessions")
        .delete()
        .eq("id", session_id);
}

export const registerUser = async (
	user_id: string, 
	email: string
): Promise<PostgrestSingleResponse<User>> => {
    return await supabase.rpc("register_user", {
		_user_id: user_id,
        _email_id: email
	}).single();
}

export const loginUser = async (
	user_id: string
): Promise<PostgrestSingleResponse<User>> => {
    return await supabase.rpc("login_user", {
		_user_id: user_id,
    }).single();
}
