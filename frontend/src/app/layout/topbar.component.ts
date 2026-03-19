import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth/auth.service';
import { SessionService } from '../core/auth/session.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
    private readonly router: Router
  ) {}

  get email(): string {
    return this.sessionService.session?.email ?? '';
  }

  get role(): string {
    return this.sessionService.session?.role ?? '';
  }

  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }
}
