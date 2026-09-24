import { Purchase } from '../models/purchase';

export const INITIAL_PURCHASES: Purchase[] = [
  {
    id: 1,
    productName: 'Ноутбук',
    username: 'test',
    amount: 100000,
    date: '2026-09-20T12:30:00',
  },
  {
    id: 2,
    productName: 'Монитор',
    username: 'test',
    amount: 10000,
    date: '2026-09-21T15:45:00',
  },
  {
    id: 3,
    productName: 'Клавиатура',
    username: 'test',
    amount: 5000,
    date: '2026-09-22T18:10:00',
  },
];
