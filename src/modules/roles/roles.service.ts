import * as roleRepository from "@/modules/roles/roles.repository";
import { CreateRole } from "@/types/roles";

export const getRoles = async () => {
	const { data: roles, error: rolesErr } = await roleRepository.getRoles();
    if(rolesErr) throw new Error(rolesErr.message);

    return roles;
}

export const createRole = async (role: CreateRole) => {
    const { data: createdRole, error: roleErr } = await roleRepository.createRole(role);
    if(roleErr) throw new Error(roleErr.message);

    return createdRole;
}
