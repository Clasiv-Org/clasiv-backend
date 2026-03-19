import { Request, Response, NextFunction } from "express";
import { CreateUserSchema } from "@/types/users";

const userValidator = (req: Request, res: Response, next: NextFunction) => {
	const user = CreateUserSchema.safeParse(req.body);
	if (!user.success) {
		return res.status(400).json({
			error: user.error.issues.map((err) => ({
				path: err.path.join("."),
				message: err.message,
			})),
		});    
	}
	req.body = user.data;
	next();
}

export default userValidator;
