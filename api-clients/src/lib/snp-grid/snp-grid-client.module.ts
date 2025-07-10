import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnpGridService } from "./snp-grid.service";

@NgModule({
  imports: [CommonModule],
})
export class SnpGridClientModule {

  public static forRoot(environment: any): ModuleWithProviders<SnpGridClientModule> {
    return {
      ngModule: SnpGridClientModule,
      providers: [
        SnpGridService,
        {
          provide: 'environment', // you can also use InjectionToken
          useValue: environment
        }
      ]
    };
  }

}
