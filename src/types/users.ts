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

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type RoleMap = Record<string, number>;
