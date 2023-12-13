const express = require("express"); //Modulo externo, lo tengo que requerir para poder usarlo (requiero express)
const router = express.Router(); //Poner R mayuscula si o si
const multer = require("multer"); //Para poder utilizar enctype="multipart/form-data"
const upload = multer({storage: multer.memoryStorage()}); //Donde se va a guardar, va a subir esa imagen. Va a agarrar ese archivo y lo va a dejar disponible en memoria.
const { body } =  require("express-validator");

const validations =[
    body("nombre")
        .not().isEmpty().withMessage("El nombre es obligatorio") //No tiene que estar vacio y si lo esta muestra ese mensaje
        .bail().isLength({min: 3}).withMessage("Tiene que tener al menos 3 caracteres"), 
];

const controller = require("../../controllers/admin/productosController"); //requiere usar ese archivo

router.get('/', controller.index); //llama a la funcion de la pagina principal (trae todo los productos)
//router.get('/:d', controller.show); //

router.get('/create', controller.create); //Debemos poner primero la de create porque al poner /create lo toma como un id e ingresa directamente en show
router.post('/', upload.array("imagen", 2), validations, controller.store); //Antes de crear el producto procesa la imagen. Esa imagen dejamela en memoria para que yo la pueda usar. Buffer de memoria.
//upload.fields([{name: "funko"}, {name: "caja" }])

router.get('/:id/edit', controller.edit);
router.put('/:id', upload.single("imagen"), validations, controller.update);

router.delete('/:id', controller.destroy); //

module.exports = router;