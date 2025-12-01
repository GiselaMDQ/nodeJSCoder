
const express = require("express")
const router = express.Router()

const { filesystem, PRODUCTS_PATH, CARTS_PATH } = require('../filesystem');

router.get("/", async (req, res) => {
  const products = await filesystem.readJSON(PRODUCTS_PATH);
  res.render("home", { products });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await filesystem.readJSON(PRODUCTS_PATH);
  res.render("realTimeProducts", { products });
});




module.exports = router