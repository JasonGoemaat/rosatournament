import {Component } from '@angular/core';
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
export class TournamentBracketComponent {
  myConfig: TournamentConfig | null = null;
  myTournament: Tournament | null = null;
  data$: Observable<MyRouteData>;
  BorderConfig = BorderConfig;
  data = data;
  focusParticipantId?: number;
  focus: boolean[] = [];

  constructor(
    public route: ActivatedRoute,
    public service: TournamentService,
    public router: Router,
  ) {
    (window as any).cBracket = this;
    this.data$ = service.getForParams(route.paramMap)
    .pipe(tap(x => {
      this.focus = x.vm.spotList.map(spot => this.shouldFocusSpot(x, spot.index));
      (window as any).x = x;
    }));
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

  navigateToMatch(tournamentId: string, matchIndex: number) {
    this.router.navigate(['tournaments', tournamentId, 'matches', matchIndex]);
  }

  doRandomWinner(data: MyRouteData, spot: SpotModel) {
    if (data.tournamentId === 'mine') {
      const answer = confirm(`This is Jack's actual tournament, are you sure you want to assign a random winner?`);
      if (!answer) {
        return;
      }
    }
    const tournamentId = data.tournamentId;
    let matchIndex = data.config.matches.findIndex(match => match.winnerTo === spot.index || match.loserTo === spot.index);
    if (!(matchIndex >= 0)) return;
    console.log('found match index:', matchIndex);
    const match = data.vm.matches[matchIndex];
    if (match.isFinished) return; // already finished, dummy!
    console.log(match);

    const [a] = [...match.participantsAIds];
    const [b] = [...match.participantsBIds];
    const lagWinner = Math.random() >= 0.5 ? a : b;
    const game1Winner = Math.random() >= 0.5 ? a : b;
    const game2Winner = Math.random() >= 0.5 ? a : b;
    const game3Winner = Math.random() >= 0.5 ? a : b;

    if (game1Winner === game2Winner) {
      const newTournament = data.vm.setMatchResult(matchIndex, {
        lagWinner,
        matchWinner: game1Winner,
        gameWinners: [game1Winner, game2Winner]
      })
  
      this.service.setTournament(data.tournamentId, newTournament)
      .then(() => console.log('UPDATED:', newTournament));
    } else {
      const newTournament = data.vm.setMatchResult(matchIndex, {
        lagWinner,
        matchWinner: game3Winner,
        gameWinners: [game1Winner, game2Winner, game3Winner]
      })
  
      this.service.setTournament(data.tournamentId, newTournament)
      .then(() => console.log('UPDATED:', newTournament));
    }
  }

  onSpotClick(data: MyRouteData, spot: SpotModel, $event: MouseEvent) {
    // for debugging, click with shift to auto-complete game randomly
    if ($event.shiftKey) {
      this.doRandomWinner(data, spot);
      return;
    }

    // if clicking on seed spot, focus that player's possible spots throughout
    // tournament (or cancel)
    const participantId = data.tournament.spotParticipant[spot.index];
    if (participantId) {
      if (this.focusParticipantId === participantId) {
        this.focusParticipantId = undefined; // cancel
      } else {
        this.focusParticipantId = participantId;
      }
      this.focus = data.vm.spotList.map(spot => this.shouldFocusSpot(data, spot.index));
      return;
    }

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

  focusSpotCount: number = 0;

  shouldFocusSpot(data: MyRouteData, spotIndex: number): boolean {
    this.focusSpotCount++;
    const result = this.focusParticipantId && data.vm.spotPossibleParticipants[spotIndex] && data.vm.spotPossibleParticipants[spotIndex].has(this.focusParticipantId);
    //console.log(`shouldFocusSpot(data, ${spotIndex}) = ${result}`);
    return !!result; 
  }
}
