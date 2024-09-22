import express from 'express';
import handlebars from 'express-handlebars';
import {Server} from 'socket.io';
import __dirname from './dirname.js';
import productsRouter, {
  products,
  saveProducts,
} from './routes/products.router.js';
import cartRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import {v4 as uuidv4} from 'uuid';

const app = express();
const httpServer = app.listen(8080, () => {
  console.log('Listening in Port 8080');
});
const io = new Server(httpServer);

//Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Config Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public'));

//Implementar los routers
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/views', viewsRouter);

io.on('connection', socket => {
  console.log('Nuevo cliente conectado');

  socket.on('createProduct', product => {
    product.id = uuidv4();

    products.push(product);
    io.emit('newProduct', products);
    saveProducts();
  });

  socket.on('deleteProduct', productId => {
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex !== -1) {
      products.splice(productIndex, 1);

      saveProducts();

      io.emit('newProduct', products);
    }
  });
});
