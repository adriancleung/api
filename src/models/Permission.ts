import { BelongsTo, DataTypes, Model } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import db from '../db';
import { RequestMethod } from '../types/request';
import { Role } from '../types/role';
import User from './User';

class Permission extends Model {
  declare id: typeof uuidv4;
  declare endpoint: string;
  declare method: RequestMethod;
  declare role: Role;
  declare allowedUsers: User[];
  static User: BelongsTo;
}

Permission.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    endpoint: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    method: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'GET',
      validate: {
        isIn: Object.values(RequestMethod) as any,
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user',
      validate: {
        isIn: Object.values(Role) as any,
      },
    },
  },
  {
    defaultScope: {
      attributes: ['id', 'endpoint', 'method'],
    },
    sequelize: db,
    modelName: 'Permission',
    underscored: true,
    paranoid: true,
  }
);

export default Permission;
