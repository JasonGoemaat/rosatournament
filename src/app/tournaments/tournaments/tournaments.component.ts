import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { switchMap, tap } from 'rxjs/operators';
import { combineLatest, ReplaySubject, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { TournamentService, MyRouteData } from 'src/app/services/tournament.service';
import { TournamentViewModel } from 'src/app/models/tournament-view-model';
import { AuthInfo } from 'src/app/services/firebase-util.service';
import { defaultConfig } from 'src/app/models/tournament-config';
import { faSpinner, faCoffee } from "@fortawesome/free-solid-svg-icons";

export interface MyData {
  vm: TournamentViewModel;
  auth: AuthInfo;
}

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.scss']
})
export class TournamentsComponent implements OnInit, OnDestroy {
  tournamentId: string = '';
  data$: Observable<MyRouteData>
  paramMap : Subscription | undefined = undefined;
  faSpinner = faSpinner;
  faCoffee = faCoffee;

  constructor(public route: ActivatedRoute, public service: TournamentService, public authService: AuthService) {
    (window as any).cTournaments = this;
    this.data$ = this.service.getForParams(this.route.paramMap).pipe(tap(x => {
      console.log('getForParams returned:', x);
    }));
  }

  ngOnInit(): void {
    // this.paramMap = this.route.paramMap.subscribe((params: ParamMap) => {
    //   this.tournamentId = `${params.get('tournamentId')}`;
    //   console.log('got params:', params);
    //   console.log('tournamentId:', this.tournamentId);
    //   this.service.getTournament(this.tournamentId);
    //   combineLatest([this.service.tournament$, this.authService.auth$])
    //     .subscribe(([tournament, auth]) => {
    //       console.log('tournament:', tournament);
    //       console.log('auth:', auth);
    //       const vm = new TournamentViewModel(defaultConfig, tournament);
    //       this.data$.next(<MyData>{ vm, auth })
    //     });
    // });
  }

  ngOnDestroy(): void {
    if (this.paramMap) {
      this.paramMap.unsubscribe();
      this.paramMap = undefined;
    }
  }
}
