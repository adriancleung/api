import { DataTypes, FindOptions, HasMany, Model } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import db from '../db';
import { Role } from '../types/role';
import Notification from './Notification';

class User extends Model {
  declare id: typeof uuidv4;
  declare apiKey: string;
  declare email: string;
  declare passwordHash: string;
  declare tokens: string[];
  declare role: Role;
  declare notifications: Notification[];
  static Notification: HasMany;
  declare addNotification: (notification: Notification) => Promise<void>;
  declare removeNotification: (notification: Notification) => Promise<void>;
  declare getNotifications: (options?: FindOptions) => Promise<Notification[]>;
  declare hasNotification: (notification: Notification) => Promise<boolean>;
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
    defaultScope: { attributes: ['id', 'email', 'apiKey', 'tokens', 'role'] },
    scopes: {
      limited: {
        attributes: ['id', 'email', 'role'],
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

export default User;
