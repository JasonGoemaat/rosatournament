import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { TimeSlot } from 'src/app/models/tournament';
import { TournamentViewModel } from 'src/app/models/tournament-view-model';
import { MyRouteData, TournamentService } from 'src/app/services/tournament.service';
import { UtilService } from 'src/app/services/util.service';
import { MatchTimeSlotDialogComponent } from './match-time-slot-dialog/match-time-slot-dialog.component';

const parseForMatch = (data: MyRouteData) => {
  const {vm, config, tournament} = data;
  let matchConfig = config.matches[data.matchIndex as number];
  let timeSlot = tournament.timeSlots.find(ts => ts.matchIndex === data.matchIndex) as TimeSlot;
  let A = vm.getParticipant(tournament.spotParticipant[matchConfig.spotA]);
  let B = vm.getParticipant(tournament.spotParticipant[matchConfig.spotB]);
  let model = {
    matchName: matchConfig.name as string,
    timeString: UtilService.formatTime(timeSlot.utc),
    haveParticipants: !!(A && B),
    A,
    B,
    participants: [A, B],
    result: data.vm.tournament.matchResultMap[data.matchIndex as number],
    nameFor: (id: number) => vm.getParticipant(id),
  }
  return {...data, matchConfig, timeSlot, model,};
}

@Component({
  selector: 'app-tournament-match',
  templateUrl: './tournament-match.component.html',
  styleUrls: ['./tournament-match.component.scss']
})
export class TournamentMatchComponent implements OnInit {

  data$: Observable<any>;

  lagWinner?: string;
  match1Winner?: string;
  match2Winner?: string;
  match3Winner?: string;
  matchWinner?: string;

  constructor(
    public route: ActivatedRoute,
    public service: TournamentService,
    public dialog: MatDialog,
  ) {
    (window as any).cMatch = this;
    this.data$ = service.getForParams(route.paramMap)
    .pipe(map(parseForMatch))
    // .pipe(delay(20))
    .pipe(tap(x => {
      // set form values based on result
      if (x.model.result) {
        this.lagWinner = `${x.model.result.lagWinner}`;
        this.matchWinner = `${x.model.result.matchWinner}`;
        const [a, b, c] = x.model.result.gameWinners as number[];
        this.match1Winner = `${a}`;
        this.match2Winner = `${b}`;
        this.match3Winner = `${c}`;
      }
      console.log('cMatch:', x);
      (window as any).g = x;
    }))
  }

  ngOnInit(): void {
  }

  save(data: any): void {
    const vm = data.vm as TournamentViewModel;
    const numberFor = (x: any) => {
      if (typeof(x) === 'number') {
        return x;
      }

      if (typeof(x) === 'string') {
        return parseInt(x);
      }

      return undefined;
    }
    
    const newTournament = vm.setMatchResult(data.matchIndex, {
      lagWinner: numberFor(this.lagWinner),
      matchWinner: numberFor(this.matchWinner),
      gameWinners: [numberFor(this.match1Winner), numberFor(this.match2Winner), numberFor(this.match3Winner)].map(numberFor).filter(x => typeof(x) === 'number') as number[]
    })

    this.service.setTournament(data.tournamentId, newTournament)
    .then(() => (window as any).history.back()) // go back to previous page
  }

  delete(data: any) {
    if (!confirm('ARE YOU SURE?')) {
      return;
    }

    const vm = data.vm as TournamentViewModel;
    const tournament = vm.deleteMatchResult(data.matchIndex);
    this.service.setTournament(data.tournamentId, tournament)
    .then(() => (window as any).history.back()) // go back to previous page
  }

  openDialog(data: any): void {
    const matchIndex = data.matchIndex;
    const dialogRef = this.dialog.open(MatchTimeSlotDialogComponent, {
      width: '250px',
      data: {
        vm: data.vm,
        matchIndex: data.matchIndex
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed with result:', result);
      if (typeof(result) !== 'number') {
        console.log('NOT A NUMBER');
        return;
      }

      const newTimeSlot = result;
      const vm = data.vm as TournamentViewModel;
      let currentTimeSlot = vm.tournament.timeSlots.findIndex(ts => ts.matchIndex === data.matchIndex);
      if (currentTimeSlot < 0) {
        console.log('COULD NOT FIND CURRENT TIMESLOT');
      }

      const tournament = vm.cloneTournament();
      while (currentTimeSlot > newTimeSlot) {
        tournament.timeSlots[currentTimeSlot].matchIndex = tournament.timeSlots[currentTimeSlot - 1].matchIndex;
        currentTimeSlot--;
      }
      while (currentTimeSlot < newTimeSlot) {
        tournament.timeSlots[currentTimeSlot].matchIndex = tournament.timeSlots[currentTimeSlot + 1].matchIndex;
        currentTimeSlot++;
      }
      tournament.timeSlots[currentTimeSlot].matchIndex = data.matchIndex;
      this.service.setTournament(data.tournamentId, tournament)
      .then(() => (window as any).history.back()) // go back to previous page
    });
  }
}
