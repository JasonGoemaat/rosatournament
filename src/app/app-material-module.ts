import { NgModule } from '@angular/core';
import {CdkTableModule} from '@angular/cdk/table';

import { MatSliderModule } from '@angular/material/slider';

const modules = [
  CdkTableModule,
  MatSliderModule,
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class AppMaterialModule {
}
