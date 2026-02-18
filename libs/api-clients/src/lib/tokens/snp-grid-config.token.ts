import { InjectionToken } from '@angular/core';

export interface SnpGridServiceConfig {
  apiUrl: string;
}

export const SNP_GRID_SERVICE_CONFIG = new InjectionToken<SnpGridServiceConfig>(
  'SNP_GRID_SERVICE_CONFIG'
);
