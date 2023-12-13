const express = require("express"); //Modulo externo, lo tengo que requerir para poder usarlo (requiero express)
const router = express.Router(); //Poner R mayuscula si o si

const controller = require("../controllers/mainController"); //requiere usar ese archivo

router.get('/', controller.index); //llama a la funcion de la pagina principal

router.get('/shop', controller.shop); //llama a la funcion de la pagina de shop

router.get('/:id/item', controller.item); //llama a la funcion de la pagina de item

router.get('/:id/carrito', controller.carrito); //llama a la funcion de la pagina del carrito

module.exports = router;