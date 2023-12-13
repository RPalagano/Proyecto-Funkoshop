const fs = require("fs");
const sharp = require("sharp");
const path = require("path"); //Utilizamos este modulo para poder tomar la ruta absoluta y quede mas prolijo
const { validationResult } =  require("express-validator"); //Valida el resultado de la peticion
const { Op, Sequelize } = require('sequelize');

const { Productos, Licencia, Categoria } = require("../../models/producto");

const index = async (req, res) => {
    try{
        const productos = await Productos.findAll({
            attributes: ["id", "sku", "producto_nombre"],
            include: [
                {
                    model: Licencia,
                    attributes: ["licencia_nombre"],
                    where: { id: { [Op.eq]: Sequelize.col("Productos.licencia_id") } },
                    as: 'Licencium'
                }
            ]
        });
        res.render("admin/index", { productos });
    } catch (error){
        console.log(error);
        res.status(500).send(error);
    }
};

const show = (req, res) => {
    console.log(req.body, req.params);
    res.send('Admin: Detalle del Producto');
};

const create = async (req, res) => { //Va al formulario para crear el producto
    try {
        const categorias = await Categoria.findAll({
            attributes: ["id", "categoria_nombre"]
        });
        const licencias = await Licencia.findAll({
            attributes: ["id", "licencia_nombre"]
        });
        res.render("admin/create", {categorias, licencias});
    } catch(error) {
        console.log(error);
        res.status(500).send(error);
    }
};

const store = async (req, res) => { //Crea el producto
    console.log(req.body, req.file);
    // const errors = validationResult(req);

    // if(!errors.isEmpty()){ //si errores es distinto de vacio
    //     return res.render("admin/create",{ //vuelve a la pag del formulario
    //         values: req.body, //para que no se borre lo que escribio el usuario si es erroneo
    //         errors: errors.array(), //paso los errores en formato array
    //     });
    // }

    try{
        const producto = await Productos.create(req.body)

        if(req.files){ //Si tengo el archivo de la imagen continuo
            await sharp(req.files[0].buffer).resize(300).png({ transparent: true }).toFile(path.resolve(__dirname,`../../../public/uploads/producto_${producto.id}.png`));
            await sharp(req.files[1].buffer).resize(300).png({ transparent: true }).toFile(path.resolve(__dirname,`../../../public/uploads/producto_back_${producto.id}.png`));
        }
        res.redirect("/admin/productos");
    } catch(error){
        console.log(error);
        res.send(error);
    }
};

const edit = async (req, res) => { //busca el producto y lo muestra para editarlo
    try{
        const producto = await Productos.findByPk(req.params.id, {
            include: [
                {
                    model: Licencia,
                    attributes: ['licencia_nombre'],
                    where: { id: { [Op.eq]: Sequelize.col('Productos.licencia_id') } },
                    as: 'Licencium'
                },
                {
                    model: Categoria,
                    attributes: ['categoria_nombre'],
                    where: { id: { [Op.eq]: Sequelize.col('Productos.categoria_id') } },
                    as: 'Categorium'
                }
            ]
        }); //busca el producto a traves del pk (id) en req.id
        const categorias = await Categoria.findAll({
            attributes: ["id", "categoria_nombre"]
        });
        const licencias = await Licencia.findAll({
            attributes: ["id", "licencia_nombre"]
        });
        if (producto){ //si esta el producto
            res.render('admin/edit', { producto, categorias, licencias }); //me renderiza la pagina de ese producto para poder editar
        }else{ //si no esta el producto
            res.status(404).send("No existe el producto"); //muestra este error
        }
    } catch (error){
        console.log(error);
        res.status(500).send(error);
    }
};

const update = async (req, res) => { //Actualiza el producto
    console.log(req.body, req.params);

    // const errors = validationResult(req);

    // if(!errors.isEmpty()){ //si errores es distinto de vacio
    //     return res.render("admin/create",{ //vuelve a la pag del formulario
    //         values: req.body, //para que no se borre lo que escribio el usuario si es erroneo
    //         errors: errors.array(), //paso los errores en formato array
    //     });
    // }

    try {
        const producto = await Productos.update(req.body, {where:{ id: req.params.id }}) //Quiero hacer una actualizacion del cuerpo de la peticion en ese id
        //console.log(producto);

        if(req.files){ //Si tengo el archivo de la imagen continuo
            await sharp(req.files[0].buffer).resize(300).png({ transparent: true }).toFile(path.resolve(__dirname,`../../../public/uploads/producto_${producto.id}.png`));
            await sharp(req.files[1].buffer).resize(300).png({ transparent: true }).toFile(path.resolve(__dirname,`../../../public/uploads/producto_back_${producto.id}.png`)); 
        }
        res.redirect("/admin/productos");
    } catch (error){
        console.log(error);
        res.send(error);
    }

};

const destroy = async(req, res) => {
    try{
        const destroyed = await Productos.destroy({ where: {id: req.params.id}});
        //console.log(destroyed);

        if (destroyed == 1){
            fs.unlink(path.resolve(__dirname,`../../../public/uploads/producto_${req.params.id}.jpg`), //Para borrar la foto
            (error) => {
                if(error){
                    console.log(error);
                }
            }   
            ); 
        }
        res.redirect("/admin/productos");
    } catch (error){  
        console.log(error);
        res.send(error);
    }
};


module.exports = {
    index,
    show,
    create,
    store,
    edit,
    update,
    destroy 
};

