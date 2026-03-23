import * as departmentRepository from "@/modules/departments/departments.repository";

export const getDepartments = async () => {
	const { 
		data: departments, 
		error: departmentsErr 
	} = await departmentRepository.getDepartments();

    if(departmentsErr){
        throw new Error(departmentsErr.message);
    }
    return departments;
}
