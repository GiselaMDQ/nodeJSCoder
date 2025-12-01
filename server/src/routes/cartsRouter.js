
const express = require("express")
const router = express.Router()
const { filesystem, CARTS_PATH } = require('../filesystem');

//CARTS - Listar los carritos

router.get ('/', async (req,res) => {
    try {
        const carts = await filesystem.readJSON(CARTS_PATH)
        res.status(200).json(carts)

    }
    catch (error) {
        res.status(500).json({error: 'Error, carritos no encontrados'})
    }

})

// CARTS - Obtener un carrito por su ID
router.get('/:id', async (req,res) => {
    try {
        const {id} = req.params
        const carts = await filesystem.readJSON(CARTS_PATH);
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
router.post('/', (req, res) => {
  try {
    const newCart = req.body;

    // Generar ID único (simplemente el siguiente número)
    const id = carts.length ? carts[carts.length - 1].id + 1 : 1;
    newCart.id = id;

    // Agregar al array
    carts.push(newCart);
    filesystem.writeJSON(CARTS_PATH,products)


    res.status(201).json({
      mensaje: 'Carrito agregado con éxito',
      producto: newCart
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el carrito' });
  }
});


//CARTS - Agregar un producto al carrito
router.post('/:cid/products/:pid', async (req, res) => {

    try {
        const {cid} = req.params;
        const {pid} = req.params;
        const carts = await filesystem.readJSON(CARTS_PATH);

      
        const cart = carts.find(c => c.id === Number(cid));
        
        if (!cart) {
             return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        else {
            const products = await filesystem.readJSON(PRODUCTS_PATH);
            const product = products.find(p => p.id === Number(pid));
            
            if (!product) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            else {
                // Verificar si el producto ya está en el carrito
                const prodIndex = cart.products.findIndex(p => p.id === product.id);
                if (prodIndex !== -1) {
                    cart.products[prodIndex].quantity = (cart.products[prodIndex].quantity ?? 0) + 1;
                    await filesystem.writeJSON(CARTS_PATH,carts)
                    return res.status(200).json({ mensaje: 'La cantidad del producto se ha actualizado' });
                }
                else {
                      // Agregar el producto
                        let newProd = {
                            id: product.id,
                            quantity: 1
                        }
                        cart.products.push(newProd);
                        await filesystem.writeJSON(CARTS_PATH,carts)
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

module.exports = router