import { UtilService } from "../services/util.service";
import { GameResult, Participant, Tournament } from "./tournament";
import { TournamentConfig, TournamentSpotConfig } from "./tournament-config";

export interface SpotViewModel {
  index: number;
  isWinner?: boolean;
  isLoser?: boolean;
  isItalic?: boolean;
  isBold?: boolean;
  gameName?: string;
  text: string;
  config: TournamentSpotConfig;
}

export class TournamentViewModel {
    public spots: SpotViewModel[];

    constructor(
      public config: TournamentConfig,
      public tournament: Tournament
    ) {
        const spots = config.spots.map((spotConfig, index) => <SpotViewModel>{ text: `Spot ${index}`, config: spotConfig, index });
        this.spots = spots;

        // process games adding game name and time
        config.games.forEach((gameConfig, gameIndex) => {
            const { winnerTo, loserTo, name } = gameConfig;
            if (winnerTo) {
                spots[winnerTo].gameName = name;
                const timeSlot = tournament.timeSlots.find(ts => ts.gameId == gameIndex);
                if (timeSlot) {
                    const utc = timeSlot.utc;
                    //spots[winnerTo].text = getTimeString(utc);
                    spots[winnerTo].text = UtilService.formatTime(utc);
                  } else {
                    spots[winnerTo].text = 'BAD SLOT TIME';
                }
                spots[winnerTo].isBold = true;
            }
            if (loserTo) {
                spots[loserTo].text = `(loser of ${name})`
                spots[loserTo].isItalic = true
            }

            // later, check for data with winner and loser info, colorize those spots
        })

        // for seeds, use display name as text - th is is participantMap
        for(const k in tournament.participantMap) {
            const spotIndex = Number(k);
            const participantId = tournament.participantMap[spotIndex]; // participant id
            const spot = spots[spotIndex];
            const participant = tournament.participants.find(p => p.id == participantId);
            if (participant) {
                spot.text = participant.name || 'UNKNOWN';
                spot.config = config.spots[spotIndex];
                spot.isBold = false;
                spot.isItalic = false;
            }
        }

        // for spots that have played, style winners and losers
        for(const k in tournament.resultMap) {
          const spotIndex = Number(k);
          const spot = spots[spotIndex];
          const result = tournament.resultMap[spotIndex];
          spot.isWinner = (result === true);
          spot.isLoser = (result === false);
      }
  }

    getParticipant(participantId: number) : Participant {
      return this.tournament.participants.find(p => p.id === participantId) as Participant;
    }

    /**
     * To show upcoming games, list unplayed games in order by time slot
     */
    getGames(unplayedOnly = false) {
      const timeSlots = this.tournament.timeSlots.filter(timeSlot => !unplayedOnly || this.tournament.gameResultMap[timeSlot.gameId] === undefined);
      const unknownParticipant: Participant = { name: 'UNKNOWN' };
      const games = timeSlots.map(timeSlot => {
        let gameConfig = this.config.games[timeSlot.gameId];
        let participantA = this.getParticipant(this.tournament.participantMap[gameConfig.spotA]) || unknownParticipant;
        let participantB = this.getParticipant(this.tournament.participantMap[gameConfig.spotB]) || unknownParticipant;
        return {
          ...gameConfig, ...timeSlot, participantA, participantB, result: this.tournament.gameResultMap[timeSlot.gameId]
        }
      });
      return games;
    }

    deleteGameResult(gameId: number, useTournament?: Tournament) : Tournament {
      const tournament = useTournament ? useTournament : this.tournament;
      const config = this.config.games[gameId];
      if (config.winnerTo) delete tournament.participantMap[config.winnerTo];
      if (config.loserTo) delete tournament.participantMap[config.loserTo];
      delete tournament.gameResultMap[gameId];
      return tournament;
    }

    // to reset final 2 games (from /games):
    // var t = x.vm.cloneTournament(); delete t.gameResultMap[29]; delete t.gameResultMap[30]; cGames.service.setTournament(x.tournamentId, t);
    // var t = x.vm.cloneTournament(); [58, 59, 60, 61].forEach(i => delete t.participantMap[i]); cGames.service.setTournament(x.tournamentId, t);
    // ----- or -----
    // var t = x.vm.deleteGameResult(29);
    // t = x,vm.deleteGameResult(30, t);
    // cGame.service.setTournament(x.tournamentId, t);
    setGameResult(gameId: any, info: { lagWinner: number | undefined; matchWinner: number | undefined; gameWinners: (number)[]; }, useTournament?: Tournament) {
      // use passed tournament or clone a new one
      let tournament = useTournament ? useTournament : this.cloneTournament();

      const gameConfig = this.config.games[gameId];

      const {lagWinner, matchWinner, gameWinners} = info;
      const A = tournament.participantMap[gameConfig.spotA];
      const B = tournament.participantMap[gameConfig.spotB];

      let matchLoser = undefined;
      let isFinished = false;
      if (matchWinner) {
        isFinished = true;
        matchLoser = (matchWinner === A) ? B : A; // loser is other

        const winnerSourceSpot = (matchWinner === A) ? gameConfig.spotA : gameConfig.spotB;
        const loserSourceSpot = (matchWinner === A) ? gameConfig.spotB : gameConfig.spotA;
        tournament.resultMap[winnerSourceSpot] = true;
        tournament.resultMap[loserSourceSpot] = false;
        tournament.participantMap[gameConfig.winnerTo as number] = matchWinner;
        tournament.participantMap[gameConfig.loserTo as number] = matchLoser;
      }

      var oldResult = tournament.gameResultMap[gameId];
      const startTime = oldResult && oldResult.startTime ? oldResult.startTime : Date.now()

      var gameResult: GameResult = {
        isFinished,
        matchWinner,
        matchLoser,
        lagWinner,
        gameWinners,
        startTime,
        endTime: Date.now(),
        entryTime: Date.now(),
      }

      if (!gameResult.lagWinner) delete gameResult.lagWinner;
      if (!gameResult.matchWinner) delete gameResult.matchWinner;
      if (!gameResult.matchLoser) delete gameResult.matchLoser;

      console.log('setting gameResult:', gameResult);
      console.log('gameId:', gameId);

      tournament.gameResultMap[gameId] = gameResult;

      //--------------------------------------------------------------------------------
      // if the game we just set the result for is the playoff game
      // (ifAWinsSkipGame is set) and A won, then we can skip this game.  To do that
      // we set the gameResult as if A won again and recursively call this function
      // to make it appear as if they played the game and A won.  Then we just alter
      // that game result to show that B was really a BYE.  This should put everyone
      // in the correct spots
      //--------------------------------------------------------------------------------
      if (gameConfig.ifAWinsSkipGame as number >= 0 && matchWinner === A) {
        // set game result as if A won again
        const skippedGameId = gameConfig.ifAWinsSkipGame as number;
        tournament = this.setGameResult(skippedGameId, {matchWinner, gameWinners: [], lagWinner: undefined}, tournament);
        
        // change person at spotB of skipped game to 'NOT NEEDED'
        const notNeededId = this.getNotNeededParticipant().id as number;
        tournament.participantMap[gameConfig.loserTo as number] = notNeededId;
        tournament.gameResultMap[skippedGameId].skipped = true;
        tournament.gameResultMap[skippedGameId].matchWinner = notNeededId;
      }

      return tournament;
    }

    // OLD method - deprecated and doesn't work
    declareWinner(gameId: number, winnerId: number): Tournament {
      const tournament = this.cloneTournament();
      const gameConfig = this.config.games[gameId];
      const info = this.getParticipant(tournament.participantMap[gameConfig.spotA]).id === winnerId ? {
        winnerSourceSpot: gameConfig.spotA,
        loserSourceSpot: gameConfig.spotB,
        winner: tournament.participantMap[gameConfig.spotA],
        loser: tournament.participantMap[gameConfig.spotB],
      } : {
        winnerSourceSpot: gameConfig.spotB,
        loserSourceSpot: gameConfig.spotA,
        winner: tournament.participantMap[gameConfig.spotB],
        loser: tournament.participantMap[gameConfig.spotA],
      }

      var gameResult: GameResult = {
        isFinished: true,
        matchWinner: info.winner,
        matchLoser: info.loser,
        lagWinner: info.winner,
        gameWinners: [info.winner, info.loser, info.winner],
        startTime: Date.now() - 20 * 60 * 1000,
        endTime: Date.now(),
        entryTime: Date.now()
      }

      tournament.gameResultMap[gameId] = gameResult;
      tournament.resultMap[info.winnerSourceSpot] = true;
      tournament.resultMap[info.loserSourceSpot] = false;
      tournament.participantMap[gameConfig.winnerTo as number] = info.winner;
      tournament.participantMap[gameConfig.loserTo as number] = info.loser;
      return tournament;
    }

    getGameResultForSpot(spotIndex: number) : GameResult | null {
      return null;
    }

    getUpcomingGames() {
      const games = this.getGames(true).slice(0, 5);
      const game = games[0];
    }

    /**
     * Get all possible players that can go in a spot.  If spot has a player, use
     * that.  Otherwise parse unplayed games and add to a list.
     */
    generatePossiblePlayers(): any[] {
      const mapped = this.config.spots.map((spot, index) => {
        let result: any = {...spot};
        const participant = this.tournament.participantMap[index];
        if (participant) {
          result.participant = participant;
          result.possible = [participant];
        } else {
          result.possible = [];
        }
      });
      this.getGames(true).forEach(game => {
      })
      return []; // TODO: finish this?
    }

    /**
     * Used for immutability, copies tournament data in an immutable way to allow changes
     */
    cloneTournament(): Tournament {
      // create BYE and NOT NEEDED participants if they don't exist
      this.getByeParticipant();
      this.getNotNeededParticipant();

      const t = this.tournament;
      const n: Tournament = {...t}
      n.participants = n.participants.map(x => ({...x}));
      n.timeSlots = n.timeSlots.map(x => ({...x}));
      n.participantMap = {...n.participantMap};
      n.resultMap = {...n.resultMap};
      n.gameResultMap = {...n.gameResultMap};
      Object.keys(n.gameResultMap).forEach(key => {
        const k = Number(key);
        const map = {...n.gameResultMap[k]};
        const winners = map.gameWinners;
        if (winners) {
          n.gameResultMap[k].gameWinners = [...winners];
        }
      });
      return n;
    }

    getByeParticipant(useTournament?: Tournament): Participant {
      const tournament = useTournament ? useTournament : this.tournament;
      let result = tournament.participants.find(p => p.hidden && p.name === 'BYE');
      if (!result) {
        let newId = tournament.participants.reduce((acc, v) => Math.max(acc, v.id as number), 0) + 1;
        result = {
          id: newId,
          hidden: true,
          name: 'BYE'
        };
        tournament.participants.push(result);
      }
      return result;
    }

    getNotNeededParticipant(useTournament?: Tournament): Participant {
      const tournament = useTournament ? useTournament : this.tournament;
      let result = tournament.participants.find(p => p.hidden && p.name === 'NOT NEEDED');
      if (!result) {
        let newId = tournament.participants.reduce((acc, v) => Math.max(acc, v.id as number), 0) + 1;
        result = {
          id: newId,
          hidden: true,
          name: 'NOT NEEDED'
        };
        tournament.participants.push(result);
      }
      return result;
    }
}

/*

export interface Game {
  isFinished?: boolean;
  matchWinner?: number;
  matchLoser?: number;
  lagWinner?: number, // who won the lag (if we want to track)
  gameWinners?: []; // IDs for winner of each game played (if we want to track)
  startTime?: number;
  endTime?: number;
  entryTime?: number;
}
*/