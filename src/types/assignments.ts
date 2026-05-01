import { z } from 'zod';

const AssignedBySchema = z.object({
	userName: z.string().nullable(),
	fullName: z.string(),
	baseRole: z.string(),
	extentionRole: z.array(z.string()),
});

const SubjectSchema = z.object({
	name: z.string(),
	code: z.string(),
});

export const AssignmentSchema = z.object({
	id: z.string().uuid(),
	title: z.string(),
	description: z.string().nullable(),
	assignedBy: AssignedBySchema.nullable(),
	subject: SubjectSchema,
	maxMarks: z.number().nullable(),
	attachmentUrl: z.string().nullable(),
	createdAt: z.string(),
	dueAt: z.string(),
	expiresAt: z.string(),
});

export const GetAssignmentPayloadSchema = z.object({
    id: z.string().uuid(),
});

export const CreateAssignmentSchema = z.object({
	title: z.string().trim().min(1).max(255),
	description: z.string().trim().optional(),
	collegeCourseSubjectId: z.string().uuid(),
	maxMarks: z.number().int().positive().optional(),
	attachmentUrl: z.string().url().optional(),
	dueAt: z.string().datetime(),
	expiresAt: z.string().datetime(),
	filePattern: z.array(z.number().int().min(1)).min(1).optional(),
}).refine(
	(data) => new Date(data.expiresAt) > new Date(data.dueAt),
	{
		message: "expiresAt must be after dueAt",
		path: ["expiresAt"],
	}
);

export const AssignmentsSchema = z.array(AssignmentSchema);

export type Assignment = z.infer<typeof AssignmentSchema>;
export type Assignments = z.infer<typeof AssignmentsSchema>;
export type CreateAssignmentPayload = z.infer<typeof CreateAssignmentSchema>;
