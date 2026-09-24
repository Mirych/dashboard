import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly authKey = 'isAuthenticated';

  readonly isAuthenticated = signal(localStorage.getItem(this.authKey) === 'true');

  login(username: string, password: string): boolean {
    const isValid = username === 'test' && password === 'Test1234';

    if (isValid) {
      localStorage.setItem(this.authKey, 'true');
      this.isAuthenticated.set(true);
    }

    return isValid;
  }

  logout(): void {
    localStorage.removeItem(this.authKey);
    this.isAuthenticated.set(false);
  }
}
