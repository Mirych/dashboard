import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TuiButton, TuiError, TuiIcon, TuiInput, TuiTextfield } from '@taiga-ui/core';
import { Auth } from '../../core/services/auth';
import { TuiPassword, TuiToastService } from '@taiga-ui/kit';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, TuiButton, TuiTextfield, TuiPassword, TuiIcon, TuiInput, TuiError],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly toast = inject(TuiToastService);

  protected readonly form = new FormGroup({
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^[a-zA-Z0-9]+$/),
      ],
    }),
  });

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { username, password } = this.form.getRawValue();

    if (this.auth.login(username, password)) {
      void this.router.navigate(['/dashboard']);
      return;
    }

    this.toast
      .open('Неверный логин или пароль', {
        appearance: 'negative',
      })
      .subscribe();
  }

  protected get errorPassword(): string | null {
    const control = this.form.controls.password;

    if (!control.dirty || !control.errors) {
      return null;
    }

    if (control.hasError('pattern')) {
      return 'Используйте только латинские буквы и цифры';
    }

    if (control.hasError('minlength')) {
      return 'Пароль должен содержать минимум 8 символов';
    }

    return null;
  }
}
