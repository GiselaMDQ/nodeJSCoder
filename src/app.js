

const express = require('express')
const app = express()
const port = 8080
const fs = require("fs/promises")
const path = require('path')
const DATA_DIR = path.resolve(__dirname, '../../data/');
const PRODUCTS_PATH = path.join(DATA_DIR, 'products.json');
const CARTS_PATH = path.join(DATA_DIR, 'carts.json');


app.use(express.json()); 

// Chequeo SERVIDOR EN PUERTO 8080
app.listen(port, () => {
  console.log(`Mi servidor corriendo en el port ${port}`)
})


//CONFIG FILE SYSTEM

async function readJSON(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw || '[]');
}

async function writeJSON(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}



//PRODUCTOS - Listar productos existentes

app.get ('/products', async (req,res) => {
    try {
       const products = await readJSON(PRODUCTS_PATH);
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({error: 'Error, productos no encontrados'})
    }

})


// PRODUCTOS - Obtener un producto por su ID
app.get('/products/:id', async (req,res) => {
    try {
        const {id} = req.params
        const products = await readJSON(PRODUCTS_PATH);
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
app.post('/product', async (req, res) => {
  try {
    const newProduct = req.body;
    const products =await readJSON(PRODUCTS_PATH)     

    if (!newProduct.title || !newProduct.price) {
      return res.status(400).json({ error: 'Faltan datos del producto' });
    }

    // Generar ID único (simplemente el siguiente número)
    const id = products.length ? products[products.length - 1].id + 1 : 1;
    newProduct.id = id;

    // Agregar al array
    products.push(newProduct);
    await writeJSON(PRODUCTS_PATH,products)

    res.status(201).json({
      mensaje: 'Producto agregado con éxito',
      producto: newProduct
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto' });
  }
});


//PRODUCTS - Actualiza un producto 

app.put ('/product/:id', async (req,res) => {
    const {id} = req.params
    const updatedProduct = req.body

    const products = await readJSON(PRODUCTS_PATH);

    const index = products.findIndex(p => p.id === Number(id));
    
    if (!id || id === null)
        return res.status(400).json({"error":"No se ingresó el ID del producto"})
    else {
        const productIndex = products.findIndex ((p) => p.id === Number(id))
        if (productIndex != -1) {
            products [productIndex] = { ...products[index], ...updatedProduct};
            await writeJSON(PRODUCTS_PATH,products)     
            res.status(200).json({"exito":"Se ha actualizado el producto"})
        }
        else
            res.status(400).json({"error": "Producto no encontrado"})

    }
})

//PRODUCTS - Eliminar un producto de la lista de productos

app.delete('/products/:id', async(req, res) => {
  try {
    const {id} = req.params
    const products = await readJSON(PRODUCTS_PATH);
    
    // Buscar el índice del producto
    const index = products.findIndex(p => p.id === Number(id));

    if (index === -1) {
      return res.status(404).json({ error: 'El producto no se ha encontrado' });
    }

    // Eliminar del array
    const deletedProduct = products.splice(index, 1)[0];
     await writeJSON(PRODUCTS_PATH,products)   

    res.status(200).json({
      mensaje: 'Producto eliminado con éxito',
      producto: deletedProduct
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});

//CARTS - Listar los carritos

app.get ('/carts', async (req,res) => {
    try {
        const carts = await readJSON(CARTS_PATH)
        res.status(200).json(carts)

    }
    catch (error) {
        res.status(500).json({error: 'Error, carritos no encontrados'})
    }

})

// CARTS - Obtener un carrito por su ID
app.get('/carts/:id', async (req,res) => {
    try {
        const {id} = req.params
        const carts = await readJSON(CARTS_PATH);
        let cart = carts.find ((b) => b.id=== Number(id))
        if (cart)
            res.status(200).json(cart)
        else
            res.status(404).json({error: 'Error, no existe el carrito con dicho ID'})
    }
    catch (error) {
        res.status(500).json({error: 'Error en la busqueda de carritos'})
    }
    
})


// CARTS - Agregar un nuevo carrito de compras
app.post('/cart', (req, res) => {
  try {
    const newCart = req.body;

    // Generar ID único (simplemente el siguiente número)
    const id = carts.length ? carts[carts.length - 1].id + 1 : 1;
    newCart.id = id;

    // Agregar al array
    carts.push(newCart);

    res.status(201).json({
      mensaje: 'Carrito agregado con éxito',
      producto: newCart
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el carrito' });
  }
});


//CARTS - Agregar un producto al carrito
app.post('/cart/:cid/product/:pid', async (req, res) => {

    try {
        const {cid} = req.params;
        const {pid} = req.params;
        const carts = await readJSON(CARTS_PATH);

        const cart = carts.find(c => c.id === Number(cid));
        
        if (!cart) {
             return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        else {
            const products = await readJSON(PRODUCTS_PATH);
            const product = products.find(p => p.id === Number(pid));
            
            if (!product) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            else {
                // Verificar si el producto ya está en el carrito
                const prodIndex = cart.products.findIndex(p => p.id === product.id);
                if (prodIndex !== -1) {
                    cart.products[prodIndex].quantity = (cart.products[prodIndex].quantity ?? 0) + 1;
                    await writeJSON(CARTS_PATH,carts)
                    return res.status(200).json({ mensaje: 'La cantidad del producto se ha actualizado' });
                }
                else {
                      // Agregar el producto
                        let newProd = {
                            id: product.id,
                            quantity: 1
                        }
                        cart.products.push(newProd);
                        await writeJSON(CARTS_PATH,carts)
                        return res.status(201).json({
                        mensaje: 'Producto agregado al carrito',
                        cart
                        });
            }

           
        }
        }

       
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al agregar producto al carrito' });
  }
  
});