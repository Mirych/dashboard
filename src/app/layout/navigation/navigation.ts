import { Component, inject } from '@angular/core';
import { TuiTabs } from '@taiga-ui/kit';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { TuiAppBar } from '@taiga-ui/layout';
import { TuiButton } from '@taiga-ui/core';
import { Auth } from '../../core/services/auth';
import { Router } from '@angular/router';

@Component({
  imports: [TuiTabs, RouterLinkActive, RouterLink, TuiAppBar, TuiButton],
  selector: 'app-navigation',
  styleUrl: './navigation.scss',
  templateUrl: './navigation.html',
})
export class Navigation {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  protected logout(): void {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }
}
