import db from "@/config/db";
import { sql } from "drizzle-orm";
import { 
	AssignmentsSchema,
	type Assignments,
    AssignmentSchema,
    type Assignment
} from "@/types/assignments";

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
