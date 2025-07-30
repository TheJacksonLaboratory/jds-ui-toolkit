import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MVarService } from "./mvar.service";

@NgModule({
  imports: [CommonModule],
})
export class MvarClientModule {

  public static forRoot(environment: any): ModuleWithProviders<MvarClientModule> {
    return {
      ngModule: MvarClientModule,
      providers: [
        MVarService,
        {
          provide: 'environment', // you can also use InjectionToken
          useValue: environment
        }
      ]
    };
  }

}
