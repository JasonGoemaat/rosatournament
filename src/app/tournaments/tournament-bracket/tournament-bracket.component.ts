import {Component,Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MyRouteData, TournamentService } from 'src/app/services/tournament.service';
import { data, Tournament } from '../../models/tournament';
import { TournamentConfig, BorderConfig, TournamentSpotConfig, defaultConfig } from '../../models/tournament-config';
import { SpotViewModel, TournamentViewModel } from '../../models/tournament-view-model';

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
    public service: TournamentService) {
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

  getBorderBottom(spot: TournamentSpotConfig): string {
    if (spot.borders === BorderConfig.Bottom || spot.borders == BorderConfig.BottomRight) {
      return 'solid 1px black';
    }
    if (spot.borders === BorderConfig.DashedBottom || spot.borders == BorderConfig.DashedBottomRight) {
      return 'dashed 1px black';
    }
    return '';
  }

  getBorderRight(spot: TournamentSpotConfig): string {
    if (spot.borders === BorderConfig.BottomRight) {
      return 'solid 1px black';
    }
    if (spot.borders === BorderConfig.DashedBottomRight) {
      return 'dashed 1px black';
    }
    return '';
  }

  getGameString(data: MyRouteData, index: number): string | null{
    const config = data.config as TournamentConfig;
    for (let i = 0; i < config.games.length; i++) {
      const game = config.games[i];
      if (game.spotA == index) {
        return `A${i}`;
      }
      if (game.spotB == index) {
        return `B${i}`;
      }
    }
    return null;
  }

  getSpotDisplayInfo(spot: TournamentSpotConfig) {
    // need 'isWinner' or 'isLoser' to add class to element
    // need displayText (name (i.e. 'Jeff Livingston'), time (i.e. '9:00 am'), source (i.e. loser of WA'))
    // need isItalic (if not name like 'Jeff Livingston' (i.e. for time or source, or place ))
    // hintText (if is where winner goes, display game name)

    // const infos: any[] = [];

    // if (this.config != null) {
    //   this.config.spots.forEach((spot, spotIndex) => {
    //     // 
    //   })
    // }
  }

  onSpotClick(data: MyRouteData, spot: SpotViewModel) {
    // console.log('click:', spot, this.vm);
    // const dialogRef = this.dialog.open(SpotDialogComponent, {
    //   data: new SpotDialogData(this.vm as TournamentViewModel, spot)
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('SpotDialogComponent closed, result:', result);
    // });
  }
}
