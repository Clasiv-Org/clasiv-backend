import { z } from "zod";
import { 
    BaseRoleEnum,
    ExtendedRoleEnum,
} from "@/types/roles";
import { DepartmentAbbrvEnum } from "./department";
  
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

export const BaseGetUserSchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    base_role: BaseRoleEnum.optional(),
	department: DepartmentAbbrvEnum.optional(),
});
  
export const BaseCreateUserSchema = z.object({
	full_name: z.string(),
	department_id: z.string().uuid(),
	email_id: z.string().email().toLowerCase().optional(),
	phone_no: z.string().trim().length(10).regex(/^\d+$/).optional(),
  
	base_role: BaseRoleEnum,
	extended_roles: z.array(ExtendedRoleEnum).optional(),
});  
  
export const CreateStudentSchema = BaseCreateUserSchema.extend({
	base_role: z.literal("student"),
	roll_no: z.string().length(11),
	reg_no: z.string().length(13),
	semester: z.number().min(1).max(8),
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
		roll_no: z.string().length(11).optional(),
		reg_no: z.string().length(13).optional(),
		semester: z.number().min(1).max(8).optional(),
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
    email_id: z.string().email().toLowerCase().optional(),
    phone_no: z.string().trim().length(10).regex(/^\d+$/).optional(),
	dob: z.coerce.date().optional(),
});

export type User = z.infer<typeof UserSchema>;
export type BaseGetUser = z.infer<typeof BaseGetUserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
export type UpdateSelf = z.infer<typeof UpdateSelfSchema>;
