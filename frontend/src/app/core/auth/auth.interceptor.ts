import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SessionService } from './session.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const sessionService = inject(SessionService);
  const session = sessionService.session;
  const isApiRequest = req.url.includes('/api/v1/');

  if (!isApiRequest || !session?.basicAuthHeader || req.headers.has('Authorization')) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: session.basicAuthHeader
      }
    })
  );
};
