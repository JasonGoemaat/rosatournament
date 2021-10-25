import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { TimeSlot } from 'src/app/models/tournament';
import { TournamentViewModel } from 'src/app/models/tournament-view-model';
import { MyRouteData, TournamentService } from 'src/app/services/tournament.service';
import { UtilService } from 'src/app/services/util.service';
import { GameTimeSlotDialogComponent } from './game-time-slot-dialog/game-time-slot-dialog.component';

const parseForGame = (data: MyRouteData) => {
  const {vm, config, tournament} = data;
  let gameConfig = config.games[data.gameId as number];
  let timeSlot = tournament.timeSlots.find(ts => ts.gameId === data.gameId) as TimeSlot;
  let A = vm.getParticipant(tournament.participantMap[gameConfig.spotA]);
  let B = vm.getParticipant(tournament.participantMap[gameConfig.spotB]);
  let model = {
    gameName: gameConfig.name as string,
    timeString: UtilService.formatTime(timeSlot.utc),
    haveParticipants: !!(A && B),
    A,
    B,
    participants: [A, B],
    result: data.vm.tournament.gameResultMap[data.gameId as number],
    nameFor: (id: number) => vm.getParticipant(id),
  }
  return {...data, gameConfig, timeSlot, model,};
}

@Component({
  selector: 'app-tournament-game',
  templateUrl: './tournament-game.component.html',
  styleUrls: ['./tournament-game.component.scss']
})
export class TournamentGameComponent implements OnInit {

  data$: Observable<any>;

  lagWinner?: string;
  game1Winner?: string;
  game2Winner?: string;
  game3Winner?: string;
  matchWinner?: string;

  constructor(
    public route: ActivatedRoute,
    public service: TournamentService,
    public dialog: MatDialog,
  ) {
    (window as any).cGame = this;
    this.data$ = service.getForParams(route.paramMap)
    .pipe(map(parseForGame))
    // .pipe(delay(20))
    .pipe(tap(x => {
      // set form values based on result
      if (x.model.result) {
        this.lagWinner = `${x.model.result.lagWinner}`;
        this.matchWinner = `${x.model.result.matchWinner}`;
        const [a, b, c] = x.model.result.gameWinners as number[];
        this.game1Winner = `${a}`;
        this.game2Winner = `${b}`;
        this.game3Winner = `${c}`;
      }
      console.log('cGame:', x);
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
    
    const newTournament = vm.setGameResult(data.gameId, {
      lagWinner: numberFor(this.lagWinner),
      matchWinner: numberFor(this.matchWinner),
      gameWinners: [numberFor(this.game1Winner), numberFor(this.game2Winner), numberFor(this.game3Winner)].map(numberFor).filter(x => typeof(x) === 'number') as number[]
    })

    this.service.setTournament(data.tournamentId, newTournament)
    .then(() => (window as any).history.back()) // go back to previous page
  }

  delete(data: any) {
    if (!confirm('ARE YOU SURE?')) {
      return;
    }

    const vm = data.vm as TournamentViewModel;
    const tournament = vm.deleteGameResult(data.gameId);
    this.service.setTournament(data.tournamentId, tournament)
    .then(() => (window as any).history.back()) // go back to previous page
  }

  openDialog(data: any): void {
    const gameId = data.gameId;
    const dialogRef = this.dialog.open(GameTimeSlotDialogComponent, {
      width: '250px',
      data: {
        vm: data.vm,
        gameId: data.gameId
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
      let currentTimeSlot = vm.tournament.timeSlots.findIndex(ts => ts.gameId === data.gameId);
      if (currentTimeSlot < 0) {
        console.log('COULD NOT FIND CURRENT TIMESLOT');
      }

      const tournament = vm.cloneTournament();
      while (currentTimeSlot > newTimeSlot) {
        tournament.timeSlots[currentTimeSlot].gameId = tournament.timeSlots[currentTimeSlot - 1].gameId;
        currentTimeSlot--;
      }
      while (currentTimeSlot < newTimeSlot) {
        tournament.timeSlots[currentTimeSlot].gameId = tournament.timeSlots[currentTimeSlot + 1].gameId;
        currentTimeSlot++;
      }
      tournament.timeSlots[currentTimeSlot].gameId = data.gameId;
      this.service.setTournament(data.tournamentId, tournament)
      .then(() => (window as any).history.back()) // go back to previous page
    });
  }
}
