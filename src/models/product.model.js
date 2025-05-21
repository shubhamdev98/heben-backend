module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Product', {
    liftType: DataTypes.STRING,
    ml_mr: DataTypes.STRING,
    shaftSize: DataTypes.STRING,
    passenger: DataTypes.STRING,
    capacity: DataTypes.STRING,
    doorOperation: DataTypes.STRING,
    door_type: DataTypes.STRING,
    opening: DataTypes.STRING,
    machine: DataTypes.STRING,
    cabin: DataTypes.STRING,
    bracket_combination: DataTypes.STRING,
    quotation_number: DataTypes.STRING,
    note: DataTypes.TEXT,
    basement: DataTypes.INTEGER,
    ground_floor: DataTypes.INTEGER,
    floor: DataTypes.INTEGER,
    floor_string: DataTypes.STRING,
    total_floor: DataTypes.INTEGER
  });
};
