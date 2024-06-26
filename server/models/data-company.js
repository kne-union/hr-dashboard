module.exports = ({ DataTypes }) => {
  return {
    model: {
      id: {
        type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true
      },
      tenantId: {
        type: DataTypes.STRING, allowNull: false
      },
      year: {
        type: DataTypes.STRING, allowNull: false
      },
      tag: DataTypes.STRING,
      serviceFee: DataTypes.DECIMAL,
      recruitmentFee: DataTypes.DECIMAL,
      trainingFee: DataTypes.DECIMAL,
      travelFee: DataTypes.DECIMAL,
      others: DataTypes.JSON,
      dataFileId: {
        type: DataTypes.UUID, allowNull: false
      }
    }
  };
};
