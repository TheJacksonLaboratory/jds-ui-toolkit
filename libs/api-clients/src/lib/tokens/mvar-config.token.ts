import { InjectionToken } from '@angular/core';

export interface MVarServiceConfig {
  apiUrl: string;
}

export const MVAR_SERVICE_CONFIG = new InjectionToken<MVarServiceConfig>(
  'MVAR_SERVICE_CONFIG'
);
