module.exports = (sequelize, DataTypes) => {
  return sequelize.define('dataCompany', {
    id: {
      type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true
    },
    tenantId: {
      type: DataTypes.STRING, allowNull: false
    },
    year: {
      type: DataTypes.STRING, allowNull: false
    },
    tag: DataTypes.STRING,
    serviceFee: DataTypes.DOUBLE,
    recruitmentFee: DataTypes.DOUBLE,
    trainingFee: DataTypes.DOUBLE,
    travelFee: DataTypes.DOUBLE,
    others: DataTypes.JSON,
    dataFileId: {
      type: DataTypes.UUID, allowNull: false
    }
  }, {
    paranoid: true
  });
};
