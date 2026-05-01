import type { 
	AccessTokenPayload, 
	RefreshTokenPayload 
} from "@/types/auth";
import jwt, {
	JsonWebTokenError, 
	TokenExpiredError, 
} from "jsonwebtoken";
export { hashPassword as hashToken } from "@/utils/password";
export { verifyPassword as verifyToken } from "@/utils/password";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

if(!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET){
    throw new Error("Missing JWT credentials");
}

export const generateRefreshToken = (payload: RefreshTokenPayload) => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { 
		expiresIn: "30d" 
	});
}

export const generateAccessToken = (payload: AccessTokenPayload) => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { 
        expiresIn: "30m" 
	});
}

const verifyToken = <T>(token: string, secret: string) => {
	try {
		return jwt.verify(token, secret, {
			algorithms: ["HS256"]
		}) as T;
	} catch (error) {
		if(error instanceof TokenExpiredError){
            throw new Error("Token expired");
		}
		if(error instanceof JsonWebTokenError){
            throw new Error(error.message);
        }
		throw new Error("Unknown Error");
	}
}

export const verifyRefreshToken = (token: string) => {
    return verifyToken<RefreshTokenPayload>(token, REFRESH_TOKEN_SECRET);
}

export const verifyAccessToken = (token: string) => {
    return verifyToken<AccessTokenPayload>(token, ACCESS_TOKEN_SECRET);
}
