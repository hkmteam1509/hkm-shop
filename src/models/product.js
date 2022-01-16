const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('product', {
    proID: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    proName: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    proSlug: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    fullDescription: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    sold: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    catID: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'category',
        key: 'catID'
      }
    },
    brandID: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'brand',
        key: 'brandID'
      }
    },
    sex: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    isFeature: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    views: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'product',
    timestamps: true,
    paranoid: true,
    timestamp: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "proID" },
        ]
      },
      {
        name: "fk_product_cat",
        using: "BTREE",
        fields: [
          { name: "catID" },
        ]
      },
      {
        name: "fk_product_brand",
        using: "BTREE",
        fields: [
          { name: "brandID" },
        ]
      },
    ]
  });
};
