import { Injectable } from '@angular/core';
import { ParamMap } from '@angular/router';
import { Unsubscribe } from '@firebase/util';
import { Observable, Observer, ReplaySubject, combineLatest, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Tournament } from '../models/tournament';
import { defaultConfig, TournamentConfig } from '../models/tournament-config';
import { TournamentViewModel } from '../models/tournament-view-model';
import { AuthService } from './auth.service';
import { FirebaseFunctionsService } from './firebase-functions.service';
import { AuthInfo } from './firebase-util.service';

export interface MyRouteData {
  auth: AuthInfo,
  config: TournamentConfig,
  tournament: Tournament,
  vm: TournamentViewModel,
  gameId: number | null,
  participantId: number | null,
}

@Injectable({
  providedIn: 'root'
})
export class TournamentService {
  tournament$ = new ReplaySubject<Tournament>(1);
  tournamentIdObservable = new ReplaySubject<number>(1);
  lastTournamentId: string | null = null;

  unsub : Unsubscribe | null = null;
  
  constructor(public auth: AuthService, public ff: FirebaseFunctionsService) {
    this.tournament$.unsubscribe();
  }

  getTournament(tournamentId: string) {
    if (tournamentId !== this.lastTournamentId) {
      this.tournament$ = new ReplaySubject<Tournament>(1);
      if (this.unsub) {
        this.unsub();
        this.unsub = null;
      }
      const doc = this.ff.doc(this.ff.getFirestore(), "tournaments", tournamentId);
      this.unsub = this.ff.onSnapshot(doc, (doc) => {
        const tournament = doc.data() as Tournament;
        this.tournament$.next(tournament);
      });
    }

    return combineLatest([this.auth.auth$, this.tournament$])
    .pipe(map(([auth, tournament]) => {
      const config = defaultConfig;
      const vm = new TournamentViewModel(config, tournament);
      const result = {
        auth,
        tournament,
        config,
        vm
      }
      return result;
    }));
  }

  getForParams(paramMap: Observable<ParamMap>): Observable<MyRouteData> {
    return paramMap
      .pipe(
        map(params => ({
          tournamentId: `${params.get('tournamentId')}`,
          gameId: params.has('gameId') ? Number(params.get('gameId')) : undefined,
          participantId: params.has('participantId') ? Number(params.get('participantId')) : undefined,
        }))
      )
      .pipe(
        mergeMap(result => {
          return combineLatest([of(result), this.getTournament(result.tournamentId)])
        })
      )
      .pipe(
        map(([result, info]) => {
          return <MyRouteData>{
            gameId: result.gameId,
            participantId: result.participantId,
            ...info
          }
        })
      );
  }

  setTournament(tournamentId: string, tournament: Tournament) {
  }
}
