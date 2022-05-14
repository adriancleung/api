import { DataTypes, Model } from 'sequelize';
import db from '../db';
import { v4 as uuidv4 } from 'uuid';

class Mail extends Model {
  declare id: typeof uuidv4;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare message: string;
}

Mail.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: 'Mail',
    underscored: true,
    paranoid: true,
  }
);

export default Mail;
