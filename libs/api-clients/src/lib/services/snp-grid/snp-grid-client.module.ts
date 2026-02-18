import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnpGridService } from "./snp-grid.service";
import { SNP_GRID_SERVICE_CONFIG, SnpGridServiceConfig } from '../../tokens/snp-grid-config.token';

@NgModule({
  imports: [CommonModule],
})
export class SnpGridClientModule {

  public static forRoot(apiUrl: string): ModuleWithProviders<SnpGridClientModule> {
    return {
      ngModule: SnpGridClientModule,
      providers: [
        SnpGridService,
        {
          provide: SNP_GRID_SERVICE_CONFIG,
          useValue: { apiUrl } as SnpGridServiceConfig
        }
      ]
    };
  }

}
