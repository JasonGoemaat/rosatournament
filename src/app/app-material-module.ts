import { NgModule } from '@angular/core';
import {CdkTableModule} from '@angular/cdk/table';

import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule  } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatListModule } from "@angular/material/list";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from "@angular/material/menu";
import { MatCardModule } from "@angular/material/card";

const modules = [
  CdkTableModule,
  MatSliderModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatListModule,
  MatCheckboxModule,
  MatMenuModule,
  MatCardModule,
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class AppMaterialModule {
}
