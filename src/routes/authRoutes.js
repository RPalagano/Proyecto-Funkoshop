const express = require("express");
const { Model } = require("sequelize");
const router = express.Router();

const model = require("../models/user");

const { body}  = require("express-validator");

const controller = require("../controllers/authController");

const registerValidations = [ // para registrarse debe cumplir con todo esto
    body("email")
    .isEmail().withMessage("Ingrese una dirección de correo electrónico válida") //tiene que ser un email
    .bail()
    .custom((value, {req}) => { //Siempre que sea una validacion custom debe devolver una promesa
        return new Promise(async (resolve, reject) => { //Una promesa porque vamos a acceder a la base de datos y demora un ratito, necesita la promesa para esperar
            try {
                const user = await model.findOne({ //buscar usuario que coincida con ese email
                    where: {email: value,},  
                });
            
                if(user){
                    console.log(user);
                    return reject(); //si hay uno hago un reject, ya existe
                } else {
                    return resolve();
                } 
            } catch (error){
                console.log(error);
            }
        });
    })
    .withMessage("Dirección de correo electrónico duplicada"), 
    body("password")
    .isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
    .withMessage("La contraseña debe tener...")
    .bail()
    .custom((value, {req}) => value === req.body.password_confirmation)
    .withMessage("Las contraseñas no coinciden"),
];
    
const loginValidations = [ // para registrarse debe cumplir con todo esto
    body("email")
    .isEmail().withMessage("Ingrese una dirección de correo electrónico válida"), //tiene que ser un email
    body("password")
    .isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
    .withMessage("La contraseña debe tener...")
];

router.get("/register", controller.register);
router.post("/register", registerValidations, controller.postRegister);

router.get("/login", controller.login);
router.post("/login", loginValidations, controller.postLogin);

router.get("/logout", controller.logout); 

module.exports = router;