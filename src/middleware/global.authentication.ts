import type { 
	Response, 
	Request, 
	NextFunction, 
} from 'express';
import { verifyAccessToken } from "@/utils/token";
import { AppError } from "@/utils/error";

const authentication = async (req: Request, _res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;

	if(!authHeader || !authHeader.startsWith('Bearer ')) {
		throw new AppError("No token", 401);
	}

	const token = authHeader?.split(" ")[1];
	const decode = verifyAccessToken(token!);
	req.user = decode;
	next();
}

export default authentication;
