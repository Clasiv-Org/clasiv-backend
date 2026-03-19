import * as userRepository from "@/modules/users/users.repository";
import { CreateUser, User } from "@/types/users";

export const getUserById = async (id: string) => {
	const { data: user, error: userErr } = await userRepository.getUserById(id);
	if(userErr){
        throw new Error(userErr.message);
	}
	if(!user){
        throw new Error("User not found");
	}
    return user;
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

export const createUser = async (user: CreateUser) => {
    const { data: createdUser, error: userErr } = await userRepository.createUser(user);
    if(userErr){
        throw new Error(userErr.message);
    }
    if(!createdUser){
        throw new Error("User not created");
    }
    return createdUser;
};
