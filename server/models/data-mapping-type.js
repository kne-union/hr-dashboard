module.exports = ({DataTypes}) => {
  return {
    model: {
      value: {
        type: DataTypes.STRING, primaryKey: true
      }, label: {
        type: DataTypes.STRING, allowNull: false
      }
    }, options: {
      indexes: [{
        unique: true, fields: ['value', 'deleted_at']
      }]
    }
  };
};
