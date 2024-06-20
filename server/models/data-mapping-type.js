module.exports = (sequelize, DataTypes) => {
  return sequelize.define('dataMappingType', {
    value: {
      type: DataTypes.STRING, primaryKey: true
    }, label: {
      type: DataTypes.STRING, allowNull: false
    }
  }, {
    paranoid: true, indexes: [{
      unique: true, fields: ['value', 'deletedAt']
    }]
  });
};
