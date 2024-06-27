const columns = require('../../public/columns.json');
const transform = require('lodash/transform');
module.exports = ({ DataTypes }) => {
  return {
    model: Object.assign({}, {
      id: {
        type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true
      }, tenantId: {
        type: DataTypes.STRING, allowNull: false
      }, dataFileId: {
        type: DataTypes.UUID, allowNull: false
      }
    }, transform(columns, (result, value) => {
      result[value.name] = {
        type: value.DataType === 'DECIMAL' ? DataTypes.DECIMAL(10, 2) : DataTypes[value.DataType], comment: value.title
      };
    }, {}))
  };
};
