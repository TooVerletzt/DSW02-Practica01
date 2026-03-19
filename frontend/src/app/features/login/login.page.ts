import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiFeedbackService } from '../../core/http/api-feedback.service';
import { AuthService } from '../../core/auth/auth.service';
import { ApiFeedbackComponent } from '../../shared/components/api-feedback/api-feedback.component';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, ApiFeedbackComponent],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss'
})
export class LoginPage {
  isSubmitting = false;
  readonly form;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly feedbackService: ApiFeedbackService,
    private readonly router: Router
  ) {
    this.form = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.isSubmitting) {
      return;
    }

    this.feedbackService.clear();
    this.isSubmitting = true;

    const { email, password } = this.form.getRawValue();
    this.authService.login(email, password).subscribe({
      next: () => {
        this.isSubmitting = false;
        void this.router.navigate(['/']);
      },
      error: () => {
        this.isSubmitting = false;
        this.feedbackService.showError('Credenciales invalidas. Verifica email y password.');
      }
    });
  }
}
