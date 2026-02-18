import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MVarService } from "./mvar.service";
import { MVAR_SERVICE_CONFIG, MVarServiceConfig } from '../../tokens/mvar-config.token';

@NgModule({
  imports: [CommonModule],
})
export class MvarClientModule {

  public static forRoot(apiUrl: string): ModuleWithProviders<MvarClientModule> {
    return {
      ngModule: MvarClientModule,
      providers: [
        MVarService,
        {
          provide: MVAR_SERVICE_CONFIG,
          useValue: { apiUrl } as MVarServiceConfig
        }
      ]
    };
  }

}
