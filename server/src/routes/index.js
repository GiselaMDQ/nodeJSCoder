const express = require ("express")
const router = express.Router()

const productsRouter = require ("./productsRouter")
const cartsRouter = require ("./cartsRouter")
const viewsRouter = require ("./viewsRouter")


function setSocket(io) {
  // Pasar el io a los routers que lo necesiten
  productsRouter.setSocket(io);
}

router.use ("/products",productsRouter.router)
router.use ("/carts",cartsRouter)
router.use("/", viewsRouter); 




module.exports = {router, setSocket}