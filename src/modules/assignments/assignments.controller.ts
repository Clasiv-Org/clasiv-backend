import type { 
	Response, 
	Request, 
	NextFunction, 
} from 'express';
import * as assignmentService from "@/modules/assignments/assignments.service";
/*
* ROUTE: POST /assignments
* BODY: 
* {
*     message: string,
*     statusCode: number,
*     assignment: <Assignment> [REFERENCE: @/types/assignments]
* }
*/
export const createAssignment = async (req: Request, res: Response, next: NextFunction) => {
    try {
		const user = req.user!;
        const assignment = await assignmentService.createAssignment(user, req.body);
        res.status(201).json({
            message: "Assignment created successfully!",
            statusCode: 201,
            assignment
        });
    } catch(error) {
        next(error);
    }
}

/*
* ROUTE: GET /assignments
* BODY:
* {
*     message: string,
*     statusCode: number,
*     assignments: <Assignment[]> [REFERENCE: @/types/assignments]    
* }
*/
export const getAssignments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const assignments = await assignmentService.getAssignments();
        res.status(200).json({
			message: "Assignments found successfully!",
			statusCode: 200,
			assignments
		});
    } catch (error) {
		next(error);
    }
}

/*
* ROUTE: GET /assignments/file-patterns
* BODY:
* {
*     message: string,
*     statusCode: number,
*     filePatterns: <FilePattern[]> [REFERENCE: @/types/assignments>
* }
*/
export const getFilePatterns = async (req: Request, res: Response, next: NextFunction) => {
    try {
		const filePatterns = await assignmentService.getFilePatterns();
    	res.status(200).json({
            message: "File patterns found successfully!",
            statusCode: 200,
            filePatterns
		});
    } catch (error) {
    	next(error);
    }
}

/*
* ROUTE: GET /assignments/:id
* BODY:
* {
*     message: string,
*     statusCode: number,
*     assignment: <Assignment> [REFERENCE: @/types/assignments]    
* }
*/
export const getAssignment = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const assignment = await assignmentService.getAssignment(req.params.id);
        res.status(200).json({
            message: "Assignment found successfully!",
            statusCode: 200,
            assignment
        });
    } catch (error) {
		next(error);
    }
}

/*
* ROUTE: POST /assignments/:id/submissions
* BODY: 
* {
*     message: string,
*     statusCode: number,
*     upload: {
*         url: string
*     },
*     submissionLogId: string,
*     expiresIn: number [in seconds]
* }
*/
export const createSubmission = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
	try {
		const uploadCredentials = await assignmentService.createSubmission(
			req.params.id, 
			req.user!.id, 
			req.body.fileSize
		);
		res.status(201).json({
			message: "Submission initiated successfully",
            statusCode: 201,
			upload: {
				url: uploadCredentials.url,
			},
			submissionLogId: uploadCredentials.submissionLogId,
			expiresIn: 180
		});
	} catch (error) {
        next(error);
	}
}
