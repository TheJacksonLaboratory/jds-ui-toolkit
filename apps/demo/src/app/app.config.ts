import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideAuth0, authHttpInterceptorFn } from '@auth0/auth0-angular';

import { providePrimeNG } from 'primeng/config';
import { EchoPreset } from '@jax-data-science/themes';

import { appRoutes } from './app.routes';

import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([authHttpInterceptorFn])),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: EchoPreset,
        options: {
          prefix: 'echo',
          cssLayer: {
            name: 'primeng',
            order:  'tailwind-base, primeng, tailwind-utilities'
          },
          darkModeSelector: '.my-app-dark'
        }
      }
    }),
    provideAuth0({
      domain: environment.auth.domain,
      clientId: environment.auth.clientId,
      authorizationParams: {
        redirect_uri: `${window.location.origin}/search`,
        audience: environment.auth.audience,
        scope: 'read:current_user'
      },
      httpInterceptor: {
        allowedList: [
          `${environment.urls.geneWeaver}/*`,
          `${environment.urls.strainRecommender}/*`,
        ]
      }
    })
  ],
};
