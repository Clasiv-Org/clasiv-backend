import z from "zod";

export const DepartmentSchema = z.object({
	id: z.string().uuid(),
    department_name: z.string(),
    department_abbrv: z.string(),
    hod_name: z.string(),
	hod_id: z.string().uuid(),
});


export type Department = z.infer<typeof DepartmentSchema>;
