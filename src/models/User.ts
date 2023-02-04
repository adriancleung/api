import {
  BelongsTo,
  CreateOptions,
  DataTypes,
  FindOptions,
  HasMany,
  Model,
  Optional,
} from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import db from '../db';
import Notification from './Notification';
import Permission from './Permission';
import Role from './Role';

class User extends Model {
  declare id: typeof uuidv4;
  declare apiKey: string;
  declare email: string;
  declare passwordHash: string;
  declare tokens: string[];
  declare role: Role;
  declare notifications: Notification[];
  declare permissions: Permission[];

  static Notification: HasMany;
  static Role: BelongsTo;
  static Permission: HasMany;

  declare addNotification: (notification: Notification) => Promise<void>;
  declare removeNotification: (notification: Notification) => Promise<void>;
  declare getNotifications: (options?: FindOptions) => Promise<Notification[]>;
  declare hasNotification: (notification: Notification) => Promise<boolean>;
  declare countNotifications: (options?: FindOptions) => Promise<number>;
  declare createNotification: (
    values?: Optional<any, string>,
    options?: CreateOptions<any>
  ) => Promise<Notification>;

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

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apiKey: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tokens: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
  },
  {
    defaultScope: {
      attributes: ['id', 'email', 'apiKey', 'tokens'],
      include: [{ model: Role.scope('limited'), as: 'role' }],
    },
    scopes: {
      limited: {
        attributes: ['id', 'email'],
        include: { model: Role.scope('limited'), as: 'role' },
      },
    },
    sequelize: db,
    modelName: 'User',
    underscored: true,
    paranoid: true,
  }
);

User.Notification = User.hasMany(Notification);
Notification.User = Notification.belongsTo(User, {
  as: 'user',
  foreignKey: 'user_id',
});

User.Role = User.belongsTo(Role, {
  as: 'role',
  foreignKey: 'role_id',
});
Role.User = Role.hasMany(User);

User.Permission = User.hasMany(Permission);
Permission.User = Permission.belongsTo(User, {
  as: 'user',
  foreignKey: 'user_id',
});

Role.Permission = Role.hasMany(Permission);
Permission.Role = Permission.belongsTo(Role, {
  as: 'role',
  foreignKey: 'role_id',
});

export default User;
