const { Sequelize, DataTypes } = require('sequelize');
const dbConfig = require('../config');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  logging: false
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Customer = require('./customer.model')(sequelize, DataTypes);
db.Product = require('./product.model')(sequelize, DataTypes);
db.FloorDetail = require('./floorDetail.model')(sequelize, DataTypes);
db.SelectedExtra = require('./selectedExtra.model')(sequelize, DataTypes);
db.ExtraField = require('./extraField.model')(sequelize, DataTypes);


// Relations
db.Customer.hasMany(db.Product, { foreignKey: 'customerId', as: 'products' });
db.Product.belongsTo(db.Customer, { foreignKey: 'customerId', as: 'customer' });

db.Product.hasMany(db.FloorDetail, { foreignKey: 'productId', as: 'floorDetails' });
db.FloorDetail.belongsTo(db.Product, { foreignKey: 'productId' });

db.Product.hasMany(db.SelectedExtra, { foreignKey: 'productId', as: 'selectedExtras' });
db.SelectedExtra.belongsTo(db.Product, { foreignKey: 'productId' });

db.Product.hasOne(db.ExtraField, { foreignKey: 'productId', as: 'extraField' });
db.ExtraField.belongsTo(db.Product, { foreignKey: 'productId' });

module.exports = db;
