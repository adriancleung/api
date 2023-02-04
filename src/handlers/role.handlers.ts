import Role from '../models/Role';
import { RoleType } from '../types/role';

const createOrGetRole = async (roleType: RoleType): Promise<Role> => {
  const [role] = await Role.findOrCreate({ where: { type: roleType } });
  return role;
};

export { createOrGetRole };
