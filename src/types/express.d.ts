import { JwtPayload } from "jsonwebtoken";
import { 
	RefreshTokenPayload, 
	AccessTokenPayload, 
} from "./auth";

declare global {
    namespace Express {
        interface Request {
            user?: RefreshTokenPayload | AccessTokenPayload;
		}
    }
}
