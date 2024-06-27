module.exports = ({ DataTypes }) => {
  return {
    model: {
      id: {
        type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true
      }, name: {
        type: DataTypes.STRING, allowNull: false
      }, fee: {
        type: DataTypes.DECIMAL, allowNull: false
      }
    }
  };
};
