import * as departmentRepository from "@/modules/departments/departments.repository";
import { CreateDepartment } from "@/types/department";

export const getDepartments = async () => {
	const { 
		data: departments, 
		error: departmentsErr 
	} = await departmentRepository.getDepartments();

    if(departmentsErr) throw new Error(departmentsErr.message);
    return departments;
}

export const createDepartment = async (department: CreateDepartment) => {
    const { 
		data: createdDepartment, 
		error: departmentErr 
	} = await departmentRepository.createDepartment(department);

    if(departmentErr) throw new Error(departmentErr.message);
    return createdDepartment;
}
