import type { 
	Response, 
	Request, 
	NextFunction, 
} from 'express';
import { verifyAccessToken } from "@/utils/token";
import { AppError } from "@/utils/error";

const authentication = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;
	if(!authHeader) {
		throw new AppError("No token", 401);
	}

	const token = authHeader?.split(" ")[1];
	try {
		const decode = verifyAccessToken(token!);
		req.user = decode;
        next();
	} catch (error) {
        throw new AppError("Invalid token", 401);
	}
}

export default authentication;
