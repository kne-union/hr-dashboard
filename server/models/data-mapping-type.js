module.exports = ({DataTypes}) => {
  return {
    model: {
      id: {
        type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true
      },
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
