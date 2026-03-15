import * as userRepository from "@/modules/users/users.repository";

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
