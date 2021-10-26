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
import { MatSelectModule } from "@angular/material/select";
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from "@angular/material/tooltip";

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
  MatSelectModule,
  MatDialogModule,
  MatTooltipModule,
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class AppMaterialModule {
}
