import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { SessionService } from '../auth/session.service';
import { UserRole } from '../../shared/models/session-user.model';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const sessionService = inject(SessionService);
  const router = inject(Router);
  const role = route.data['role'] as UserRole | undefined;

  if (!role) {
    return true;
  }

  if (sessionService.hasRole(role)) {
    return true;
  }

  return router.createUrlTree(['/']);
};
