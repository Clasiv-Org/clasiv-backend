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

export { getUserById } from "@/db/queries/getUserById";
export { getUserByUserName } from "@/db/queries/getUserByUserName";
export { getUserByEmail } from "@/db/queries/getUserByEmail";
export { getUserByFullName } from "@/db/queries/getUserByFullName";
export { getUserProfile } from "@/db/queries/getUserProfile";

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
