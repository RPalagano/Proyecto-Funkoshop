const path = require("path"); //Utilizamos este modulo para poder tomar la ruta absoluta y quede mas prolijo
const { Op, Sequelize } = require('sequelize');

const { Productos, Licencia, Categoria } = require("../../src/models/producto");

const index = async (req, res) => {
    const productos = await Productos.findAll({
        attributes: ["id", "producto_nombre", "precio", "cuotas"],
        include: [    
            {
                model: Licencia,
                attributes: ["licencia_nombre"],
                where: { id: { [Op.eq]: Sequelize.col("Productos.licencia_id") } },
                as: 'Licencium'
            }
        ],
        limit: 7
    });
    const licencias = await Licencia.findAll({
        attributes: ["id", "licencia_nombre", "licencia_descripcion", "licencia_imagen"]
    });
    res.render(path.resolve(__dirname, "../views/inicio"), { productos, licencias }); //Como le indicamos que las vistas estan en "src/views" ira ahi y renderizara inicio
};

const shop = async (req, res) => {
    const productos = await Productos.findAll({
        attributes: ["id", "producto_nombre", "precio", "cuotas"],
        include: [    
            {
                model: Licencia,
                attributes: ["licencia_nombre"],
                where: { id: { [Op.eq]: Sequelize.col("Productos.licencia_id") } },
                as: 'Licencium'
            }
        ],
        limit: 9
    });
    res.render(path.resolve(__dirname, "../views/shop"), {productos}); //Como le indicamos que las vistas estan en "src/views" ira ahi y renderizara inicio
};

const item = async (req, res) => {
    const producto_main = await Productos.findByPk(req.params.id, {
        attributes: ["id", "producto_nombre", "producto_descripcion", "precio", "cuotas"],
        include: [    
            {
                model: Licencia,
                attributes: ["licencia_nombre"],
                where: { id: { [Op.eq]: Sequelize.col("Productos.licencia_id") } },
                as: 'Licencium'
            }
        ]
    });
    const productos = await Productos.findAll({
        attributes: ["id", "producto_nombre", "precio", "cuotas"],
        include: [    
            {
                model: Licencia,
                attributes: ["licencia_nombre"],
                where: { id: { [Op.eq]: Sequelize.col("Productos.licencia_id") } },
                as: 'Licencium'
            }
        ],
        where: {
            id: {
              [Op.not]: req.params.id // Filtra los productos cuyo id no es igual al req.params.id
            },
            '$Licencium.licencia_nombre$': producto_main.Licencium.licencia_nombre
        },
        limit: 7
    });
    res.render(path.resolve(__dirname, "../views/item"), { producto_main, productos}); //Como le indicamos que las vistas estan en "src/views" ira ahi y renderizara inicio
};

const carrito = async (req, res) => {
    const producto = await Productos.findByPk(req.params.id, {
        attributes: ["id", "producto_nombre", "producto_descripcion", "precio", "cuotas"],
        include: [    
            {
                model: Licencia,
                attributes: ["licencia_nombre"],
                where: { id: { [Op.eq]: Sequelize.col("Productos.licencia_id") } },
                as: 'Licencium'
            }
        ]
    });
    res.render(path.resolve(__dirname, "../views/carrito"), { producto }); //Como le indicamos que las vistas estan en "src/views" ira ahi y renderizara inicio
};

module.exports = {
    index,
    shop,
    item,
    carrito,
};