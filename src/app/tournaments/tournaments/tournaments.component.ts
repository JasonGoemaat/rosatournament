import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { filter, map, startWith, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { TournamentService, MyRouteData } from 'src/app/services/tournament.service';
import { tournamentReset } from 'src/app/models/reset';

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.scss']
})
export class TournamentsComponent implements OnInit, OnDestroy {
  tournamentId: string = '';
  data$: Observable<MyRouteData>;
  location$: Observable<string>;
  paramMap?: Subscription;

  constructor(
    public route: ActivatedRoute,
    public service: TournamentService,
    public authService: AuthService,
    public router: Router,
  ) {
    (window as any).cTournaments = this;
    this.data$ = this.service.getForParams(this.route.paramMap).pipe(tap(x => {
      console.log('getForParams returned:', x);
      (window as any).t = x;
    }));
    this.location$ = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd), startWith(this.router))
      .pipe(tap(x => console.log('%crouter.events:', 'padding: 5px; border-radius: 5px; color: white; background-color: black; font-weight: bold', x)))
      //.pipe(tap(e => e.url))
      .pipe(tap(l => console.log('location:', l)))
      .pipe(map(x => `https://rosatournament.web.app${location.pathname}`))
  }

  ngOnInit(): void {
    this.location$.subscribe(x => console.log('Well, got x!', x));
  }

  ngOnDestroy(): void {
  }

  signIn(): void {
    this.authService.signIn();
  }

  signOut(): void {
    this.authService.signOut();
  }
}
