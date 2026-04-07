import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import { supabase } from "@/config/supabase";
import type { 
	CreateDepartment, 
	Department 
} from "@/types/department";

export const getDepartments = async ()
: Promise<PostgrestSingleResponse<Department[]>> => {
    return await supabase.rpc("get_departments");
}

export const createDepartment = async (
	department: CreateDepartment
): Promise<PostgrestSingleResponse<Department>> => {
    return await supabase.rpc("create_department", {
        _department_name: department.department_name,
        _department_abbrv: department.department_abbrv,
        _hod_id: department.hod_id
	}).single();
}
