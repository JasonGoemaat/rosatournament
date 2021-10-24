import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
// import { FirebaseAuthSampleComponent } from './sample/firebase-auth-sample/firebase-auth-sample.component';
import { SamplesComponent } from './sample/samples/samples.component';
import { TodosComponent } from './sample/todos/todos.component';
import { TestSecondRouteComponent } from './test-second-route/test-second-route.component';
import { TournamentBracketComponent } from './tournaments/tournament-bracket/tournament-bracket.component';
import { TournamentGameComponent } from './tournaments/tournament-game/tournament-game.component';
import { TournamentPlayersComponent } from './tournaments/tournament-players/tournament-players.component';
import { TournamentsComponent } from './tournaments/tournaments/tournaments.component';

const routes: Routes = [
  { path: '', redirectTo: '/tournaments/mine', pathMatch: 'full' },
  {
    path: 'tournaments/:tournamentId',
    component: TournamentsComponent,
    children: [
      {
        path: '',
        component: TournamentBracketComponent,
        pathMatch: 'full'
      },
      {
        path: 'games/:gameId',
        component: TournamentGameComponent
      },
      {
        path: 'players/:playerId',
        component: TournamentPlayersComponent
      },
    ]
  },
  { path: 'second', component: TestSecondRouteComponent },
  { path: 'samples', component: SamplesComponent, pathMatch: 'full' },
  { path: 'samples/todos', component: TodosComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
