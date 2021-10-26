import {Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MyRouteData, TournamentService } from 'src/app/services/tournament.service';
import { data, Tournament } from '../../models/tournament';
import { TournamentConfig, BorderConfig, SpotConfig, defaultConfig } from '../../models/tournament-config';
import { SpotModel } from '../../models/tournament-view-model';

@Component({
  selector: 'app-tournament-bracket',
  templateUrl: './tournament-bracket.component.html',
  styleUrls: ['./tournament-bracket.component.scss']
})
export class TournamentBracketComponent implements OnInit {
  myConfig: TournamentConfig | null = null;
  myTournament: Tournament | null = null;
  data$: Observable<MyRouteData>;
  BorderConfig = BorderConfig;
  data = data;

  constructor(
    public route: ActivatedRoute,
    public service: TournamentService,
    public router: Router
  ) {
    (window as any).cBracket = this;
    this.data$ = service.getForParams(route.paramMap).pipe(tap(x => console.log('Bracket component:', x)));
  }

  ngOnInit(): void {
    // this.route.paramMap.subscribe((params: ParamMap) => {
    //   console.log('got params:', params);
    //   const tournamentId = `${params.get('tournamentId')}`;
    //   console.log('bracket tournamentId:', tournamentId);
    //   console.log('tournamentId:', tournamentId);
    //   this.service.getTournament(tournamentId);
    //   combineLatest([this.service.tournament$, this.authService.auth])
    //     .subscribe(([tournament, auth]) => {
    //       console.log('tournament:', tournament);
    //       console.log('auth:', auth);
    //       const vm = new TournamentViewModel(defaultConfig, tournament);
    //       this.data$.next(<MyData>{ vm, auth })
    //     });
    // });
  }

  getBorderBottom(spot: SpotConfig): string {
    if (spot.borders === BorderConfig.Bottom || spot.borders == BorderConfig.BottomRight) {
      return 'solid 1px black';
    }
    if (spot.borders === BorderConfig.DashedBottom || spot.borders == BorderConfig.DashedBottomRight) {
      return 'dashed 1px black';
    }
    return '';
  }

  getBorderRight(spot: SpotConfig): string {
    if (spot.borders === BorderConfig.BottomRight) {
      return 'solid 1px black';
    }
    if (spot.borders === BorderConfig.DashedBottomRight) {
      return 'dashed 1px black';
    }
    return '';
  }

  getMatchString(data: MyRouteData, index: number): string | null{
    const config = data.config as TournamentConfig;
    for (let i = 0; i < config.matches.length; i++) {
      const match = config.matches[i];
      if (match.spotA == index) {
        return `A${i}`;
      }
      if (match.spotB == index) {
        return `B${i}`;
      }
    }
    return null;
  }

  getSpotDisplayInfo(spot: SpotConfig) {
    // need 'isWinner' or 'isLoser' to add class to element
    // need displayText (name (i.e. 'Jeff Livingston'), time (i.e. '9:00 am'), source (i.e. loser of WA'))
    // need isItalic (if not name like 'Jeff Livingston' (i.e. for time or source, or place ))
    // hintText (if is where winner goes, display match name)

    // const infos: any[] = [];

    // if (this.config != null) {
    //   this.config.spots.forEach((spot, spotIndex) => {
    //     // 
    //   })
    // }
  }

  navigateToMatch(tournamentId: string, matchIndex: number) {
    this.router.navigate(['tournaments', tournamentId, 'matches', matchIndex]);
  }

  onSpotClick(data: MyRouteData, spot: SpotModel) {
    const tournamentId = data.tournamentId;
    const {loserOfMatch, winnerOfMatch} = data.config.spots[spot.index];
    if (typeof(loserOfMatch) === 'number') {
      this.navigateToMatch(tournamentId, loserOfMatch);
      return;
    }

    if (typeof(winnerOfMatch) === 'number') {
      this.navigateToMatch(tournamentId, winnerOfMatch);
      return;
    }

    // spot doesn't have loser or winner, must be a seed spot...  find the match
    // they play in
    let matchIndex = data.config.matches.findIndex(match => match.spotA === spot.index || match.spotB === spot.index);
    if (matchIndex >= 0) {
      this.navigateToMatch(tournamentId, matchIndex);
    }

    // ----- old stuff for when I was using a dialog -----
    // console.log('click:', spot, this.vm);
    // const dialogRef = this.dialog.open(SpotDialogComponent, {
    //   data: new SpotDialogData(this.vm as TournamentViewModel, spot)
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('SpotDialogComponent closed, result:', result);
    // });
  }

  getTooltip(data: MyRouteData, spot: SpotModel): string {
    const lines = [
      `spot: ${spot.index}`
    ]
    return lines.join('\r\n');
  }
}
