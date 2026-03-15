import { Request, Response, NextFunction } from "express";
import { Pagination, PaginationSchema } from "@/types/httpQuery";

const paginationValidator = (req: Request, res: Response, next: NextFunction) => {
	const result = PaginationSchema.safeParse(req.query);

	if (!result.success){
		console.log("err");
        return res.status(400).json({ error: result.error.format() });
    }

	req.pagination = result.data as Pagination;
    next();
}

export default paginationValidator;
