import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
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
        const gridElements: {gridArea: string, lines: string[]}[] = [];
        matches.simple.forEach((list: any[], column) => {
          let rowStart = 1;
          list.forEach((match) => {
            gridElements.push({
              gridArea: `${rowStart}/${column*2+1}/span ${match.height}/span 2`,
              lines: match.lines
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
}
