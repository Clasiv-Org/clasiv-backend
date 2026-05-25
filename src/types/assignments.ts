import { z } from "zod";
import { RPCResponseSchema } from "@/types/db";

export const FilePatternSchema = z.object({
	id: z.number(),
	name: z.string(),
});

const AssignedBySchema = z.object({
	userName: z.string().nullable(),
	fullName: z.string(),
	baseRole: z.string(),
	extentionRoles: z.array(z.string()),
});

const SubjectSchema = z.object({
	name: z.string(),
	code: z.string(),
});

const CollegeSchema = z.object({
	name:  z.string(),
	abbrv: z.string(),
});

const CourseSchema = z.object({
	name:  z.string(),
	abbrv: z.string(),
});

export const AssignmentSchema = z.object({
	id:            z.string().uuid(),
	title:         z.string(),
	description:   z.string().nullable(),
	assignedBy:    AssignedBySchema.nullable(),
	college:       CollegeSchema,
	subject:       SubjectSchema,
	course:        CourseSchema,
	maxMarks:      z.number().nullable(),
	attachmentUrl: z.string().nullable(),
	filePattern:   z.array(z.string()),
	isActive:      z.boolean(),
	createdAt:     z.string(),
	dueAt:         z.string(),
	expiresAt:     z.string(),
});

export const AssignmentRPCResponseSchema = RPCResponseSchema.extend({
	data: AssignmentSchema.nullable(),
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

export const SubmissionKeyRPCSchema = z.object({
	success: z.boolean(),
	error: z.string().nullable(),
	key: z.string().nullable(),
});

export const UploadSubmissionSchema = z.object({
	fileSize: z.number().int().positive(),
});

export const AssignmentUploadLogSchema = z.object({
	assignmentId: z.string().uuid(),
	studentId: z.string().uuid(),
	attachmentKey: z.string(),
});

export const AssignmentsSchema = z.array(AssignmentSchema);

export type FilePattern					= z.infer<typeof FilePatternSchema>;
export type Assignment					= z.infer<typeof AssignmentSchema>;
export type Assignments					= z.infer<typeof AssignmentsSchema>;
export type AssignmentRPCResponse		= z.infer<typeof AssignmentRPCResponseSchema>;
export type CreateAssignmentPayload		= z.infer<typeof CreateAssignmentSchema>;
export type SubmissionKeyRPCResponse	= z.infer<typeof SubmissionKeyRPCSchema>;
export type AssignmentUploadLogPayload	= z.infer<typeof AssignmentUploadLogSchema>;
