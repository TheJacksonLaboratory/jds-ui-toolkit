import { InjectionToken } from '@angular/core';

export interface IsaDataServiceConfig {
  baseUrl: string;
}

export const ISA_DATA_SERVICE_CONFIG = new InjectionToken<IsaDataServiceConfig>(
  'ISA_DATA_SERVICE_CONFIG'
);