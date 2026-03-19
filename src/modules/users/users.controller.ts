import { Request, Response } from "express";
import * as userService from "@/modules/users/users.service";

export const getUsers = async (req: Request, res: Response) => {
	try {
        const {page, limit} = req.pagination!;
        const users = await userService.getUsers(page, limit);
        res.status(200).json(users);
	} catch (error) {
		if(error instanceof Error)
            res.status(500).send(error.message);
	}
}

export const createUser = async (req: Request, res: Response) => {
    try {
        const user = await userService.createUser(req.body);
        res.status(201).json({
			message: "User created successfully!", 
			user: user
		});
    } catch (error) {
        if(error instanceof Error)
            res.status(500).send(error.message);
    }
}

export const getMe = async (req: Request, res: Response) => {
	try {
		const user = await userService.getUserById(req.user!.id);
		res.status(200).json(user);
	} catch (error) {
		if(error instanceof Error)
            res.status(500).send(error.message);
	}
}
