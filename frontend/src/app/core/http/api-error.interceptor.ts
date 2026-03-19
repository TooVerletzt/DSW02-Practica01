import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ApiErrorResponse } from '../../shared/models/api-error.model';
import { SessionService } from '../auth/session.service';
import { ApiFeedbackService } from './api-feedback.service';

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const sessionService = inject(SessionService);
  const feedbackService = inject(ApiFeedbackService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const payload = error.error as ApiErrorResponse | undefined;
      const backendMessage = payload?.message ?? 'Error inesperado al comunicarse con backend';

      if (error.status === 401) {
        feedbackService.showError('Sesion invalida o expirada. Inicia sesion nuevamente.');
        sessionService.clearSession();
        void router.navigate(['/login']);
      } else if (error.status === 403) {
        feedbackService.showError(backendMessage || 'No tienes permisos para esta accion');
      } else if (req.url.includes('/api/v1/')) {
        feedbackService.showError(backendMessage);
      }

      return throwError(() => error);
    })
  );
};
