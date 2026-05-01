import type { 
	Response, 
	Request, 
} from 'express';
import * as assignmentService from "@/modules/assignments/assignments.service";

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
