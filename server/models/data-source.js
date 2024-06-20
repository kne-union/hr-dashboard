const columns = require('../../public/columns.json');
const transform = require('lodash/transform');
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('dataSource', Object.assign({}, {
    id: {
      type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true
    }, tenantId: {
      type: DataTypes.STRING, allowNull: false
    }, dataFileId: {
      type: DataTypes.UUID, allowNull: false
    }
  }, transform(columns, (result, value) => {
    result[value.name] = {
      type: DataTypes[value.DataType]
    };
  }, {})), {
    paranoid: true
  });
};
