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
import { HomeComponent } from './home/home.component';
import { TestSecondRouteComponent } from './test-second-route/test-second-route.component';
import { SamplesComponent } from './sample/samples/samples.component';
import { SampleNavComponent } from './sample/sample-nav/sample-nav.component';
import { TournamentsComponent } from './tournaments/tournaments/tournaments.component';
// import { FirebaseAuthSampleComponent } from './sample/firebase-auth-sample/firebase-auth-sample.component';
import { TodosComponent } from './sample/todos/todos.component';

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

import { initializeApp } from "firebase/app";
import { TournamentMenuComponent } from './tournaments/tournament-menu/tournament-menu.component';
import { TournamentMatchesComponent } from './tournaments/tournament-matches/tournament-matches.component';
import { TournamentParticipantsComponent } from './tournaments/tournament-participants/tournament-participants.component';
import { TournamentParticipantComponent } from './tournaments/tournament-participant/tournament-participant.component';
import { TournamentMatchComponent } from './tournaments/tournament-match/tournament-match.component';
import { TournamentBracketComponent } from './tournaments/tournament-bracket/tournament-bracket.component';
import { LoadingComponent } from './loading/loading.component';
import { MatchTimeSlotDialogComponent } from './tournaments/tournament-match/match-time-slot-dialog/match-time-slot-dialog.component';
import { TournamentSpotComponent } from './tournaments/tournament-spot/tournament-spot.component';
import { UtilService } from './services/util.service';
import { TournamentParticipantBracketComponent } from './tournaments/tournament-participant-bracket/tournament-participant-bracket.component';
import { TournamentAdminComponent } from './tournaments/tournament-admin/tournament-admin.component';
import { DeviceStylesComponent } from './sample/device-styles/device-styles.component';
import { FacebookCommentsComponent } from './facebook-comments/facebook-comments.component';

const firebaseConfig = {
  apiKey: "AIzaSyDyEMGADaBOQW1F36QtoPFYDGJzdFETvrs",
  authDomain: "goemaat-multiple-apps.firebaseapp.com",
  projectId: "goemaat-multiple-apps",
  storageBucket: "goemaat-multiple-apps.appspot.com",
  messagingSenderId: "272957249934",
  appId: "1:272957249934:web:152a624721165bf5e0acdf"
};

initializeApp(firebaseConfig);

(window as any).UtilService = UtilService;

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
    HomeComponent,
    TestSecondRouteComponent,
    TournamentsComponent,
    TodosComponent,
    SamplesComponent,
    SampleNavComponent,
    TournamentBracketComponent,
    TournamentMenuComponent,
    TournamentMatchesComponent,
    TournamentMatchComponent,
    TournamentParticipantsComponent,
    TournamentParticipantComponent,
    LoadingComponent,
    MatchTimeSlotDialogComponent,
    TournamentSpotComponent,
    TournamentParticipantBracketComponent,
    TournamentAdminComponent,
    DeviceStylesComponent,
    FacebookCommentsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
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
