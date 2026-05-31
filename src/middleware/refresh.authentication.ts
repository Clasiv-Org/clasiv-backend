import type { 
	Response, 
	Request, 
	NextFunction 
} from "express";
import { verifyRefreshToken } from "@/utils/token";
import { AppError } from "@/utils/error";

const refreshAuthentication = async (req: Request, _res: Response, next: NextFunction) => {
    const clientType = req.headers["x-client-type"];

    const token = clientType === "mobile"
        ? req.headers["x-refresh-token"] as string
        : req.cookies?.refresh_token;

    if(!token) {
        throw new AppError("No token", 401);
    }

	const decoded = verifyRefreshToken(token);
	req.refreshToken = decoded;
	next();
};

export default refreshAuthentication;
