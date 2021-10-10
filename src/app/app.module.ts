// angular stuff
import { environment } from 'src/environments/environment';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// my components
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { NavComponent } from './nav/nav.component';
import { HomeComponent } from './home/home.component';
import { TestSecondRouteComponent } from './test-second-route/test-second-route.component';
import { SamplesComponent } from './sample/samples/samples.component';
import { SampleNavComponent } from './sample/sample-nav/sample-nav.component';
import { TournamentsComponent } from './tournaments/tournaments/tournaments.component';
import { NavUserComponent } from './nav/nav-user/nav-user.component';
// import { FirebaseAuthSampleComponent } from './sample/firebase-auth-sample/firebase-auth-sample.component';
import { TodosComponent } from './sample/todos/todos.component';

// firestore stuff
import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';

// addon ui stuff
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppMaterialModule } from './app-material-module';

// ngxs stuff
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';

// ngxs states
import { TodosState } from "./shared/todos.state";
import { NavSamplesComponent } from './nav/nav-samples/nav-samples.component';

const firebaseConfig = {
  apiKey: "AIzaSyDyEMGADaBOQW1F36QtoPFYDGJzdFETvrs",
  authDomain: "goemaat-multiple-apps.firebaseapp.com",
  projectId: "goemaat-multiple-apps",
  storageBucket: "goemaat-multiple-apps.appspot.com",
  messagingSenderId: "272957249934",
  appId: "1:272957249934:web:152a624721165bf5e0acdf"
};

export const NGXS_MODULE = NgxsModule.forRoot(
  [
    TodosState,
  ],
  { developmentMode: !environment.production },
);


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    NavComponent,
    HomeComponent,
    TestSecondRouteComponent,
    // FirebaseAuthSampleComponent,
    TournamentsComponent,
    TodosComponent,
    NavUserComponent,
    NavSamplesComponent,
    SamplesComponent,
    SampleNavComponent,
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
    NGXS_MODULE,
    NgxsReduxDevtoolsPluginModule.forRoot(
      { disabled: environment.production }
    ),
    NgxsRouterPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
  ],
  providers: [],
  bootstrap: [MainComponent]
})
export class AppModule { }
