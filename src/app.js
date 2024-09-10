import express from 'express';
import productsRouter from './routes/products.router.js';
import cartRouter from './routes/carts.router.js';

const app = express();
const port = 8080;

//Iniciarlizar el servidor
app.listen(port, () => {
  console.log(`server listening in port ${port}`);
});

//Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Implementar los routers
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
