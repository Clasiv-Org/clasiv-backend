import z from "zod";

export const PaginationSchema = z.object({
    page: z.coerce.number().int().positive(),
    limit: z.coerce.number().int().positive(),
});

export type Pagination = z.infer<typeof PaginationSchema>;
