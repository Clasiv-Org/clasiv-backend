import { relations } from "drizzle-orm/relations";
import { colleges, collegeCourseSubjects, courseSubjects, otpSessions, activationSessions, users, refreshTokens, roles, departments, courses, collegeCourses, enrollments, students, universities, teachers, assignments, assignmentUploadLogs, subjects, teacherSubjects, teacherColleges, permissions, rolePermissions, roleExtendedUsers, teacherDepartments, studentAssignments, collegeAdmins } from "./schema";

export const collegeCourseSubjectsRelations = relations(collegeCourseSubjects, ({one, many}) => ({
	college: one(colleges, {
		fields: [collegeCourseSubjects.collegeId],
		references: [colleges.id]
	}),
	courseSubject: one(courseSubjects, {
		fields: [collegeCourseSubjects.courseSubjectId],
		references: [courseSubjects.id]
	}),
	assignments: many(assignments),
	teacherSubjects: many(teacherSubjects),
}));

export const collegesRelations = relations(colleges, ({one, many}) => ({
	collegeCourseSubjects: many(collegeCourseSubjects),
	university: one(universities, {
		fields: [colleges.universityId],
		references: [universities.id]
	}),
	teacherColleges: many(teacherColleges),
	collegeCourses: many(collegeCourses),
	collegeAdmins: many(collegeAdmins),
}));

export const courseSubjectsRelations = relations(courseSubjects, ({one, many}) => ({
	collegeCourseSubjects: many(collegeCourseSubjects),
	course: one(courses, {
		fields: [courseSubjects.courseId],
		references: [courses.id]
	}),
	subject: one(subjects, {
		fields: [courseSubjects.subjectId],
		references: [subjects.id]
	}),
}));

export const activationSessionsRelations = relations(activationSessions, ({one}) => ({
	otpSession: one(otpSessions, {
		fields: [activationSessions.otpSessionId],
		references: [otpSessions.id]
	}),
	user: one(users, {
		fields: [activationSessions.userId],
		references: [users.id]
	}),
}));

export const otpSessionsRelations = relations(otpSessions, ({one, many}) => ({
	activationSessions: many(activationSessions),
	user: one(users, {
		fields: [otpSessions.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({one, many}) => ({
	activationSessions: many(activationSessions),
	refreshTokens: many(refreshTokens),
	role: one(roles, {
		fields: [users.baseRole],
		references: [roles.id]
	}),
	teachers: many(teachers),
	assignments: many(assignments),
	students: many(students),
	otpSessions: many(otpSessions),
	roleExtendedUsers: many(roleExtendedUsers),
	collegeAdmins_createdBy: many(collegeAdmins, {
		relationName: "collegeAdmins_createdBy_users_id"
	}),
	collegeAdmins_deactivatedBy: many(collegeAdmins, {
		relationName: "collegeAdmins_deactivatedBy_users_id"
	}),
	collegeAdmins_userId: many(collegeAdmins, {
		relationName: "collegeAdmins_userId_users_id"
	}),
}));

export const refreshTokensRelations = relations(refreshTokens, ({one, many}) => ({
	refreshToken: one(refreshTokens, {
		fields: [refreshTokens.previousTokenId],
		references: [refreshTokens.id],
		relationName: "refreshTokens_previousTokenId_refreshTokens_id"
	}),
	refreshTokens: many(refreshTokens, {
		relationName: "refreshTokens_previousTokenId_refreshTokens_id"
	}),
	user: one(users, {
		fields: [refreshTokens.userId],
		references: [users.id]
	}),
}));

export const rolesRelations = relations(roles, ({many}) => ({
	users: many(users),
	rolePermissions: many(rolePermissions),
	roleExtendedUsers: many(roleExtendedUsers),
}));

export const coursesRelations = relations(courses, ({one, many}) => ({
	department: one(departments, {
		fields: [courses.departmentId],
		references: [departments.id]
	}),
	courseSubjects: many(courseSubjects),
	collegeCourses: many(collegeCourses),
}));

export const departmentsRelations = relations(departments, ({one, many}) => ({
	courses: many(courses),
	enrollments: many(enrollments),
	university: one(universities, {
		fields: [departments.universityId],
		references: [universities.id]
	}),
	teacherDepartments: many(teacherDepartments),
}));

export const enrollmentsRelations = relations(enrollments, ({one}) => ({
	collegeCourse: one(collegeCourses, {
		fields: [enrollments.collegeId],
		references: [collegeCourses.collegeId]
	}),
	department: one(departments, {
		fields: [enrollments.departmentId],
		references: [departments.id]
	}),
	student: one(students, {
		fields: [enrollments.studentId],
		references: [students.userId]
	}),
	university: one(universities, {
		fields: [enrollments.universityId],
		references: [universities.id]
	}),
}));

export const collegeCoursesRelations = relations(collegeCourses, ({one, many}) => ({
	enrollments: many(enrollments),
	college: one(colleges, {
		fields: [collegeCourses.collegeId],
		references: [colleges.id]
	}),
	course: one(courses, {
		fields: [collegeCourses.courseId],
		references: [courses.id]
	}),
}));

export const studentsRelations = relations(students, ({one, many}) => ({
	enrollments: many(enrollments),
	assignmentUploadLogs: many(assignmentUploadLogs),
	user: one(users, {
		fields: [students.userId],
		references: [users.id]
	}),
	studentAssignments: many(studentAssignments),
}));

export const universitiesRelations = relations(universities, ({many}) => ({
	enrollments: many(enrollments),
	colleges: many(colleges),
	departments: many(departments),
}));

export const teachersRelations = relations(teachers, ({one, many}) => ({
	user: one(users, {
		fields: [teachers.userId],
		references: [users.id]
	}),
	teacherSubjects: many(teacherSubjects),
	teacherColleges: many(teacherColleges),
	teacherDepartments: many(teacherDepartments),
}));

export const assignmentUploadLogsRelations = relations(assignmentUploadLogs, ({one}) => ({
	assignment: one(assignments, {
		fields: [assignmentUploadLogs.assignmentId],
		references: [assignments.id]
	}),
	student: one(students, {
		fields: [assignmentUploadLogs.studentId],
		references: [students.userId]
	}),
}));

export const assignmentsRelations = relations(assignments, ({one, many}) => ({
	assignmentUploadLogs: many(assignmentUploadLogs),
	user: one(users, {
		fields: [assignments.assignedBy],
		references: [users.id]
	}),
	collegeCourseSubject: one(collegeCourseSubjects, {
		fields: [assignments.collegeCourseSubjectId],
		references: [collegeCourseSubjects.id]
	}),
	studentAssignments: many(studentAssignments),
}));

export const subjectsRelations = relations(subjects, ({many}) => ({
	courseSubjects: many(courseSubjects),
}));

export const teacherSubjectsRelations = relations(teacherSubjects, ({one}) => ({
	collegeCourseSubject: one(collegeCourseSubjects, {
		fields: [teacherSubjects.collegeCourseSubjectId],
		references: [collegeCourseSubjects.id]
	}),
	teacher: one(teachers, {
		fields: [teacherSubjects.teacherId],
		references: [teachers.userId]
	}),
}));

export const teacherCollegesRelations = relations(teacherColleges, ({one}) => ({
	college: one(colleges, {
		fields: [teacherColleges.collegeId],
		references: [colleges.id]
	}),
	teacher: one(teachers, {
		fields: [teacherColleges.teacherId],
		references: [teachers.userId]
	}),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({one}) => ({
	permission: one(permissions, {
		fields: [rolePermissions.permissionId],
		references: [permissions.id]
	}),
	role: one(roles, {
		fields: [rolePermissions.roleId],
		references: [roles.id]
	}),
}));

export const permissionsRelations = relations(permissions, ({many}) => ({
	rolePermissions: many(rolePermissions),
}));

export const roleExtendedUsersRelations = relations(roleExtendedUsers, ({one}) => ({
	role: one(roles, {
		fields: [roleExtendedUsers.roleId],
		references: [roles.id]
	}),
	user: one(users, {
		fields: [roleExtendedUsers.userId],
		references: [users.id]
	}),
}));

export const teacherDepartmentsRelations = relations(teacherDepartments, ({one}) => ({
	department: one(departments, {
		fields: [teacherDepartments.departmentId],
		references: [departments.id]
	}),
	teacher: one(teachers, {
		fields: [teacherDepartments.teacherId],
		references: [teachers.userId]
	}),
}));

export const studentAssignmentsRelations = relations(studentAssignments, ({one}) => ({
	assignment: one(assignments, {
		fields: [studentAssignments.assignmentId],
		references: [assignments.id]
	}),
	student: one(students, {
		fields: [studentAssignments.studentId],
		references: [students.userId]
	}),
}));

export const collegeAdminsRelations = relations(collegeAdmins, ({one}) => ({
	college: one(colleges, {
		fields: [collegeAdmins.collegeId],
		references: [colleges.id]
	}),
	user_createdBy: one(users, {
		fields: [collegeAdmins.createdBy],
		references: [users.id],
		relationName: "collegeAdmins_createdBy_users_id"
	}),
	user_deactivatedBy: one(users, {
		fields: [collegeAdmins.deactivatedBy],
		references: [users.id],
		relationName: "collegeAdmins_deactivatedBy_users_id"
	}),
	user_userId: one(users, {
		fields: [collegeAdmins.userId],
		references: [users.id],
		relationName: "collegeAdmins_userId_users_id"
	}),
}));