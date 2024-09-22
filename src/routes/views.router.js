import {Router} from 'express';
import {products} from './products.router.js';

const router = Router();

router.get('/home', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const arrProductsLimits = products.slice(0, limit);
  res.render('home', {arrProductsLimits});
});

router.get('/realTimeProducts', (req, res) => {
  res.render('realTimeProducts', {products});
});

router.get('/home/:pid', (req, res) => {
  const id = req.params.pid;
  const productById = products.find(product => product.id === id);

  res.render('singleUser', {product: productById});
});

export default router;
