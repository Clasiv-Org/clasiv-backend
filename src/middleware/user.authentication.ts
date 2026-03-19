import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "@/utils/token";

const userAuth = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;
	if(!authHeader) {
		return res.status(401).json({message: "No Token"});
	}

	const token = authHeader?.split(" ")[1];
	try {
		const decode = verifyAccessToken(token);
		req.user = decode;
        next();
	} catch (error) {
        return res.status(401).json({message: "Invalid Token"});
	}
}

export default userAuth;
