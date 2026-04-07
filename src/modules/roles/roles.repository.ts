import type { CreateRole, Role } from "@/types/roles";
import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import { supabase } from "@/config/supabase";

export const getRoles = async (): Promise<PostgrestSingleResponse<Role[]>> => {
    return await supabase
        .from("roles")
        .select("*");
}

export const createRole = async (role: CreateRole): Promise<PostgrestSingleResponse<Role>> => {
    return await supabase
        .from("roles")
        .insert(role)
        .select("*")
        .single();
}
