const { DataTypes } = require("sequelize");
const sequelize = require("./connection");
const bcryptjs = require("bcryptjs");

const Usuario = sequelize.define("Usuario", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(16),
        allowNull: false
    },
    apellido: {
        type: DataTypes.STRING(80),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNMull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING(),
        allowNMull: false,
    },
    creacion_fecha: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
});

Usuario.beforeSave(async (user, options) => { //antes que el usuario se guarde en la base de datos quiero que los hashees para encriptar la clave
    const {password} = user;

    const hash = await bcryptjs.hash(password, 8); //lo da vueltas 8 veces, no se puede revertir

    user.password = hash;
});

module.exports = Usuario;