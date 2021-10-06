import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainComponent } from './main/main.component';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { TestSecondRouteComponent } from './test-second-route/test-second-route.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    NavComponent,
    HomeComponent,
    TestSecondRouteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [MainComponent]
})
export class AppModule { }
