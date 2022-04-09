import { DataTypes, Model } from 'sequelize';
import db from '../db';
import { v4 as uuidv4 } from 'uuid';

class Data extends Model {
  declare id: typeof uuidv4;
  declare key: string;
  declare value: string;
}

Data.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    value: {
      type: DataTypes.BLOB,
      allowNull: false,
    },
  },
  { sequelize: db, modelName: 'Data', underscored: true }
);

export default Data;
