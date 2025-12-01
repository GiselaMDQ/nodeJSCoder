

//Levanto express
const express = require('express')


// Defino variables para handlebars, routes, path, http, 
const handlebarsEngine = require('express-handlebars');
const routes = require("./routes/index")
const path = require('path');
const http = require ('http')
const { filesystem, PRODUCTS_PATH, CARTS_PATH } = require('./filesystem');




// Defino una instancia de mi servidor
const app = express()

// Configuro los paths, vistas, etc de mi servidor
app.engine('handlebars', handlebarsEngine.engine({ defaultLayout: false }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));




//Server
const {Server} = require('socket.io')
const server = http.createServer(app)
const io = new Server(server)

routes.setSocket(io);

//Defino router
app.use ("/",routes.router)


//Todos los eventos del Socket

io.on ('connection',async (socket) =>{
  //Cuando alguien se conecta
  console.log ("Un usuario conectado")

  //Lista de productos
  const products = await filesystem.readJSON(PRODUCTS_PATH);
  socket.emit("update-products", products);

   // Agregar un productos nuevo
  socket.on("add-product", async (product) => {
    let products = await filesystem.readJSON(PRODUCTS_PATH);

    const id = products.length ? products[products.length - 1].id + 1 : 1;

    const newProduct = {
      id: id,
      ...product
    };

    products.push(newProduct);
    await filesystem.writeJSON(PRODUCTS_PATH, products);

    io.emit("update-products", products); // Actualizar a todos
  });

  // Eliminar un producto
  socket.on("delete-product", async (id) => {
    let products = await filesystem.readJSON(PRODUCTS_PATH);

    products = products.filter(p => p.id != id);

    await filesystem.writeJSON(PRODUCTS_PATH, products);

    io.emit("update-products", products); // Actualizar a todos
  });
})



// Exporto mi servidor
module.exports = server