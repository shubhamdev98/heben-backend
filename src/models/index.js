const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Customer = require('./customer.model')(sequelize, DataTypes);
db.Product = require('./product.model')(sequelize, DataTypes);

// Relationship
db.Customer.hasMany(db.Product, { foreignKey: 'customerId', as: 'products' });
db.Product.belongsTo(db.Customer, { foreignKey: 'customerId', as: 'customer' });

module.exports = db;
