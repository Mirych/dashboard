import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Storage {
  get<T>(key: string): T | null {
    try {
      const value = localStorage.getItem(key);

      return value ? (JSON.parse(value) as T) : null;
    } catch (error) {
      console.error('Ошибка чтения:', error);

      return null;
    }
  }

  set<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));

      return true;
    } catch (error) {
      console.error('Ошибка записи:', error);

      return false;
    }
  }

  remove(key: string): boolean {
    try {
      localStorage.removeItem(key);

      return true;
    } catch (error) {
      console.error('Ошибка удаления', error);

      return false;
    }
  }
}
