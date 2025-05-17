module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Product', {
    liftType: DataTypes.STRING,
    ml_mr: DataTypes.STRING,
    floor: DataTypes.STRING,
    floorHeight: DataTypes.STRING,
    shaftSize: DataTypes.STRING,
    passenger: DataTypes.STRING,
    doorOperation: DataTypes.STRING,
    door: DataTypes.STRING,
    opening: DataTypes.STRING
  });
};
