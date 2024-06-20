module.exports = (sequelize, DataTypes) => {
  const dataMapping = sequelize.define('dataMapping', {
    label: {
      type: DataTypes.STRING, allowNull: false
    }, value: {
      type: DataTypes.STRING, allowNull: false
    }, type: {
      type: DataTypes.STRING, allowNull: false
    }
  }, {
    paranoid: true, indexes: [{
      unique: true, fields: ['value', 'type', 'deletedAt']
    }]
  });

  dataMapping.associate = ({ dataMapping, dataMappingType }) => {
    dataMapping.belongsTo(dataMappingType, { foreignKey: 'type', targetKey: 'value' });
  };
  return dataMapping;
};
