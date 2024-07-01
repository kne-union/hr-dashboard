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
      serviceFee: DataTypes.DECIMAL(10, 2),
      recruitmentFee: DataTypes.DECIMAL(10, 2),
      trainingFee: DataTypes.DECIMAL(10, 2),
      travelFee: DataTypes.DECIMAL(10, 2)
    }, associate: ({ dataCompany, dataOther }) => {
      dataCompany.hasMany(dataOther);
    }
  };
};
