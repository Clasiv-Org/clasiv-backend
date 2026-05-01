import * as userRepository from "@/modules/users/users.repository";
import * as departmentRepository from "@/modules/departments/departments.repository";
import type { 
	CreateUser, 
	UpdateUser, 
    UpdateSelf,
    BaseGetUser, 
} from "@/types/users";
import type { RoleMap } from "@/types/roles";
import type { DepartmentAbbrvMap } from "@/types/department";
import * as mapper from "@/mappers/users";

export const createUser = async (user: CreateUser) => {
	return "Route Under Construction";
}

export const getUsers = async (query: BaseGetUser) => {
	const { data: roles, error: rolesErr } = await userRepository.getRoles();
	if(rolesErr) throw new Error(rolesErr.message);

	const roleMap = roles.reduce((acc, r) => {
		acc[r.role_name as keyof RoleMap] = r.role_id;
		return acc;
	}, {} as RoleMap);

	const { data: departments, error: departmentsErr } = await departmentRepository.getDepartments();
	if(departmentsErr) throw new Error(departmentsErr.message);

    const departmentMap = departments.reduce((acc, d) => {
        acc[d.department_abbrv as keyof DepartmentAbbrvMap] = d.id;
        return acc;
    }, {} as DepartmentAbbrvMap);

    const { data: users, error: usersErr } = await userRepository.getUsers(query, roleMap, departmentMap);
    if(usersErr) throw new Error(usersErr.message);
    if(!users) throw new Error("Users not found");

    return users;
}

export const getSelf = async (id: string) => {
	const user = await userRepository.getUserProfile(id);
	if(!user) throw new Error("User not found");

    return mapper.cleanUserProfile(user);
}

export const updateSelf = async (id: string, user: UpdateSelf) => {
	const { data: updatedUser, error: userErr } = await userRepository.updateSelf(id, user);
	if(userErr) throw new Error(userErr.message);
	if(!updatedUser) throw new Error("User not found");

    return updatedUser;
}

export const getUser = async (id: string) => {
    const user = await userRepository.getUserProfile(id);
    if(!user) throw new Error("User not found");

    return mapper.cleanUserProfile(user);
}

export const updateUser = async (id: string, user: UpdateUser) => {
	return "Route Under Construction";
}

export const deleteUser = async (user_id: string) => {
	return "Route Under Construction";
}
