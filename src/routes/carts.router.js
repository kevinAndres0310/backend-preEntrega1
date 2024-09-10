import {Router} from 'express';
import {products} from './products.router.js';
import {Cart} from '../models/cart.js';
import fs from 'fs';
import path from 'path';
import {saveProducts} from './products.router.js';

const router = Router();
const __dirname = path.resolve();
const productsFilePath = path.join(__dirname, './src/data/carts.json');

let carts = [];

function saveCarts() {
  try {
    fs.writeFileSync(productsFilePath, JSON.stringify(carts, null, 2));
  } catch (error) {
    console.error(error);
  }
}

try {
  const data = fs.readFileSync(productsFilePath, 'utf8');
  const parsedCarts = JSON.parse(data);

  // Reconstruir las instancias de Cart
  carts = parsedCarts.map(cartData => {
    const cart = new Cart();
    cart.id = cartData.id;
    cart.products = cartData.products;
    return cart;
  });
} catch (error) {
  console.error(error);
}

router.post('/', (req, res) => {
  const newCart = new Cart();
  carts.push(newCart);
  saveCarts();
  res.status(201).json(newCart);
});

router.get('/:cid', (req, res) => {
  const id = req.params.cid;
  const cartById = carts.find(cart => cart.id === id);

  if (!cartById) {
    return res.status(404).json({error: 'Carrito no encontrado'});
  }

  res.json(cartById.products);
});

router.post('/:cid/product/:pid', (req, res) => {
  const cartID = req.params.cid;
  const productID = req.params.pid;
  const quantityToAdd = req.body.quantity || 1;

  const product = products.find(prod => prod.id === productID);
  const cart = carts.find(c => c.id === cartID);

  if (!cart) {
    return res.status(404).json({error: 'Carrito no encontrado'});
  }

  if (!product) {
    return res.status(404).json({error: 'Producto no encontrado'});
  }

  if (quantityToAdd > product.stock) {
    return res.status(400).json({error: 'No hay suficiente stock disponible'});
  }

  cart.addProduct(product, quantityToAdd);
  saveCarts();
  saveProducts();

  res.status(201).json(cart);
});

router.get('/', (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  const arrCartsLimits = carts.slice(0, limit);
  res.json(arrCartsLimits);
});

export default router;
