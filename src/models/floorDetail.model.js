module.exports = (sequelize, DataTypes) => {
  return sequelize.define('FloorDetail', {
    type: DataTypes.STRING, // e.g., basement, ground_floor, floor
    height: DataTypes.INTEGER
  });
};
