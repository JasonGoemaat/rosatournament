import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainComponent } from './main/main.component';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { TestSecondRouteComponent } from './test-second-route/test-second-route.component';

import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { FirebaseAuthTestComponent } from './firebase-auth-test/firebase-auth-test.component';
import { FirebaseAuthSampleComponent } from './sample/firebase-auth-sample/firebase-auth-sample.component';
import { SamplesComponent } from './sample/samples/samples.component';
import { SampleNavComponent } from './sample/sample-nav/sample-nav.component';
import { TournamentsComponent } from './tournaments/tournaments/tournaments.component';
import { NavUserComponent } from './nav/nav-user/nav-user.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppMaterialModule } from './app-material-module';

const firebaseConfig = {
  apiKey: "AIzaSyDyEMGADaBOQW1F36QtoPFYDGJzdFETvrs",
  authDomain: "goemaat-multiple-apps.firebaseapp.com",
  projectId: "goemaat-multiple-apps",
  storageBucket: "goemaat-multiple-apps.appspot.com",
  messagingSenderId: "272957249934",
  appId: "1:272957249934:web:152a624721165bf5e0acdf"
};

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    NavComponent,
    HomeComponent,
    TestSecondRouteComponent,
    FirebaseAuthTestComponent,
    FirebaseAuthSampleComponent,
    SamplesComponent,
    SampleNavComponent,
    TournamentsComponent,
    NavUserComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    FontAwesomeModule,
    AppMaterialModule,
  ],
  providers: [],
  bootstrap: [MainComponent]
})
export class AppModule { }
