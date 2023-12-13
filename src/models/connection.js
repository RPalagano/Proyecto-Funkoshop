const {Sequelize} = require ("sequelize"); //S mayuscula si o si 
const mysql2 = require('mysql2'); //vercel

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, //S mayuscula si o si
    {
        host: process.env.DB_HOST, dialect: 'mysql', dialectModule: mysql2, //lo ultimo es para usar vercel
    }    
);

module.exports = sequelize;