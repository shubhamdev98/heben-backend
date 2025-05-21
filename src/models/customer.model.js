module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Customer', {
    clientName: DataTypes.STRING,
    companyName: DataTypes.STRING,
    siteName: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING
  });
};
