import db from "@/config/db";
import { sql } from "drizzle-orm";
import { 
	AssignmentsSchema,
	type Assignments,
    AssignmentSchema,
    type Assignment,
    type CreateAssignmentPayload
} from "@/types/assignments";

export const createAssignment = async (userId: string, assignmentData: CreateAssignmentPayload): Promise<Assignment> => {
	const filePatternSql = assignmentData.filePattern 
		? sql.raw(`ARRAY[${assignmentData.filePattern.join(',')}]::smallint[]`)
		: sql`NULL`;

	const result = await db.execute(sql`
		SELECT create_assignment(
			${userId}, 
			${assignmentData.collegeCourseSubjectId},
			${assignmentData.title},
			${assignmentData.dueAt},
			${assignmentData.expiresAt},
			${assignmentData.description ?? null},
			${assignmentData.maxMarks ?? null},
			${assignmentData.attachmentUrl ?? null},
			${filePatternSql}
		)
	`);
	const raw = result.rows[0]?.create_assignment;
	return AssignmentSchema.parse(raw);
}

export const getAssignments = async (): Promise<Assignments> => {
	const result = await db.execute(sql`
		SELECT get_assignments()
	`);

	const raw = result.rows[0]?.get_assignments;
	if (!raw) return [];
	return AssignmentsSchema.parse(raw);
};

export const getAssignment = async (assignmentId: string): Promise<Assignment> => {
	const result = await db.execute(sql`
		SELECT get_assignment(${assignmentId})	
	`);

	const raw = result.rows[0]?.get_assignment;
	return AssignmentSchema.parse(raw);
};
