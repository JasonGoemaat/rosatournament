import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { MyRouteData, TournamentService } from 'src/app/services/tournament.service';
import { UtilService } from 'src/app/services/util.service';
import { TournamentViewModel } from "../../models/tournament-view-model";

const sampleData = [
  {
    gameId: 0,
    timeString: '9:00 am',
    gameName: 'WA',
    participants1: ['Jeff Livingston'],
    participants2: ['Kade Rosa']
  },
  {
    gameId: 1,
    timeString: '9:30 am',
    gameName: 'WB',
    participants1: ['Jason Goemaat'],
    participants2: ['Brent Kolk']
  },
  {
    gameId: 2,
    timeString: '10:00 am',
    gameName: 'WC',
    participants1: ['Danny Martin'],
    participants2: ['Jack Rosa']
  },
  {
    gameId: 3,
    timeString: '10:30 am',
    gameName: 'WD',
    participants1: ['Doug Liebe'],
    participants2: ['Chris Goldenstein']
  },
  {
    gameId: 4,
    timeString: '11:00 am',
    gameName: 'WE',
    participants1: ['Tim Martin'],
    participants2: ['Kurt Berry']
  }
];

export const getParticipantsForGameId = (vm: TournamentViewModel, gameIndex: number, winnerOrLoser: string) : string[] => {
  const game = vm.config.games[gameIndex];
  let participantA = vm.getParticipant(vm.tournament.participantMap[game.spotA]);
  let participantB = vm.getParticipant(vm.tournament.participantMap[game.spotB]);
  if (participantA && participantB) {
    return [`${participantA.name || 'UNKNOWN'}`, '-or-', `${participantB.name || 'UNKNOWN'}`];
  } else {
    return [`${winnerOrLoser} of ${game.name}`];
  }
}

export const getParticipantsForSpot = (vm: TournamentViewModel, spotIndex: number) : string[] => {
  let spotConfig = vm.config.spots[spotIndex];

  // if a participant is set for the spot
  let participantId = vm.tournament.participantMap[spotIndex];
  if (participantId) {
    return [vm.getParticipant(participantId).name || 'UNKNOWN'];
  }

  // if it's a seed spot, return seed info
  if (spotConfig.seed) {
    return [`Seed {spotConfig.seed}`];
  }

  // no participant yet, must be a game yet to be played
  if (typeof(spotConfig.winnerOfGame) === 'number') {
    return getParticipantsForGameId(vm, spotConfig.winnerOfGame as number, 'Winner');
  } else if (typeof(spotConfig.loserOfGame) === 'number') {
    return getParticipantsForGameId(vm, spotConfig.loserOfGame, 'Loser');
  }

  return ['UNKONWN'];
}

export const parseForGames = (data: MyRouteData) => {
  let result: any = {...data};

  let games = data.vm.getGames().map((game, gameIndex) => {
    let result: any = {...game};

    // has game been played?
    if (game.result) {
      const winner = data.vm.getParticipant(game.result.matchWinner as number);
      const loser = data.vm.getParticipant(game.result.matchLoser as number);
      result.model = {
        gameId: gameIndex,
        timeString: UtilService.formatTime(game.utc),
        gameName: game.name,
        winnerName: winner.name,
        loserName: loser.name
      }
    } else {
      result.model = {
        gameId: gameIndex,
        timeString: UtilService.formatTime(game.utc),
        gameName: game.name,
        participants1: getParticipantsForSpot(data.vm, game.spotA),
        participants2: getParticipantsForSpot(data.vm, game.spotB)
      }
    }
    
    return result;
  });

  let unplayed = games.filter(game => !game.result);
  let played = games.filter(game => game.result).reverse(); // reversed to show most recent first

  let some = unplayed.splice(0, 5);
  let more = unplayed;
  return {...data, some, more, played };
}

@Component({
  selector: 'app-tournament-games',
  templateUrl: './tournament-games.component.html',
  styleUrls: ['./tournament-games.component.scss']
})
export class TournamentGamesComponent implements OnInit {
  data$: Observable<any>;

  showMore = false;
  showPlayed = false;

  parseForGames = parseForGames; // for debugging in console
  getParticipantsForSpot = getParticipantsForSpot; // for debugging in console

  constructor(
    public route: ActivatedRoute,
    public service: TournamentService,
  ) {
    (window as any).cGames = this;
    this.data$ = service.getForParams(route.paramMap)
    .pipe(map(parseForGames))
    .pipe(tap(x => {
      console.log('cGames:', x);
      (window as any).x = x;

      // automatically show more if there aren't any (basically don't show link)
      if (x.more.length === 0) {
        this.showMore = true;
      }

      // if all games have been played, show played
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

  ngOnInit(): void {
  }
}
