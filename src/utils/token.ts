import type { 
	AccessTokenPayload, 
	RefreshTokenPayload 
} from "@/types/auth";
import jwt, {
	JsonWebTokenError, 
	TokenExpiredError, 
} from "jsonwebtoken";
import { createHash } from "crypto";
import { AppError } from "@/utils/error";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

if(!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET){
    throw new Error("Missing JWT credentials");
}

export const hashToken = (token: string): string => {
    return createHash("sha256").update(token).digest("hex");
};

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

export const verifyTokenHash = (token: string, hash: string): boolean => {
    return createHash("sha256").update(token).digest("hex") === hash;
};

const verifyToken = <T>(token: string, secret: string) => {
	try {
		return jwt.verify(token, secret, {
			algorithms: ["HS256"]
		}) as T;
	} catch (error) {
		if(error instanceof TokenExpiredError){
            throw new AppError("Token expired", 401);
		}
		if(error instanceof JsonWebTokenError){
            throw new AppError("Invalid token", 401);
        }
		throw new AppError("Unknown error", 500);
	}
}

export const verifyRefreshToken = (token: string) => {
    return verifyToken<RefreshTokenPayload>(token, REFRESH_TOKEN_SECRET);
}

export const verifyAccessToken = (token: string) => {
    return verifyToken<AccessTokenPayload>(token, ACCESS_TOKEN_SECRET);
}
