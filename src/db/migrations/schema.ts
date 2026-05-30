import { pgTable, foreignKey, unique, uuid, boolean, check, text, timestamp, serial, smallint, index, bigint, date, inet, primaryKey, integer, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const activationStatus = pgEnum("activation_status", ['initiated', 'otp_sent', 'otp_verified', 'completed', 'expired'])
export const genderType = pgEnum("gender_type", ['male', 'female', 'non_binary', 'prefer_not_to_say'])
export const otpStatus = pgEnum("otp_status", ['used', 'pending', 'expired'])
export const userStatus = pgEnum("user_status", ['unactivated', 'active', 'inactive', 'suspended', 'banned'])


export const collegeCourseSubjects = pgTable("college_course_subjects", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	collegeId: uuid("college_id").notNull(),
	courseSubjectId: uuid("course_subject_id").notNull(),
	isActive: boolean("is_active").default(true),
}, (table) => [
	foreignKey({
			columns: [table.collegeId],
			foreignColumns: [colleges.id],
			name: "college_course_subjects_college_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.courseSubjectId],
			foreignColumns: [courseSubjects.id],
			name: "college_course_subjects_course_subject_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	unique("college_course_subjects_college_id_course_subject_id_key").on(table.collegeId, table.courseSubjectId),
]);

export const subjects = pgTable("subjects", {
	code: text().notNull(),
	name: text().notNull(),
	id: uuid().defaultRandom().primaryKey().notNull(),
	scope: text().default('university').notNull(),
}, (table) => [
	check("subjects_scope_check", sql`scope = ANY (ARRAY['university'::text, 'college'::text])`),
]);

export const activationSessions = pgTable("activation_sessions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	otpSessionId: uuid("otp_session_id"),
	status: activationStatus().default('initiated').notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).default(sql`(now() + '00:30:00'::interval)`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.otpSessionId],
			foreignColumns: [otpSessions.id],
			name: "activation_sessions_otp_session_id_fkey"
		}).onUpdate("cascade").onDelete("set null"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "activation_sessions_user_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
]);

export const refreshTokens = pgTable("refresh_tokens", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	tokenHash: text("token_hash").notNull(),
	isRevoked: boolean("is_revoked").default(false).notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	previousTokenId: uuid("previous_token_id"),
}, (table) => [
	foreignKey({
			columns: [table.previousTokenId],
			foreignColumns: [table.id],
			name: "refresh_tokens_previous_token_id_fkey"
		}).onUpdate("cascade").onDelete("set null"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "refresh_tokens_user_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const permissions = pgTable("permissions", {
	id: serial().primaryKey().notNull(),
	action: text().notNull(),
	resource: text().notNull(),
}, (table) => [
	check("permissions_action_check", sql`action = ANY (ARRAY['manage'::text, 'create'::text, 'update'::text, 'read'::text, 'delete'::text])`),
]);

export const filePatternChunks = pgTable("file_pattern_chunks", {
	id: smallint().primaryKey().generatedAlwaysAsIdentity({ name: "file_pattern_chunks_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 32767, cache: 1 }),
	name: text().notNull(),
	token: text().notNull(),
}, (table) => [
	unique("file_pattern_chunks_name_key").on(table.name),
	unique("file_pattern_chunks_token_key").on(table.token),
]);

export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	fullName: text("full_name").notNull(),
	emailId: text("email_id"),
	phoneNo: text("phone_no"),
	activatedAt: timestamp("activated_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	lastLoginAt: timestamp("last_login_at", { withTimezone: true, mode: 'string' }),
	baseRole: smallint("base_role").notNull(),
	userName: text("user_name").notNull(),
	passwordHash: text("password_hash"),
	gender: genderType().default('prefer_not_to_say').notNull(),
	status: userStatus().default('unactivated').notNull(),
}, (table) => [
	foreignKey({
			columns: [table.baseRole],
			foreignColumns: [roles.id],
			name: "users_base_role_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	unique("users_email_id_key").on(table.emailId),
	unique("users_user_name_key").on(table.userName),
	check("users_user_name_check", sql`length(user_name) <= 32`),
]);

export const courses = pgTable("courses", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	abbrv: text().notNull(),
	departmentId: uuid("department_id").notNull(),
	maxSemesters: smallint("max_semesters").default(sql`'6'`).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.departmentId],
			foreignColumns: [departments.id],
			name: "courses_department_id_fkey"
		}),
	check("courses_max_semesters_check", sql`max_semesters > 0`),
]);

export const enrollments = pgTable("enrollments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	studentId: uuid("student_id").notNull(),
	universityId: uuid("university_id").notNull(),
	departmentId: uuid("department_id").notNull(),
	collegeId: uuid("college_id").notNull(),
	courseId: uuid("course_id").notNull(),
	admissionYear: smallint("admission_year").notNull(),
	expectedGraduationYear: smallint("expected_graduation_year").generatedAlwaysAs(sql`(admission_year + 4)`),
	regNo: text("reg_no").default('N/A').notNull(),
	rollNo: text("roll_no").default('N/A').notNull(),
	currentSemester: smallint("current_semester").notNull(),
	section: text(),
	admissionType: text("admission_type").default('regular').notNull(),
	admissionMode: text("admission_mode").default('offline').notNull(),
	courseMode: text("course_mode").default('day').notNull(),
	status: text().default('active').notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdBy: text("created_by"),
}, (table) => [
	foreignKey({
			columns: [table.collegeId, table.courseId],
			foreignColumns: [collegeCourses.collegeId, collegeCourses.courseId],
			name: "enrollments_college_id_course_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.departmentId],
			foreignColumns: [departments.id],
			name: "enrollments_department_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.studentId],
			foreignColumns: [students.userId],
			name: "enrollments_student_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.universityId],
			foreignColumns: [universities.id],
			name: "enrollments_university_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	check("enrollments_admission_mode_check", sql`admission_mode = ANY (ARRAY['offline'::text, 'online'::text])`),
	check("enrollments_admission_type_check", sql`admission_type = ANY (ARRAY['regular'::text, 'lateral'::text, 'transfer'::text, 'distance'::text])`),
	check("enrollments_course_mode_check", sql`course_mode = ANY (ARRAY['day'::text, 'evening'::text])`),
	check("enrollments_current_semester_check", sql`current_semester > 0`),
	check("enrollments_status_check", sql`status = ANY (ARRAY['active'::text, 'dropped'::text, 'completed'::text, 'suspended'::text])`),
]);

export const roles = pgTable("roles", {
	id: smallint().primaryKey().generatedByDefaultAsIdentity({ name: "roles_role_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 32767, cache: 1 }),
	name: text().notNull(),
	scope: text().notNull(),
}, (table) => [
	check("roles_role_scope_check", sql`scope = ANY (ARRAY['base'::text, 'extension'::text, 'both'::text])`),
]);

export const teachers = pgTable("teachers", {
	userId: uuid("user_id").primaryKey().notNull(),
	abbrv: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "teachers_user_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const assignmentUploadLogs = pgTable("assignment_upload_logs", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	assignmentId: uuid("assignment_id").notNull(),
	studentId: uuid("student_id").notNull(),
	attachmentKey: text("attachment_key").notNull(),
	uploadedAt: timestamp("uploaded_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	uploadCompletedAt: timestamp("upload_completed_at", { withTimezone: true, mode: 'string' }),
	status: text().default('processing').notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	fileSize: bigint("file_size", { mode: "number" }),
	etag: text(),
}, (table) => [
	index("assignment_upload_logs_assignment_id_student_id_uploaded_at_idx").using("btree", table.assignmentId.asc().nullsLast().op("uuid_ops"), table.studentId.asc().nullsLast().op("timestamptz_ops"), table.uploadedAt.desc().nullsFirst().op("uuid_ops")),
	foreignKey({
			columns: [table.assignmentId],
			foreignColumns: [assignments.id],
			name: "assignment_upload_logs_assignment_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.studentId],
			foreignColumns: [students.userId],
			name: "assignment_upload_logs_student_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	check("assignment_upload_logs_status_check", sql`status = ANY (ARRAY['success'::text, 'processing'::text, 'failed'::text])`),
]);

export const colleges = pgTable("colleges", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	abbrv: text().notNull(),
	universityId: uuid("university_id").notNull(),
	isMainCampus: boolean("is_main_campus").default(false).notNull(),
	isAutonomous: boolean("is_autonomous").default(false).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.universityId],
			foreignColumns: [universities.id],
			name: "colleges_university_id_fkey"
		}),
]);

export const courseSubjects = pgTable("course_subjects", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	courseId: uuid("course_id").notNull(),
	subjectId: uuid("subject_id").notNull(),
	semester: smallint().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.courseId],
			foreignColumns: [courses.id],
			name: "course_subjects_course_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.subjectId],
			foreignColumns: [subjects.id],
			name: "course_subjects_subject_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	unique("course_subjects_course_id_subject_id_semester_key").on(table.courseId, table.subjectId, table.semester),
]);

export const assignments = pgTable("assignments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: text().notNull(),
	description: text(),
	assignedBy: uuid("assigned_by"),
	collegeCourseSubjectId: uuid("college_course_subject_id").notNull(),
	maxMarks: smallint("max_marks"),
	attachmentUrl: text("attachment_url"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	dueAt: timestamp("due_at", { withTimezone: true, mode: 'string' }).notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).notNull(),
	filePattern: smallint("file_pattern").array().default([2]).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.assignedBy],
			foreignColumns: [users.id],
			name: "assignments_assigned_by_fkey"
		}),
	foreignKey({
			columns: [table.collegeCourseSubjectId],
			foreignColumns: [collegeCourseSubjects.id],
			name: "assignments_college_course_subject_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
]);

export const students = pgTable("students", {
	userId: uuid("user_id").primaryKey().notNull(),
	dob: date(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "students_user_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
]);

export const otpSessions = pgTable("otp_sessions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	emailId: text("email_id").notNull(),
	purpose: text().notNull(),
	otpHash: text("otp_hash").notNull(),
	status: text().default('pending'),
	otpAttempts: smallint("otp_attempts").default(0),
	maxOtpAttempts: smallint("max_otp_attempts").default(5),
	resendCount: smallint("resend_count").default(0),
	maxResend: smallint("max_resend").default(3),
	changeEmailCount: smallint("change_email_count").default(0),
	maxEmailChange: smallint("max_email_change").default(3),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).default(sql`(now() + '00:03:00'::interval)`),
	ip: inet(),
	userAgent: text("user_agent"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "otp_sessions_user_id_fkey"
		}),
	check("otp_sessions_purpose_check", sql`purpose = ANY (ARRAY['email_verification'::text, 'password_reset'::text, 'email_change'::text])`),
	check("otp_sessions_status_check", sql`status = ANY (ARRAY['pending'::text, 'used'::text, 'expired'::text])`),
]);

export const universities = pgTable("universities", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	abbrv: text().notNull(),
});

export const departments = pgTable("departments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	abbrv: text().notNull(),
	universityId: uuid("university_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.universityId],
			foreignColumns: [universities.id],
			name: "departments_university_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	unique("departments_name_key").on(table.name),
	unique("departments_abbrv_key").on(table.abbrv),
]);

export const teacherSubjects = pgTable("teacher_subjects", {
	teacherId: uuid("teacher_id").notNull(),
	collegeCourseSubjectId: uuid("college_course_subject_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.collegeCourseSubjectId],
			foreignColumns: [collegeCourseSubjects.id],
			name: "teacher_subjects_college_course_subject_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.teacherId],
			foreignColumns: [teachers.userId],
			name: "teacher_subjects_teacher_id_fkey"
		}),
	primaryKey({ columns: [table.teacherId, table.collegeCourseSubjectId], name: "teacher_subjects_pkey"}),
]);

export const teacherColleges = pgTable("teacher_colleges", {
	teacherId: uuid("teacher_id").notNull(),
	collegeId: uuid("college_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.collegeId],
			foreignColumns: [colleges.id],
			name: "teacher_colleges_college_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.teacherId],
			foreignColumns: [teachers.userId],
			name: "teacher_colleges_teacher_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	primaryKey({ columns: [table.teacherId, table.collegeId], name: "teacher_colleges_pkey"}),
]);

export const rolePermissions = pgTable("role_permissions", {
	roleId: smallint("role_id").notNull(),
	permissionId: integer("permission_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.permissionId],
			foreignColumns: [permissions.id],
			name: "role_permissions_permission_id_fkey"
		}),
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [roles.id],
			name: "role_permissions_role_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	primaryKey({ columns: [table.roleId, table.permissionId], name: "role_permissions_pkey"}),
]);

export const roleExtendedUsers = pgTable("role_extended_users", {
	userId: uuid("user_id").notNull(),
	roleId: smallint("role_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [roles.id],
			name: "role_extended_users_role_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "role_extended_users_user_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	primaryKey({ columns: [table.userId, table.roleId], name: "role_extended_users_pkey"}),
]);

export const collegeCourses = pgTable("college_courses", {
	collegeId: uuid("college_id").notNull(),
	courseId: uuid("course_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.collegeId],
			foreignColumns: [colleges.id],
			name: "college_courses_college_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.courseId],
			foreignColumns: [courses.id],
			name: "college_courses_course_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	primaryKey({ columns: [table.collegeId, table.courseId], name: "college_courses_pkey"}),
]);

export const teacherDepartments = pgTable("teacher_departments", {
	teacherId: uuid("teacher_id").notNull(),
	departmentId: uuid("department_id").notNull(),
	isHod: boolean("is_hod").default(false),
}, (table) => [
	foreignKey({
			columns: [table.departmentId],
			foreignColumns: [departments.id],
			name: "teacher_departments_department_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.teacherId],
			foreignColumns: [teachers.userId],
			name: "teacher_departments_teacher_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	primaryKey({ columns: [table.teacherId, table.departmentId], name: "teacher_departments_pkey"}),
]);

export const studentAssignments = pgTable("student_assignments", {
	assignmentId: uuid("assignment_id").notNull(),
	studentId: uuid("student_id").notNull(),
	status: text().default('pending').notNull(),
	submittedAt: timestamp("submitted_at", { withTimezone: true, mode: 'string' }),
	isLate: boolean("is_late").default(false).notNull(),
	attachmentKey: text("attachment_key"),
}, (table) => [
	foreignKey({
			columns: [table.assignmentId],
			foreignColumns: [assignments.id],
			name: "student_assignments_assignment_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	foreignKey({
			columns: [table.studentId],
			foreignColumns: [students.userId],
			name: "student_assignments_student_id_fkey"
		}).onUpdate("cascade").onDelete("cascade"),
	primaryKey({ columns: [table.assignmentId, table.studentId], name: "student_assignments_pkey"}),
	check("student_assignments_status_check", sql`status = ANY (ARRAY['pending'::text, 'submitted'::text])`),
]);

export const collegeAdmins = pgTable("college_admins", {
	userId: uuid("user_id").notNull(),
	collegeId: uuid("college_id").notNull(),
	createdBy: uuid("created_by").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	isActive: boolean("is_active").default(true).notNull(),
	deactivatedAt: timestamp("deactivated_at", { withTimezone: true, mode: 'string' }),
	deactivatedBy: uuid("deactivated_by"),
}, (table) => [
	foreignKey({
			columns: [table.collegeId],
			foreignColumns: [colleges.id],
			name: "college_admins_college_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "college_admins_created_by_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.deactivatedBy],
			foreignColumns: [users.id],
			name: "college_admins_deactivated_by_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "college_admins_user_id_fkey"
		}).onUpdate("cascade").onDelete("restrict"),
	primaryKey({ columns: [table.userId, table.collegeId], name: "college_admins_pkey"}),
]);
