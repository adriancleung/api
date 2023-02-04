import {
  BelongsTo,
  CreateOptions,
  DataTypes,
  Model,
  Optional,
} from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import db from '../db';
import { RoleType } from '../types/role';
import User from './User';
import { RequestMethod } from '../types/request';
import Role from './Role';

class Permission extends Model {
  declare id: typeof uuidv4;
  declare route: string;
  declare method: RequestMethod;
  declare user: User;
  declare role: RoleType;

  static Role: BelongsTo;
  static User: BelongsTo;

  declare getUser: () => Promise<User>;
  declare setUser: (user: User) => Promise<void>;
  declare createUser: (
    values?: Optional<any, string>,
    options?: CreateOptions<any>
  ) => Promise<User>;

  declare getRole: () => Promise<Role>;
  declare setRole: (role: Role) => Promise<void>;
  declare createRole: (
    values?: Optional<any, string>,
    options?: CreateOptions<any>
  ) => Promise<Role>;
}

Permission.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    route: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    method: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isIn: Object.values(RequestMethod) as any,
      },
    },
  },
  { sequelize: db, modelName: 'Permission', underscored: true, paranoid: true }
);

export default Permission;
