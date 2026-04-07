import type { 
	User, 
	CreateUser, 
	UpdateUser, 
    UpdateSelf,
    BaseGetUser, 
} from "@/types/users";
import type {
    Role,
    RoleMap
} from "@/types/roles";
import type { DepartmentAbbrvMap } from "@/types/department";
import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import { supabase } from "@/config/supabase";

export const getRoles = async (): Promise<PostgrestSingleResponse<Role[]>> => {
	return await supabase
		.from("roles")
		.select("role_id, role_name")
}

export const getUsers = async (
	query: BaseGetUser,
	roleMap: RoleMap,
	departmentMap: DepartmentAbbrvMap
): Promise<PostgrestSingleResponse<User[]>> => {
    const offset = (query.page - 1) * query.limit;
	return await supabase.rpc("get_users", {
		_limit: query.limit,
		_offset: offset,
		_role_id: query.base_role 
			? roleMap[query.base_role]
            : null,
        _department_id: query.department 
			? departmentMap[query.department]
			: null

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

export const getUserById = async (
	id: string
): Promise<PostgrestSingleResponse<User>> => {
	return await supabase.rpc("get_user_by_id", {
		_user_id: id
	}).single();
}

export const updateSelf = async (
	id: string, 
	user: UpdateSelf
): Promise<PostgrestSingleResponse<User>> => {
    return await supabase.rpc("update_user_self", {
        _user_id: id,
        _email_id: user.email_id ?? null,
        _phone_no: user.phone_no ?? null,
		_dob: user.dob ?? null,
    }).single();
}

export const updateUser = async (
	id: string,
    user: UpdateUser,
    roleMap: RoleMap,
): Promise<PostgrestSingleResponse<User>> => {
    return await supabase.rpc("update_user", {
        _user_id: id,
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

export const deleteUser = async (user_id: string) => {
    return await supabase.from("users")
		.delete()
		.eq("id", user_id)
		.single();
}
