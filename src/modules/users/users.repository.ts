import { 
	User, 
	CreateUser, 
	UpdateUser, 
	DeleteUser, 
	Role, 
	RoleMap, 
} from "@/types/users";
import { 
	createClient, 
	PostgrestSingleResponse 
} from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL as string;
const SUPABASE_KEY = process.env.SUPABASE_KEY as string;

if(!SUPABASE_URL || !SUPABASE_KEY) {
	throw new Error("Missing Supabase credentials");
}

const supabase = createClient(
	SUPABASE_URL,
	SUPABASE_KEY
);

export const getRoles = async (): Promise<PostgrestSingleResponse<Role[]>> => {
	return await supabase
		.from("roles")
		.select("role_id, role_name")
}

export const getUserById = async (
	id: string
): Promise<PostgrestSingleResponse<User>> => {
	return await supabase.rpc("get_user_by_id", {
		_user_id: id
	}).single();
}

export const getUsers = async (
	limit: number, 
	offset: number
): Promise<PostgrestSingleResponse<User[]>> => {
	return await supabase.rpc("get_users_paginated", {
		_limit: limit,
		_offset: offset
	});
}

export const createUser = async (
	user: CreateUser,
	roleMap: RoleMap,
): Promise<PostgrestSingleResponse<User>> => {
	return await supabase.rpc("create_user", {
		_full_name: user.full_name,
		_base_role: user.base_role 
			? roleMap[user.base_role]
            : null,

		_extended_roles: user.extended_roles
			? user.extended_roles.map((r) => roleMap[r])
			: null,
		_email_id: user.email_id ?? null,
		_phone_no: user.phone_no ?? null,

		_roll_no: user.base_role === "student" ? user.roll_no : null,
		_reg_no: user.base_role === "student" ? user.reg_no : null,
		_semester_id: user.base_role === "student" ? user.semester : null,
		_dob: user.base_role === "student" ? user.dob : null,
		_department_id: user.department_id ?? null,

		_teacher_abbrv: user.base_role === "teacher" ? user.teacher_abbrv : null,
	}).single();
}

export const updateUser = async (
    user: UpdateUser,
    roleMap: RoleMap,
): Promise<PostgrestSingleResponse<User>> => {
    return await supabase.rpc("update_user", {
        _user_id: user.id,
        _full_name: user.full_name,
        _base_role: user.base_role
			? roleMap[user.base_role]
            : null,
        _extended_roles: user.extended_roles
            ? user.extended_roles.map((r) => roleMap[r]).filter((r) => r !== null)
            : null,
        _email_id: user.email_id ?? null,
        _phone_no: user.phone_no ?? null,

        _roll_no: user.base_role === "student" ? user.roll_no : null,
        _reg_no: user.base_role === "student" ? user.reg_no : null,
        _semester_id: user.base_role === "student" ? user.semester : null,
        _dob: user.base_role === "student" ? user.dob : null,
        _department_id: user.department_id ?? null,
        
		_teacher_abbrv: user.base_role === "teacher" ? user.teacher_abbrv : null,
    }).single();
}

export const deleteUser = async (user: DeleteUser) => {
    return await supabase.from("users")
		.delete()
		.eq("id", user.id)
		.single();
}
