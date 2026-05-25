import { z } from "zod";
import type { InferSelectModel } from "drizzle-orm";
import { users } from "@/db/schemas";
import { 
    BaseRoleEnum,
    ExtendedRoleEnum,
} from "@/types/roles";
import { DepartmentAbbrvEnum } from "@/types/department";
import { RPCResponseSchema } from "@/types/db";
  
const AbbrEntitySchema = z.object({
	name: z.string(),
	abbrv: z.string(),
});

const HodSchema = z.object({
	name: z.string(),
	abbrv: z.string(),
});

const EnrollmentSchema = z.object({
	university: AbbrEntitySchema,
	college: AbbrEntitySchema,
	department: AbbrEntitySchema,
	course: AbbrEntitySchema,
	hod: HodSchema.nullable(),
	admissionYear: z.number(),
	graduationYear: z.number().nullable(),
	currentSemester: z.number(),
	rollNo: z.string(),
	regNo: z.string(),
});

const StudentDataSchema = z.object({
	dob: z.string().nullable(),
	enrollments: z.array(EnrollmentSchema),
});

const StudentProfileSchema = z.object({
	type: z.literal('student'),
	data: StudentDataSchema,
});

const DepartmentSchema = z.object({
	name: z.string(),
	abbrv: z.string(),
	isHod: z.boolean(),
});

const EmploymentSchema = z.object({
	university: AbbrEntitySchema,
	college: AbbrEntitySchema,
	departments: z.array(DepartmentSchema),
});

const TeacherDataSchema = z.object({
	abbrv: z.string(),
	employments: z.array(EmploymentSchema),
});

const TeacherProfileSchema = z.object({
	type: z.literal('teacher'),
	data: TeacherDataSchema,
});

export const UserProfileSchema = z.object({
	id: z.string().uuid(),
	userName: z.string().nullable(),
	fullName: z.string(),
	emailId: z.string().nullable(),
	phoneNo: z.string().nullable(),
	passwordHash: z.string().nullable(),
	baseRole: z.string(),
	extentionRoles: z.array(z.string()),
	createdAt: z.string().nullable(),
	modifiedAt: z.string().nullable(),
	activatedAt: z.string().nullable(),
	lastLoginAt: z.string().nullable(),
	profile: z.discriminatedUnion('type', [
		StudentProfileSchema,
		TeacherProfileSchema,
	]),
	permissions: z.array(z.string()),
});

export const UserProfileSafeSchema = UserProfileSchema.omit({ 
	id: true, 
	passwordHash: true, 
});

export const UserSafeSchema = z.object({
	fullName: z.string(),
	userName: z.string().nullable(),
	emailId: z.string().nullable(),
	phoneNo: z.string().nullable(),
	baseRole: z.number(),
	createdAt: z.string().nullable(),
	modifiedAt: z.string().nullable(),
    activatedAt: z.string().nullable(),
    lastLoginAt: z.string().nullable(),
});  

export const BaseGetUserSchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    baseRole: BaseRoleEnum.optional(),
	department: DepartmentAbbrvEnum.optional(),
});
  
export const BaseCreateUserSchema = z.object({
	fullName: z.string(),
	departmentId: z.string().uuid(),
	emailId: z.string().email().toLowerCase().optional(),
	phoneNo: z.string().trim().length(10).regex(/^\d+$/).optional(),
  
	baseRole: BaseRoleEnum,
	extendedRoles: z.array(ExtendedRoleEnum).optional(),
});  
  
export const CreateStudentSchema = BaseCreateUserSchema.extend({
	baseRole: z.literal("student"),
	rollNo: z.string().length(11),
	regNo: z.string().length(13),
	semester: z.number().min(1).max(8),
	dob: z.coerce.date(),
});  
  
export const CreateTeacherSchema = BaseCreateUserSchema.extend({
	baseRole: z.literal("teacher"),
	teacherAbbrv: z.string(),
});   
   
export const CreateUserSchema = z.discriminatedUnion("baseRole", [
	CreateStudentSchema,
	CreateTeacherSchema,
]);   

export const UpdateUserSchema = BaseCreateUserSchema.partial()
	.extend({
		rollNo: z.string().length(11).optional(),
		regNo: z.string().length(13).optional(),
		semester: z.number().min(1).max(8).optional(),
		dob: z.coerce.date().optional(),
		teacherAbbrv: z.string().optional(),
	}).refine((data) => {
		const hasStudentFields =
			data.rollNo || data.regNo || data.semester || data.dob;

		const hasTeacherFields = data.teacherAbbrv;

		if (hasStudentFields && data.baseRole !== "student") return false;
		if (hasTeacherFields && data.baseRole !== "teacher") return false;

		return true;
	}
);

export const UpdateSelfSchema = z.object({
	userName: z.string().trim().toLowerCase().min(2).max(32)
		.regex(/^(?!\.)(?!.*\.\.)(?!.*\.$)(?=.*[a-zA-Z0-9])[a-zA-Z0-9_.]+$/)
		.optional(),
    emailId: z.string().toLowerCase().email().optional(),
    phoneNo: z.string().trim().length(10).regex(/^\d+$/).optional(),
});

export const UserProfileRPCResponseSchema = RPCResponseSchema.extend({
    data: UserProfileSchema.nullable(),
});

export const UpdateSelfRPCSchema = RPCResponseSchema.extend({
    data: UserProfileSchema.nullable(),
});

export type UserProfile		= z.infer<typeof UserProfileSchema>;
export type UserProfileSafe	= z.infer<typeof UserProfileSafeSchema>;
export type StudentProfile	= z.infer<typeof StudentProfileSchema>;
export type TeacherProfile	= z.infer<typeof TeacherProfileSchema>;
export type Enrollment		= z.infer<typeof EnrollmentSchema>;
export type Employment		= z.infer<typeof EmploymentSchema>;

export type User			= InferSelectModel<typeof users>;
export type UserSafe		= z.infer<typeof UserSafeSchema>;
export type BaseGetUser		= z.infer<typeof BaseGetUserSchema>;
export type CreateUser		= z.infer<typeof CreateUserSchema>;
export type UpdateUser		= z.infer<typeof UpdateUserSchema>;
export type UpdateSelf		= z.infer<typeof UpdateSelfSchema>;

export type UserProfileRPCResponse	= z.infer<typeof UserProfileRPCResponseSchema>;
export type UpdateSelfRPCResponse	= z.infer<typeof UpdateSelfRPCSchema>;
