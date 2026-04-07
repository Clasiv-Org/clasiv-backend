import { z } from "zod";

export const DepartmentAbbrvEnum = z.enum([
    "BCA",
])

export const DepartmentSchema = z.object({
	id: z.string().uuid(),
    department_name: z.string(),
    department_abbrv: z.string(),
    hod_name: z.string(),
	hod_id: z.string().uuid(),
});

export const CreateDepartmentSchema = z.object({
    department_name: z.string(),
    department_abbrv: z.string(),
    hod_id: z.string().uuid(),
});

export type DepartmentAbbrv = z.infer<typeof DepartmentAbbrvEnum>;
export type Department = z.infer<typeof DepartmentSchema>;
export type CreateDepartment = z.infer<typeof CreateDepartmentSchema>;
export type DepartmentAbbrvMap = Record<DepartmentAbbrv, string>;
