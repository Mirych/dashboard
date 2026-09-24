import { ChangeDetectionStrategy, Component, input, output, effect } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiInput, TuiTextfield } from '@taiga-ui/core';
import { TuiInputNumber } from '@taiga-ui/kit';
import { Product } from '../../../models/product';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, TuiButton, TuiTextfield, TuiInputNumber, TuiInput],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductForm {
  constructor() {
    effect(() => {
      const product = this.product();

      this.form.reset({
        name: product?.name ?? '',
        price: product?.price ?? 0,
        vat: product?.vat ?? 20,
      });
    });
  }

  readonly product = input<Product | null>(null);

  readonly save = output<Omit<Product, 'id'>>();

  protected readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    price: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    vat: new FormControl(20, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
  });

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.save.emit(this.form.getRawValue());
  }
}
