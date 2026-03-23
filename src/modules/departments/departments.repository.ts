import { 
	createClient, 
	PostgrestSingleResponse 
} from "@supabase/supabase-js";
import { 
	CreateDepartment, 
	Department 
} from "@/types/department";
import dotenv from "dotenv";

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL as string;
const SUPABASE_KEY = process.env.SUPABASE_KEY as string;

if(!SUPABASE_URL || !SUPABASE_KEY) {
	throw new Error("Missing Supabase credentials");
}

const supabase = createClient(
	SUPABASE_URL,
	SUPABASE_KEY
);

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
