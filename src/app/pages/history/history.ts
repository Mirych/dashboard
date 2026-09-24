import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TuiTable } from '@taiga-ui/addon-table';
import { Purchases } from '../../core/services/purchases';

@Component({
  selector: 'app-history',
  imports: [DatePipe, TuiTable],
  templateUrl: './history.html',
  styleUrl: './history.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class History {
  protected readonly purchasesService = inject(Purchases);
}
