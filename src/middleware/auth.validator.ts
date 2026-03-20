import {Response, Request, NextFunction} from 'express';
import { ZodType } from 'zod';

const validator = <T>(schema: ZodType<T>) => 
	(req: Request<{}, {}, T>, res: Response, next: NextFunction) => {
		const otp = schema.safeParse(req.body);

		if (!otp.success) {
			return res.status(400).json({
				error: otp.error.issues.map((err) => ({
					path: err.path.join("."),
					message: err.message,
				})),
			});    
		}
		req.body = otp.data;
		next();
	}

export default validator;
