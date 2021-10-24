import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { TimeSlot } from 'src/app/models/tournament';
import { MyRouteData, TournamentService } from 'src/app/services/tournament.service';
import { UtilService } from 'src/app/services/util.service';

const parseForGame = (data: MyRouteData) => {
  let gameConfig = data.vm.config.games[data.gameId as number];
  let timeSlot = data.vm.tournament.timeSlots.find(ts => ts.gameId === data.gameId) as TimeSlot;
  let model = {
    gameName: gameConfig.name as string,
    timeString: UtilService.formatTime(timeSlot.utc)
  }
  return {...data, gameConfig, timeSlot, model};
}

@Component({
  selector: 'app-tournament-game',
  templateUrl: './tournament-game.component.html',
  styleUrls: ['./tournament-game.component.scss']
})
export class TournamentGameComponent implements OnInit {

  data$: Observable<any>;

  constructor(
    public route: ActivatedRoute,
    public service: TournamentService,
  ) {
    (window as any).cGame = this;
    this.data$ = service.getForParams(route.paramMap)
    .pipe(map(parseForGame))
    .pipe(delay(2000))
    .pipe(tap(x => {
      console.log('cGame:', x);
      (window as any).g = x;
    }))
  }

  ngOnInit(): void {
  }

}
