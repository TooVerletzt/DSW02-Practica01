import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ApiFeedbackComponent } from '../shared/components/api-feedback/api-feedback.component';
import { TopbarComponent } from './topbar.component';
import { SessionService } from '../core/auth/session.service';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ApiFeedbackComponent, TopbarComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent {
  constructor(private readonly sessionService: SessionService) {}

  get isAdmin(): boolean {
    return this.sessionService.hasRole('ADMIN');
  }
}
