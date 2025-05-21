module.exports = (sequelize, DataTypes) => {
  return sequelize.define('ExtraField', {
    harness: DataTypes.STRING,
    c2c: DataTypes.STRING,
    machineBase: DataTypes.STRING,
    overloadSensor: DataTypes.STRING,
    ARD: DataTypes.STRING,
    UPS: DataTypes.STRING
  });
};
