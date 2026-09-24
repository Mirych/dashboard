import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { TuiButton, TuiDialog, TuiInput, TuiTextfield } from '@taiga-ui/core';
import { TuiToastService } from '@taiga-ui/kit';
import { TuiTable } from '@taiga-ui/addon-table';
import { Products } from '../../core/services/products';
import { Product } from '../../models/product';
import { ProductForm } from '../../features/products/product-form/product-form';
import { Card } from '../../shared/ui/card/card';

@Component({
  selector: 'app-dashboard',
  imports: [TuiButton, TuiDialog, TuiTable, TuiTextfield, ProductForm, TuiInput, Card],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  protected readonly productsService = inject(Products);
  private readonly toast = inject(TuiToastService);

  protected readonly search = signal('');
  protected readonly vatFilter = signal<number | null>(null);

  protected isAddDialogOpen = false;
  protected isDeleteDialogOpen = false;

  protected editingProduct: Product | null = null;
  protected deletingProduct: Product | null = null;

  protected readonly vatOptions = computed(() => {
    const vats = this.productsService.products().map((product) => product.vat);

    return [...new Set(vats)].sort((a, b) => a - b);
  });

  protected readonly filteredProducts = computed(() => {
    const search = this.search().trim().toLowerCase();
    const vat = this.vatFilter();

    return this.productsService.products().filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search);

      const matchesVat = vat === null || product.vat === vat;

      return matchesSearch && matchesVat;
    });
  });

  protected readonly statistics = computed(() => {
    const products = this.filteredProducts();

    const totalPrice = products.reduce((sum, product) => sum + product.price, 0);

    return {
      count: products.length,
      totalPrice,
      averagePrice: products.length ? totalPrice / products.length : 0,
    };
  });

  protected openProductDialog(product: Product | null = null): void {
    this.editingProduct = product;
    this.isAddDialogOpen = true;
  }

  protected saveProduct(formValue: Omit<Product, 'id'>): void {
    const product = this.editingProduct;
    const isEditing = product !== null;

    const success = isEditing
      ? this.productsService.update({
          id: product.id,
          ...formValue,
        })
      : this.productsService.add(formValue);

    if (!success) {
      this.toast
        .open(
          isEditing
            ? `Не удалось изменить товар ${formValue.name}`
            : `Не удалось добавить товар ${formValue.name}`,
          {
            appearance: 'negative',
          },
        )
        .subscribe();

      return;
    }

    this.toast
      .open(
        isEditing
          ? `Товар ${formValue.name} успешно изменён`
          : `Товар ${formValue.name} успешно добавлен`,
        {
          appearance: 'positive',
        },
      )
      .subscribe();

    this.isAddDialogOpen = false;
    this.editingProduct = null;
  }

  protected openDeleteDialog(product: Product): void {
    this.deletingProduct = product;
    this.isDeleteDialogOpen = true;
  }

  protected deleteProduct(): void {
    const product = this.deletingProduct;

    if (!product) {
      return;
    }

    const success = this.productsService.delete(product.id);

    if (!success) {
      this.toast
        .open(`Не удалось удалить товар ${product.name}`, {
          appearance: 'negative',
        })
        .subscribe();

      return;
    }

    this.toast
      .open(`Товар ${product.name} успешно удалён`, {
        appearance: 'positive',
      })
      .subscribe();

    this.isDeleteDialogOpen = false;
    this.deletingProduct = null;
  }
}
