const socket = io();

socket.on('connect', () => {
  console.log('Conectado al servidor de Socket.IO');
});

const form = document.getElementById('productForm');

form.addEventListener('submit', e => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const code = document.getElementById('code').value;
  const price = document.getElementById('price').value;
  const stock = document.getElementById('stock').value;
  const category = document.getElementById('category').value;

  const product = {
    title,
    description,
    code,
    price,
    stock,
    category,
  };

  socket.emit('createProduct', product);

  form.reset();
});

// Mostrar los productos agregados
socket.on('newProduct', products => {
  const productList = document.getElementById('productList');

  productList.innerHTML = '';

  products.forEach(product => {
    const productElement = document.createElement('div');
    productElement.className = 'product';

    productElement.innerHTML = `
  <h2>Producto: ${product.title}</h2>
  <p><strong>Descripción:</strong> ${product.description}</p>
  <p><strong>Código:</strong> ${product.code}</p>
  <p><strong>Precio:</strong> $${product.price}</p>
  <p><strong>Stock disponible:</strong> ${product.stock}</p>
  <p><strong>Categoría:</strong> ${product.category}</p>
  <button class="delete-button" data-product-id="${product.id}">Borrar</button> 
  <hr/>
`;

    productList.appendChild(productElement);
  });
});

productList.addEventListener('click', event => {
  if (event.target.classList.contains('delete-button')) {
    const productId = event.target.dataset.productId;

    socket.emit('deleteProduct', productId);
  }
});
