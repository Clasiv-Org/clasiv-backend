import * as assignmentsRepository from "@/modules/assignments/assignments.repository";

export const getAssignments = async () => {
    const assignments = await assignmentsRepository.getAssignments();

    return assignments;
}

export const getAssignment = async (id: string) => {
    const assignment = await assignmentsRepository.getAssignment(id);
	if(!assignment) throw new Error("Assignment not found");

    return assignment;
}
