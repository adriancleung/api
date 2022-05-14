import { BelongsTo, DataTypes, Model } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import db from '../db';
import User from './User';

class Notification extends Model {
  declare id: typeof uuidv4;
  declare title: string;
  declare shortDescription: string;
  declare description?: string;
  declare label?: string;
  declare user: User;
  static User: BelongsTo;
}

Notification.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shortDescription: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    label: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    defaultScope: {
      attributes: [
        'id',
        'title',
        'shortDescription',
        'description',
        'label',
        ['created_at', 'timestamp'],
      ],
    },
    sequelize: db,
    modelName: 'Notification',
    underscored: true,
    paranoid: true,
  }
);

export default Notification;
