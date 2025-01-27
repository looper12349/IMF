const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {

  const Gadget = sequelize.define('Gadget', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: () => uuidv4()
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    codename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Available', 'Deployed', 'Destroyed', 'Decommissioned'),
      defaultValue: 'Available'
    },
    missionSuccessProbability: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: () => Math.floor(Math.random() * 100)
    },
    decommissionedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  });

  return Gadget;
};