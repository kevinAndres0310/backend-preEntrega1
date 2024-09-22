import {v4 as uuidv4} from 'uuid';
export class Cart {
  constructor() {
    this.id = uuidv4();
    this.products = [];
  }

  addProduct(product, quantity = 1) {
    const existingProduct = this.products.find(item => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      this.products.push({id: product.id, name: product.title, quantity});
    }

    product.stock -= quantity;
  }
}
