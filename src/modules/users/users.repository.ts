import { 
	CreateUser, 
	RoleMap, 
	User 
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

export const getRoleMap = async (): Promise<RoleMap> => {
	const { data, error } = await supabase
		.from("roles")
		.select("role_id, role_name");

	if (error) {
		throw new Error(error.message);
	}

	return Object.fromEntries(
		data.map((r) => [r.role_name, r.role_id])
	);
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
	user: CreateUser
): Promise<PostgrestSingleResponse<User>> => {
	const roleMap = await getRoleMap();
	return await supabase.rpc("create_user", {
		_full_name: user.full_name,
		_base_role: roleMap[user.base_role],

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
	});
}
