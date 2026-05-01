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

export const createUser = async (user: CreateUser) => {
	const { data: roles, error: rolesErr } = await userRepository.getRoles();
	if(rolesErr) throw new Error(rolesErr.message);

	const roleMap = roles.reduce((acc, r) => {
		acc[r.role_name as keyof RoleMap] = r.role_id;
		return acc;
	}, {} as RoleMap);

    const { data: createdUser, error: userErr } = await userRepository.createUser(user, roleMap);
    if(userErr) throw new Error(userErr.message);
    if(!createdUser) throw new Error("User not created");

    return createdUser;
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

    return user;
}

export const updateSelf = async (id: string, user: UpdateSelf) => {
	const { data: updatedUser, error: userErr } = await userRepository.updateSelf(id, user);
	if(userErr) throw new Error(userErr.message);
	if(!updatedUser) throw new Error("User not found");

    return updatedUser;
}

export const getUser = async (id: string) => {
    const { data: user, error: userErr } = await userRepository.getUserById(id);
    if(userErr) throw new Error(userErr.message);
    if(!user) throw new Error("User not found");

    return user;
}

export const updateUser = async (id: string, user: UpdateUser) => {
	const { data: roles, error: rolesErr } = await userRepository.getRoles();
	if(rolesErr) throw new Error(rolesErr.message);

	const roleMap = roles.reduce((acc, r) => {
		acc[r.role_name as keyof RoleMap] = r.role_id;
		return acc;
	}, {} as RoleMap);

    const { data: updatedUser, error: userErr } = await userRepository.updateUser(id, user, roleMap);
    if(userErr) throw new Error(userErr.message);
    if(!updatedUser) throw new Error("User not found");

    return updatedUser;
}

export const deleteUser = async (user_id: string) => {
    const { error: userErr } = await userRepository.deleteUser(user_id);
    if(userErr) throw new Error(userErr.message);
}
