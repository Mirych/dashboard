import { inject, Injectable, signal } from '@angular/core';
import { INITIAL_PRODUCTS } from '../../data/products';
import { Product } from '../../models/product';
import { Storage } from './storage';

@Injectable({
  providedIn: 'root',
})
export class Products {
  private readonly storage = inject(Storage);
  private readonly storageKey = 'products';

  private readonly storedProducts = this.storage.get<Product[]>(this.storageKey);

  readonly products = signal<Product[]>(
    this.storage.get<Product[]>(this.storageKey) ?? INITIAL_PRODUCTS,
  );

  constructor() {
    if (!this.storedProducts) {
      this.save(INITIAL_PRODUCTS);
    }
  }

  add(product: Omit<Product, 'id'>): boolean {
    const products = this.products();

    const id = products.length ? Math.max(...products.map((item) => item.id)) + 1 : 1;

    const updatedProducts = [
      ...products,
      {
        id,
        ...product,
      },
    ];

    if (!this.save(updatedProducts)) {
      return false;
    }

    this.products.set(updatedProducts);

    return true;
  }

  update(product: Product): boolean {
    const updatedProducts = this.products().map((item) =>
      item.id === product.id ? product : item,
    );

    if (!this.save(updatedProducts)) {
      return false;
    }

    this.products.set(updatedProducts);

    return true;
  }

  delete(id: number): boolean {
    const updatedProducts = this.products().filter((product) => product.id !== id);

    if (!this.save(updatedProducts)) {
      return false;
    }

    this.products.set(updatedProducts);

    return true;
  }

  private save(products: Product[]): boolean {
    return this.storage.set(this.storageKey, products);
  }
}
