
const express = require("express")
const router = express.Router()
const { filesystem, PRODUCTS_PATH } = require('../filesystem');
//const { io } = require('../app');

let io = null;
function setSocket(socket) {
  io = socket;
}



router.get ('/', async (req,res) => {
    try {
       const products = await filesystem.readJSON(PRODUCTS_PATH);
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({error: 'Error, productos no encontrados'})
    }

})


// PRODUCTOS - Obtener un producto por su ID
router.get('/:id', async (req,res) => {
    try {
        const {id} = req.params
        const products = await filesystem.readJSON(PRODUCTS_PATH);
        let product = products.find ((b) => b.id=== Number(id))
        if (product)
            res.status(200).json(product)
        else
            res.status(404).json({error: 'Error, no existe el producto con dicho ID'})
    }
    catch (error) {
        res.status(500).json({error: 'Error en la busqueda de productos'})
    }
    
})

// PRODUCTOS - Agregar un nuevo un producto
router.post('/', async (req, res) => {
  console.log("📩 Llegó un POST a /products");
  console.log("Body recibido:", req.body);
  try {
    const newProduct = req.body;
    const products =await filesystem.readJSON(PRODUCTS_PATH)     

    if (!newProduct.title || !newProduct.price) {
      return res.status(400).json({ error: 'Faltan datos del producto' });
    }

    // Generar ID único 
    const id = products.length ? products[products.length - 1].id + 1 : 1;
    newProduct.id = id;

    // Agregar al array
    products.push(newProduct);
    await filesystem.writeJSON(PRODUCTS_PATH,products)
    
    if (io)
      io.emit("update-products", products);

    res.status(201).json({
      mensaje: 'Producto agregado con éxito',
      producto: newProduct
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto' });
  }
});


//PRODUCTS - Actualiza un producto 

router.put ('/:id', async (req,res) => {
    const {id} = req.params
    const updatedProduct = req.body

    const products = await filesystem.readJSON(PRODUCTS_PATH);

    const index = products.findIndex(p => p.id === Number(id));
    
    if (!id || id === null)
        return res.status(400).json({"error":"No se ingresó el ID del producto"})
    else {
        const productIndex = products.findIndex ((p) => p.id === Number(id))
        if (productIndex != -1) {
            products [productIndex] = { ...products[index], ...updatedProduct};
            await filesystem.writeJSON(PRODUCTS_PATH,products)     
            res.status(200).json({"exito":"Se ha actualizado el producto"})
        }
        else
            res.status(400).json({"error": "Producto no encontrado"})

    }
})

//PRODUCTS - Eliminar un producto de la lista de productos

router.delete('/:id', async(req, res) => {
  try {
    const {id} = req.params
    const products = await filesystem.readJSON(PRODUCTS_PATH);
    
    // Buscar el índice del producto
    const index = products.findIndex(p => p.id === Number(id));

    if (index === -1) {
      return res.status(404).json({ error: 'El producto no se ha encontrado' });
    }

    // Eliminar del array
    const deletedProduct = products.splice(index, 1)[0];
     await filesystem.writeJSON(PRODUCTS_PATH,products)   

    if (io)
      io.emit("update-products", products);

    res.status(200).json({
      mensaje: 'Producto eliminado con éxito',
      producto: deletedProduct
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

module.exports = {router, setSocket}