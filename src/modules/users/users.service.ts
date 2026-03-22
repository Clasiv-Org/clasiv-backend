import * as userRepository from "@/modules/users/users.repository";
import { 
	CreateUser, 
	UpdateUser, 
    DeleteUser,
	RoleMap,
    UpdateSelf, 
} from "@/types/users";

export const createUser = async (user: CreateUser) => {
	const { data: roles, error: rolesErr } = await userRepository.getRoles();
	if(rolesErr){
		throw new Error(rolesErr.message);
	}
	const roleMap = roles.reduce((acc, r) => {
		acc[r.role_name as keyof RoleMap] = r.role_id;
		return acc;
	}, {} as RoleMap);

    const { data: createdUser, error: userErr } = await userRepository.createUser(user, roleMap);
    if(userErr){
        throw new Error(userErr.message);
    }
    if(!createdUser){
        throw new Error("User not created");
    }
    return createdUser;
};

export const getUsers = async (page: number, limit: number) => {
	const offset = (page - 1) * limit;
    const { data: users, error: usersErr } = await userRepository.getUsers(limit, offset);

    if(usersErr){
        throw new Error(usersErr.message);
    }
    if(!users){
        throw new Error("Users not found");
    }
    return users;
};

export const updateUser = async (user: UpdateUser) => {
	const { data: roles, error: rolesErr } = await userRepository.getRoles();
	if(rolesErr){
		throw new Error(rolesErr.message);
	}
	const roleMap = roles.reduce((acc, r) => {
		acc[r.role_name as keyof RoleMap] = r.role_id;
		return acc;
	}, {} as RoleMap);

    const { data: updatedUser, error: userErr } = await userRepository.updateUser(user, roleMap);
    if(userErr){
        throw new Error(userErr.message);
    }
    if(!updatedUser){
        throw new Error("User not found");
    }
    return updatedUser;
};

export const deleteUser = async (user: DeleteUser) => {
    const { error: userErr } = await userRepository.deleteUser(user);
    if(userErr){
        throw new Error(userErr.message);
    }
};

export const getSelf = async (id: string) => {
	const { data: user, error: userErr } = await userRepository.getUserById(id);
	if(userErr){
        throw new Error(userErr.message);
	}
	if(!user){
        throw new Error("User not found");
	}
    return user;
};

export const updateSelf = async (id: string, user: UpdateSelf) => {
	const { data: updatedUser, error: userErr } = await userRepository.updateSelf(id, user);
	if(userErr){
        throw new Error(userErr.message);
	}
	if(!updatedUser){
        throw new Error("User not found");
	}
    return updatedUser;
};
