module.exports = ({DataTypes}) => {
  return {
    model: {
      label: {
        type: DataTypes.STRING, allowNull: false
      }, value: {
        type: DataTypes.STRING, allowNull: false
      }, type: {
        type: DataTypes.STRING, allowNull: false
      }
    }, options: {
      indexes: [{
        unique: true, fields: ['value', 'type', 'deleted_at']
      }]
    }, associate: ({ dataMapping, dataMappingType }) => {
      dataMapping.belongsTo(dataMappingType, { foreignKey: 'type', targetKey: 'value' });
    }
  };
};
