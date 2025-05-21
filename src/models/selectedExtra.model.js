module.exports = (sequelize, DataTypes) => {
  return sequelize.define('SelectedExtra', {
    name: DataTypes.STRING
  });
};
