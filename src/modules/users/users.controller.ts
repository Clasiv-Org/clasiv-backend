import { Request, Response } from "express";
import * as userService from "@/modules/users/users.service";

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

export const updateUser = async (req: Request, res: Response) => {
    try {
        const user = await userService.updateUser(req.body);
        res.status(200).json({
            message: "User updated successfully!", 
            user: user
        });
    } catch (error) {
        if(error instanceof Error)
            res.status(500).send(error.message);
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    try {
        await userService.deleteUser(req.body);
        res.status(200).json({
            message: "User deleted successfully!"
		});
    } catch (error) {
        if(error instanceof Error)
            res.status(500).send(error.message);
    }
}

export const getSelf = async (req: Request, res: Response) => {
	try {
		const user = await userService.getSelf(req.user!.id);
		res.status(200).json(user);
	} catch (error) {
		if(error instanceof Error)
            res.status(500).send(error.message);
	}
}

export const updateSelf = async (req: Request, res: Response) => {
	try {
		const user = await userService.updateSelf(req.user!.id, req.body);
		res.status(200).json(user);
	} catch (error) {
		if(error instanceof Error)
            res.status(500).send(error.message);
	}
}
