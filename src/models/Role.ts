import {
  CreateOptions,
  DataTypes,
  FindOptions,
  HasMany,
  Model,
  Optional,
} from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import db from '../db';
import { RoleType } from '../types/role';
import Permission from './Permission';
import User from './User';

class Role extends Model {
  declare id: typeof uuidv4;
  declare type: RoleType;
  declare users: User[];

  static User: HasMany;
  static Permission: HasMany;

  declare getUsers: (options?: FindOptions) => Promise<User[]>;
  declare countUsers: (options?: FindOptions) => Promise<number>;
  declare hasUser: (user: User) => Promise<boolean>;
  declare addUser: (user: User) => Promise<void>;
  declare removeUser: (user: User) => Promise<void>;
  declare createUser: (
    values?: Optional<any, string>,
    options?: CreateOptions<any>
  ) => Promise<User>;

  declare getPermissions: (options?: FindOptions) => Promise<Permissions[]>;
  declare countPermissions: (options?: FindOptions) => Promise<number>;
  declare hasPermission: (permission: Permission) => Promise<boolean>;
  declare addPermission: (permission: Permission) => Promise<void>;
  declare removePermission: (permission: Permission) => Promise<void>;
  declare createPermission: (
    values?: Optional<any, string>,
    options?: CreateOptions<any>
  ) => Promise<Permission>;
}

Role.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isIn: Object.values(RoleType) as any,
      },
    },
  },
  {
    scopes: {
      limited: {
        attributes: ['type'],
      },
    },
    sequelize: db,
    modelName: 'Role',
    underscored: true,
    paranoid: true,
  }
);

export default Role;
