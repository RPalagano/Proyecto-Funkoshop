require("dotenv").config(); //para usar las variables en .env

const express = require("express"); //Modulo externo, lo tengo que requerir para poder usarlo (requiero express)
const app = express(); //Creo una instancia de express, lo ejecuto y le asigno el resultado a esa variable
const methodOverride = require("method-override"); //Requerimos este middleware porque necesitamos que nuestro formulario tome el metodo put
const path = require("path"); //Utilizamos este modulo para poder tomar la ruta absoluta y quede mas prolijo
const sequelize = require("./src/models/connection");

//const session = require("express-session"); //para mantener la sesion iniciada

//app.use(
//    session({
//       secret: "S3cr3t01",
//        resave: false,
//        saveUninitialized: false,
//    })
//);

const session = require("cookie-session"); //para mantener la sesion iniciada pero no se cierra aunque se apague el servidor

app.use(
   session({
      keys: ["S3cr3t01", "S3cr3t02"],
   })
);


const isLogin = (req, res, next) => { //Si no esta logeado cuando intente ingresar a una ruta le va a pedir que loguee
    if(!req.session.userId){
        return res.redirect("/login");
    }

    next();
}

app.set("view engine", "ejs"); //Vamos a setearlo para que sea nuestro motor de vistas. Esto automaticamente requiere el modulo para usarlo, no hace falta hacer un require.
app.set("views", path.join(__dirname, "/src/views")); //Seteamos donde esta las vistas

app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method")); //Lo utilizamos para hacer una sobreescritura de ese metodo. Es decir, ese metodo que se envia por post cuando llegue a la ruta sea un put

app.use(express.urlencoded({extended: false})); //Middlewar que permite obtener la información de un formulario. false: formulario simple
app.use(express.json()); //Middlewar que permite obtener la información de un json.

app.use(require("./src/routes/authRoutes"));

const mainRoutes = require("./src/routes/mainRoutes");
app.use(mainRoutes);

app.use("/admin/productos", isLogin, require("./src/routes/admin/productosRoutes"));
app.use(express.static("public")); //Si el archivo que busca está dentro de public le devuelve ese archivo. La diferencia que para que te muestre deberás poner /nosotros.html.

app.use((req, res, next) => {
    res.status(404).send("Ruta no encontrada");
});

const PORT = process.env.PORT; //Se guarda en una variable porque después vamos a obtener un puerto a través de lo que me de el servidor

app.listen(PORT, async () => {
    try{
        await sequelize.authenticate();
    } catch (error){
        console.log(error); //para ver si surge algun error
    }
    console.log(`http://localhost:${PORT}`); //El server escucha a través de un puerto. Respetar ese tipo de comillas (bastics o acento grave).
});


