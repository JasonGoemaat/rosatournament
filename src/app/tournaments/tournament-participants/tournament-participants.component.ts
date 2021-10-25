import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Participant } from 'src/app/models/tournament';
import { MyRouteData, TournamentService } from 'src/app/services/tournament.service';

@Component({
  selector: 'app-tournament-participants',
  templateUrl: './tournament-participants.component.html',
  styleUrls: ['./tournament-participants.component.scss']
})
export class TournamentParticipantsComponent implements OnInit {
  public mine: Observable<any>;

  constructor(
    public route: ActivatedRoute,
    public tournamentService: TournamentService,
  ) {
    this.mine = tournamentService.getForParams(route.paramMap)
    .pipe(map((data: MyRouteData) => ({
        participants: data.tournament.participants
          .filter(p => !p.hidden)
          .sort((a: Participant, b: Participant) => (a.name as string) < (b.name as string) ? -1 : 1),
        ...data
      })
    ))
    .pipe(tap(x => console.log(x)));
  }

  ngOnInit(): void {
  }

}
