import z from "zod";
  
export const UserSchema = z.object({
	id: z.string(),
	full_name: z.string(),
	roll_no: z.string(),
	reg_no: z.string(),
	semester: z.number(),
	department_name: z.string(),
	department_abbrv: z.string(),
	hod_name: z.string(),
	email_id: z.string(),
	phone_no: z.string().optional(),
	dob: z.date().optional(),
	base_role: z.string(),
	extended_roles: z.array(z.string()),
});  
  
export const BaseCreateUserSchema = z.object({
	full_name: z.string(),
	department_id: z.string().uuid(),
	email_id: z.string().email().optional(),
	phone_no: z.string().optional(),
  
	base_role: z.enum(["student", "teacher", "admin"]),
	extended_roles: z.array(z.enum(["cr", "iic"])).optional(),
});  
  
export const CreateStudentSchema = BaseCreateUserSchema.extend({
	base_role: z.literal("student"),
	roll_no: z.string(),
	reg_no: z.string(),
	semester: z.number(),
	dob: z.coerce.date(),
});  
  
export const CreateTeacherSchema = BaseCreateUserSchema.extend({
	base_role: z.literal("teacher"),
	teacher_abbrv: z.string(),
});   
   
export const CreateUserSchema = z.discriminatedUnion("base_role", [
	CreateStudentSchema,
	CreateTeacherSchema,
]);   

export const UpdateUserSchema = BaseCreateUserSchema.partial()
	.extend({
		roll_no: z.string().optional(),
		reg_no: z.string().optional(),
		semester: z.number().optional(),
		dob: z.coerce.date().optional(),
		teacher_abbrv: z.string().optional(),
	}).refine((data) => {
		const hasStudentFields =
			data.roll_no || data.reg_no || data.semester || data.dob;

		const hasTeacherFields = data.teacher_abbrv;

		if (hasStudentFields && data.base_role !== "student") return false;
		if (hasTeacherFields && data.base_role !== "teacher") return false;

		return true;
	}
);

export const UpdateSelfSchema = z.object({
    email_id: z.string().email().optional(),
    phone_no: z.string().optional(),
	dob: z.coerce.date().optional(),
});

export const RoleSchema = z.object({
    role_id: z.number(),
    role_name: z.string(),
});

type BaseRole = "student" | "teacher" | "admin";
type ExtendedRole = "cr" | "iic";

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type UpdateSelf = z.infer<typeof UpdateSelfSchema>;
export type Role = z.infer<typeof RoleSchema>;
export type RoleMap = Record<BaseRole | ExtendedRole, number>;
