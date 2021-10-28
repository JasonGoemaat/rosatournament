import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Tournament } from 'src/app/models/tournament';
import { MyRouteData, TournamentService } from 'src/app/services/tournament.service';

@Component({
  selector: 'app-tournament-participant',
  templateUrl: './tournament-participant.component.html',
  styleUrls: ['./tournament-participant.component.scss']
})
export class TournamentParticipantComponent implements OnInit {
  data$: Observable<any>;

  constructor(
    public route: ActivatedRoute,
    public tournamentService: TournamentService,
  ) {
    (window as any).cParticipant = this;

    this.data$ = tournamentService.getForParams(route.paramMap)
    .pipe(map((data: MyRouteData) => {
      let gridModel: any = {};
      const participant = data.participantId ? data.vm.participants[data.participantId] : null;
      const matches = data.vm.getParticipantUpcomingMatches(data.participantId || -1);
      if (matches) {
        const gridTemplateColumns = `repeat(${matches.simple.length},64px)`;
        const gridTemplateRows = `repeat(${matches.simple[0][0].height},20px)`;
        const gridStyle = {gridTemplateColumns, gridTemplateRows};
        const gridElements: {gridArea: string, lines: string[], isWin: boolean, isLoss: boolean, isOut: boolean }[] = [];
        matches.simple.forEach((list: any[], column) => {
          let rowStart = 1;
          list.forEach((match) => {
            gridElements.push({
              gridArea: `${rowStart}/${column*2+1}/span ${match.height}/span 2`,
              lines: match.lines,
              isWin: !!match.isWin,
              isLoss: !!match.isLoss,
              isOut: !!match.isOut,
            });
            rowStart += match.height;
          });
        });
        gridModel = {gridTemplateRows, gridTemplateColumns, gridStyle, gridElements}
      }
      return {...data, participant, matches, gridModel};
    }))
    .pipe(tap(x => {
      console.log(x);
      (window as any).x = x;
    }));
  }

  ngOnInit(): void {
  }

  setPaid(data: any) {
  }

  setUnpaid(data: any) {
  }

  togglePaid(data: any, $event: MatSlideToggleChange) {
    console.log($event);
    if (data.participant.hasPaid && !confirm(`Are you sure you want to CLEAR THE PAID FLAG for ${data.participant.name}?`)) {
      $event.source.checked = data.participant.hasPaid;
      return;
    }
    if (!data.participant.hasPaid && !confirm(`Are you sure you want to SET THE PAID FLAG for ${data.participant.name}?`)) {
      $event.source.checked = data.participant.hasPaid;
      return;
    }

    const tournament = data.vm.cloneTournament() as Tournament;
    const participant = tournament.participants.find(x => x.id === data.participantId);
    if (participant) {
      participant.hasPaid = !participant?.hasPaid;
      this.tournamentService.setTournament(data.tournamentId, tournament);
    } else {
      $event.source.checked = data.participant.hasPaid;
      alert('Unable to find participant...');
    }
  }
}
