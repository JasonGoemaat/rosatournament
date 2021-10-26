import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { MyRouteData, TournamentService } from 'src/app/services/tournament.service';
import { UtilService } from 'src/app/services/util.service';
import { TournamentViewModel } from "../../models/tournament-view-model";

// used for quick design to see what data I needed
const sampleData = [
  {
    matchIndex: 0,
    timeString: '9:00 am',
    matchName: 'WA',
    participants1: ['Jeff Livingston'],
    participants2: ['Kade Rosa']
  },
  {
    matchIndex: 1,
    timeString: '9:30 am',
    matchName: 'WB',
    participants1: ['Jason Goemaat'],
    participants2: ['Brent Kolk']
  },
  {
    matchIndex: 2,
    timeString: '10:00 am',
    matchName: 'WC',
    participants1: ['Danny Martin'],
    participants2: ['Jack Rosa']
  },
  {
    matchIndex: 3,
    timeString: '10:30 am',
    matchName: 'WD',
    participants1: ['Doug Liebe'],
    participants2: ['Chris Goldenstein']
  },
  {
    matchIndex: 4,
    timeString: '11:00 am',
    matchName: 'WE',
    participants1: ['Tim Martin'],
    participants2: ['Kurt Berry']
  }
];

export const getParticipantsForMatchId = (vm: TournamentViewModel, matchIndex: number, winnerOrLoser: string) : string[] => {
  const match = vm.config.matches[matchIndex];
  let participantA = vm.getParticipant(vm.tournament.spotParticipant[match.spotA]);
  let participantB = vm.getParticipant(vm.tournament.spotParticipant[match.spotB]);
  if (participantA && participantB) {
    return [`${participantA.name || 'UNKNOWN'}`, '-or-', `${participantB.name || 'UNKNOWN'}`];
  } else {
    return [`${winnerOrLoser} of ${match.name}`];
  }
}

export const getParticipantsForSpot = (vm: TournamentViewModel, spotIndex: number) : string[] => {
  let spotConfig = vm.config.spots[spotIndex];

  // if a participant is set for the spot
  let participantId = vm.tournament.spotParticipant[spotIndex];
  if (participantId) {
    return [vm.getParticipant(participantId).name || 'UNKNOWN'];
  }

  // if it's a seed spot, return seed info
  if (spotConfig.seed) {
    return [`Seed {spotConfig.seed}`];
  }

  // no participant yet, must be a match yet to be played
  if (typeof(spotConfig.winnerOfMatch) === 'number') {
    return getParticipantsForMatchId(vm, spotConfig.winnerOfMatch as number, 'Winner');
  } else if (typeof(spotConfig.loserOfMatch) === 'number') {
    return getParticipantsForMatchId(vm, spotConfig.loserOfMatch, 'Loser');
  }

  return ['UNKONWN'];
}

export const parseForMatches = (data: MyRouteData) => {
  let result: any = {...data};

  let matches = data.vm.getMatches().map((match, matchIndex) => {
    let result: any = {...match};

    // has match been played?
    if (match.result && match.result.isFinished) {
      const winner = data.vm.getParticipant(match.result.matchWinner as number);
      const loser = data.vm.getParticipant(match.result.matchLoser as number);
      result.model = {
        matchIndex: matchIndex,
        timeString: UtilService.formatTime(match.utc),
        matchName: match.name,
        winnerName: winner.name,
        loserName: loser.name
      }
    } else {
      result.model = {
        matchIndex: matchIndex,
        timeString: UtilService.formatTime(match.utc),
        matchName: match.name,
        participants1: getParticipantsForSpot(data.vm, match.spotA),
        participants2: getParticipantsForSpot(data.vm, match.spotB)
      }
    }
    
    return result;
  });

  let unplayed = matches.filter(match => !(match.result && match.result.isFinished));
  let played = matches.filter(match => (match.result && match.result.isFinished)).reverse(); // reversed to show most recent first

  let some = unplayed.splice(0, 5);
  let more = unplayed;
  return {...data, some, more, played };
}

@Component({
  selector: 'app-tournament-matches',
  templateUrl: './tournament-matches.component.html',
  styleUrls: ['./tournament-matches.component.scss']
})
export class TournamentMatchesComponent implements OnInit {
  data$: Observable<any>;

  showMore = false;
  showPlayed = false;

  parseForMatches = parseForMatches; // for debugging in console
  getParticipantsForSpot = getParticipantsForSpot; // for debugging in console

  constructor(
    public route: ActivatedRoute,
    public service: TournamentService,
    public router: Router,
  ) {
    (window as any).cMatches = this;
    this.data$ = service.getForParams(route.paramMap)
    .pipe(map(parseForMatches))
    .pipe(tap(x => {
      console.log('cMatches:', x);
      (window as any).x = x;

      // automatically show more if there aren't any (basically don't show link)
      if (x.more.length === 0) {
        this.showMore = true;
      }

      // if all matches have been played, show played
      if (x.some.length === 0) {
        this.showPlayed = true;
      }
    }))
  }

  clickShowMore(data: any) {
    this.showMore = true;
  }

  clickShowPlayed(data: any) {
    this.showPlayed = true;
  }

  openMatch(data: any, match: any) {
    this.router.navigate(['/', 'tournaments', data.tournamentId, 'matches', match.matchIndex]);
  }

  ngOnInit(): void {
  }
}
