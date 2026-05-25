import db from "@/config/db";
import { sql } from "drizzle-orm";
import { 
	AssignmentsSchema,
	type Assignments,
	AssignmentRPCResponseSchema,
    type AssignmentRPCResponse,
    type CreateAssignmentPayload, 
	type AssignmentUploadLogPayload,
    SubmissionKeyRPCSchema,
    type SubmissionKeyRPCResponse,
    type FilePattern,
} from "@/types/assignments";
import { assignmentUploadLogs, filePatternChunks } from "@/db/schemas";

export const createUploadLog = async (assgnmentData: AssignmentUploadLogPayload) => {
    const result = await db
		.insert(assignmentUploadLogs)
        .values({
            assignmentId: assgnmentData.assignmentId,
            studentId: assgnmentData.studentId,
			attachmentKey: assgnmentData.attachmentKey,
			uploadedAt: new Date().toISOString(),
            status: 'processing',
		})
        .returning();

    return result[0] ?? null;
}

export const getFilePatterns = async (): Promise<FilePattern[]> => {
    const result = await db.select({
		id: filePatternChunks.id,
        name: filePatternChunks.name
	}).from(filePatternChunks);
    return result;
}
export const generateSubmissionKey = async (assignmentId: string, studentId: string): Promise<SubmissionKeyRPCResponse> => {
	const result = await db.execute(sql`
		SELECT generate_submission_key(${assignmentId}, ${studentId})
	`);
	const raw = result.rows[0]?.generate_submission_key;
	const parsed = SubmissionKeyRPCSchema.parse(raw);
    return parsed;
}

export const createAssignment = async (userId: string, assignmentData: CreateAssignmentPayload): Promise<AssignmentRPCResponse> => {
	const filePatternSql = assignmentData.filePattern 
		? sql.raw(`ARRAY[${assignmentData.filePattern.join(',')}]::smallint[]`)
		: sql`NULL`;

	const result = await db.execute(sql`
		SELECT create_assignment(
			${userId}, 
			${assignmentData.collegeCourseSubjectId},
			${assignmentData.title},
			${assignmentData.description ?? null},
			${assignmentData.maxMarks ?? null},
			${assignmentData.attachmentUrl ?? null},
			${assignmentData.dueAt},
			${assignmentData.expiresAt},
			${filePatternSql}
		)
	`);
	const raw = result.rows[0]?.create_assignment;
	return AssignmentRPCResponseSchema.parse(raw);
}

export const getAssignments = async (): Promise<Assignments> => {
	const result = await db.execute(sql`
		SELECT get_assignments()
	`);

	const raw = result.rows[0]?.get_assignments;
	if (!raw) return [];
	return AssignmentsSchema.parse(raw);
};

export const getAssignment = async (assignmentId: string): Promise<AssignmentRPCResponse> => {
	const result = await db.execute(sql`
		SELECT get_assignment(${assignmentId})	
	`);

	const raw = result.rows[0]?.get_assignment;
	return AssignmentRPCResponseSchema.parse(raw);
};
