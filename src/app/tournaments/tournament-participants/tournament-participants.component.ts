import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Participant } from 'src/app/models/tournament';
import { MyRouteData, TournamentService } from 'src/app/services/tournament.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-tournament-participants',
  templateUrl: './tournament-participants.component.html',
  styleUrls: ['./tournament-participants.component.scss']
})
export class TournamentParticipantsComponent implements OnInit {
  public data$: Observable<any>;

  constructor(
    public route: ActivatedRoute,
    public tournamentService: TournamentService,
    public router: Router,
  ) {
    (window as any).cParticipants = this;

    this.data$ = tournamentService.getForParams(route.paramMap)
    .pipe(map((data: MyRouteData) => ({
        // participants: data.tournament.participants
        //   .filter(p => !p.isHidden)
        //   .sort((a: Participant, b: Participant) => (a.name as string) < (b.name as string) ? -1 : 1),
        participants: data.vm.participantList
          .filter(x => !x.isHidden)
          .sort(UtilService.sortBy(x => x.name))
          .map(p => {
            const getSubtitle = () => {
              // record, or (Not Played)
              if (p.matchesWon + p.matchesLost) {
                return `${p.matchesWon}-${p.matchesLost} (${p.gamesWon}-${p.gamesLost} games, ${p.lagsWon} lags)`;
              }
              return null;
            }

            const getRecord = () => (p.matchesWon + p.matchesLost) ? `${p.matchesWon}-${p.matchesLost}` : null;

            const getContent = () => {
              if (p.isFinished) {
                return UtilService.getPlaceString(p.place);
              }
              
              if (!p.nextMatch) {
                return 'WEIRD!  Not finished and no next match?';
              }

              const id = p.id as number;
              const opponents = [
                ...(p.nextMatch.participantsAIds.has(id) ? [...p.nextMatch.participantsBIds] : []),
                ...(p.nextMatch.participantsBIds.has(id) ? [...p.nextMatch.participantsAIds] : []),
              ].filter(x => x !== id)
              .map(x => data.vm.participants[x].name as string)
              .sort();

              const opponentsString = opponents.join(' or ');

              return `${p.nextMatch.timeString} vs. ${opponentsString}`;
            }

            let result = {
              ...p,
              // subtitle: getSubtitle(),
              content: getContent(),
              record: getRecord(),
              isPlaced: !!(p.isFinished && p.place),
              isNotPlaced: p.isFinished && !p.place,
            }

            return result;
          }),
        ...data,
      })
    ))
    .pipe(tap(x => {
      console.log(x);
      (window as any).x = x;
    }));
  }

  ngOnInit(): void {
  }

  onClickParticipant(data: any, participant: any) {
    this.router.navigate(['tournaments', data.tournamentId, 'participants', participant.id]);
  }
}
