import { z } from "zod";

export const RPCResponseSchema = z.object({
    success: z.boolean(),
    error: z.string().nullable(),
    data: z.any().nullable(),
});

export type RPCResponse = z.infer<typeof RPCResponseSchema>;
