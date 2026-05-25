import * as assignmentRepository from "@/modules/assignments/assignments.repository";
import type { CreateAssignmentPayload } from "@/types/assignments";
import { generateUploadPresignedUrl } from "@/utils/s3";
import { AppError } from "@/utils/error";
import { handleAssignmentRPCError } from "@/mappers/errors";
import { AccessTokenPayload } from "@/types/auth";

export const createAssignment = async (user: AccessTokenPayload, assignmentData: CreateAssignmentPayload) => {
    const userId = user.id;
	const role = user.role;
	const extentionRoles = user.extendedRoles;
	const permissions = user.permissions;

	if( role !== "admin" && 
		role !== "teacher" && 
		!extentionRoles.includes("teacher") && 
		!extentionRoles.includes("cr")
	) throw new AppError("Unauthorized", 403);

	if( !permissions.includes("manage:all") && 
		!permissions.includes("manage:assignments") && 
		!permissions.includes("create:assignments")
	) throw new AppError("Unauthorized", 403);

    const {success, error, data: assignment} = await assignmentRepository.createAssignment(userId, assignmentData);
	if(!success) handleAssignmentRPCError(error);

    return assignment;
}

export const getAssignments = async () => {
    const assignments = await assignmentRepository.getAssignments();

    return assignments;
}

export const getFilePatterns = async () => {
    const patterns = await assignmentRepository.getFilePatterns();
	if(!patterns) throw new AppError("Failed to get file patterns", 500);

    return patterns;
}

export const getAssignment = async (id: string) => {
    const {success, error, data: assignment} = await assignmentRepository.getAssignment(id);
	if(!success) handleAssignmentRPCError(error);

    return assignment;
}

export const createSubmission = async (assignmentId: string, studentId: string, fileSize: number) => {
	const result = await assignmentRepository.generateSubmissionKey(assignmentId, studentId);
	if(!result) throw new AppError("Failed to generate submission key", 500);
	if(!result.success) {
		const statusMap: Record<string, number> = {
			"Assignment not found": 404,
			"User not a student": 403,
		};
        throw new AppError(result.error!, statusMap[result.error!] ?? 500);
	}

    const key = result.key!;
	const url = await generateUploadPresignedUrl(key, fileSize);

	const log = await assignmentRepository.createUploadLog({
		assignmentId,
		studentId,
		attachmentKey: key,
	});
	if (!log) throw new AppError("Failed to create upload log", 500);

	return {
		submissionLogId: log.id,
		url
	};
}
