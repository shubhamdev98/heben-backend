module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Customer', {
    firstName: DataTypes.STRING,
    siteName: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING
  });
};
