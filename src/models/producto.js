const { DataTypes } = require("sequelize");
const sequelize = require("./connection");

const Productos = sequelize.define("Productos", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    producto_nombre: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
    producto_descripcion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    precio: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    descuento: {
        type: DataTypes.INTEGER
    },
    sku: {
        type: DataTypes.STRING(30),
        unique: true,
        allowNull: false
    },
    cuotas: {
        type: DataTypes.INTEGER
    },
    imagen_frente: {
        type: DataTypes.STRING(200)
    },
    imagen_dorso: {
        type: DataTypes.STRING(200)
    },
    creacion_fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    licencia_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    categoria_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

const Categoria = sequelize.define("Categoria", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    categoria_nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    categoria_descripcion: {
        type: DataTypes.STRING(255)
    }
});

const Licencia = sequelize.define("Licencia", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    licencia_nombre: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    licencia_descripcion: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    licencia_imagen: {
        type: DataTypes.STRING(255)
    }
});

Categoria.hasMany(Productos, { foreignKey: 'categoria_id' });
Licencia.hasMany(Productos, { foreignKey: "licencia_id" });
Productos.belongsTo(Licencia, { foreignKey: 'licencia_id' });
Productos.belongsTo(Categoria, { foreignKey: 'categoria_id' });

module.exports = {
    Productos,
    Licencia,
    Categoria
};