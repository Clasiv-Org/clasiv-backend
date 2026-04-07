import { JwtPayload } from "jsonwebtoken";
import { 
	RefreshTokenPayload, 
	AccessTokenPayload, 
} from "./auth";
import { Pagination } from "@/types/httpQuery";
import { BaseGetUser } from "@/types/users";

declare global {
    namespace Express {
        interface Request {
            user?: RefreshTokenPayload | AccessTokenPayload;
			pagination?: BaseGetUser;
		}
    }
}
