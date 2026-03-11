import z from "zod";

const UserSchema = z.object({
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
})

export type User = z.infer<typeof UserSchema>;

const StudentUserSchema = z.object({
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
})

export type StudentUser = z.infer<typeof StudentUserSchema>;

const TeacherUserSchema = z.object({
    id: z.string(),
    full_name: z.string(),
    department_name: z.string(),
    department_abbrv: z.string(),
    email_id: z.string(),
    phone_no: z.string().optional(),
    dob: z.date().optional(),
    base_role: z.string(),
    extended_roles: z.array(z.string()),
})

export type TeacherUser = z.infer<typeof TeacherUserSchema>;
