import type { 
	Response, 
	Request, 
} from 'express';
import * as assignmentService from "@/modules/assignments/assignments.service";

export const createAssignment = async (req: Request, res: Response) => {
    try {
		const userId = req.user!.id;
        const assignment = await assignmentService.createAssignment(userId, req.body);
        res.status(201).json({
            message: "Assignment created successfully!",
            statusCode: 201,
            assignment
        });
    } catch(error) {
        if(error instanceof Error)
            res.status(500).send(error.message);
    }
}

export const getAssignments = async (req: Request, res: Response) => {
    try {
        const assignments = await assignmentService.getAssignments();
        res.status(200).json({
			message: "Assignments found successfully!",
			statusCode: 200,
			assignments
		});
    } catch (error) {
        if(error instanceof Error)
            res.status(500).send(error.message);
    }
}

export const getAssignment = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const assignment = await assignmentService.getAssignment(req.params.id);
        res.status(200).json({
            message: "Assignment found successfully!",
            statusCode: 200,
            assignment
        });
    } catch (error) {
        if(error instanceof Error)
            res.status(500).send(error.message);
    }
}

export const createSubmission = async (req: Request<{ id: string }>, res: Response) => {
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
		if(error instanceof Error)
			res.status(500).send(error.message);
	}
}
