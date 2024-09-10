import {Router} from 'express';
import {Product} from '../models/product.js';
import fs from 'fs';
import path from 'path';

const router = Router();
const __dirname = path.resolve();
const productsFilePath = path.join(__dirname, './src/data/products.json');

export let products = [];

export function saveProducts() {
  try {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
  } catch (error) {
    console.error('Error al guardar los productos en el archivo:', error);
  }
}

try {
  const data = fs.readFileSync(productsFilePath, 'utf8');
  products = JSON.parse(data);
} catch (error) {
  console.error(error);
}

router.get('/', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const arrProductsLimits = products.slice(0, limit);
  res.json(arrProductsLimits);
});

router.get('/:pid', (req, res) => {
  const id = req.params.pid;
  const productById = products.find(product => product.id === id);
  res.json(productById);
});

router.post('/', (req, res) => {
  const {title, description, code, price, status, stock, category, thumbnails} =
    req.body;

  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({message: 'Complete todos los campos'});
  }
  const newProduct = new Product(
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails,
  );

  products.push(newProduct);
  saveProducts();

  res.status(201).json(newProduct);
});

router.put('/:pid', (req, res) => {
  const id = req.params.pid;
  const updatedData = req.body;
  const productIndex = products.findIndex(product => product.id === id);

  if (productIndex === -1) {
    return res.status(404).json({error: 'Producto no encontrado'});
  }

  const updatedProduct = {...products[productIndex], ...updatedData};
  products[productIndex] = updatedProduct;
  saveProducts();

  res.json(updatedProduct);
});

router.delete('/:pid', (req, res) => {
  const id = req.params.pid;
  const productIndex = products.findIndex(product => product.id === id);

  if (productIndex === -1) {
    return res.status(404).json({error: 'Producto no encontrado'});
  }

  // Eliminar el producto del array
  const deletedProduct = products.splice(productIndex, 1)[0];
  saveProducts();

  res.json({
    message: 'Producto eliminado con exito',
    productId: deletedProduct.id,
  });
});

export default router;
