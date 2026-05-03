import * as assignmentRepository from "@/modules/assignments/assignments.repository";
import type { CreateAssignmentPayload } from "@/types/assignments";
import { generateUploadPresignedUrl } from "@/utils/s3";

export const createAssignment = async (userId: string, assignmentData: CreateAssignmentPayload) => {
    const assignment = await assignmentRepository.createAssignment(userId, assignmentData);
	if(!assignment) throw new Error("Failed to create assignment");

    return assignment;
}

export const getAssignments = async () => {
    const assignments = await assignmentRepository.getAssignments();

    return assignments;
}

export const getAssignment = async (id: string) => {
    const assignment = await assignmentRepository.getAssignment(id);
	if(!assignment) throw new Error("Assignment not found");

    return assignment;
}

export const createSubmission = async (assignmentId: string, studentId: string, fileSize: number) => {
	const key = await assignmentRepository.generateSubmissionKey(assignmentId, studentId);
	if (!key) throw new Error('Failed to generate submission key');

	const url = await generateUploadPresignedUrl(key, fileSize);

	const log = await assignmentRepository.createUploadLog({
		assignmentId,
		studentId,
		attachmentKey: key,
	});
	if (!log) throw new Error('Failed to create upload log');

	return {
		submissionLogId: log.id,
		url
	};
}
