import { inject, Injectable, signal } from '@angular/core';
import { INITIAL_PURCHASES } from '../../data/purchase';
import { Purchase } from '../../models/purchase';
import { Storage } from './storage';

@Injectable({
  providedIn: 'root',
})
export class Purchases {
  private readonly storage = inject(Storage);
  private readonly storageKey = 'purchases';
  private readonly storedPurchases = this.storage.get<Purchase[]>(this.storageKey);

  readonly purchases = signal<Purchase[]>(this.storedPurchases ?? INITIAL_PURCHASES);

  constructor() {
    if (!this.storedPurchases) {
      this.storage.set(this.storageKey, INITIAL_PURCHASES);
    }
  }
}
