import { UtilService } from "../services/util.service";
import { GameResult, Participant, Tournament } from "./tournament";
import { TournamentConfig, SpotConfig } from "./tournament-config";

export interface SpotModel {
  index: number;
  isWinner?: boolean;
  isLoser?: boolean;
  isItalic?: boolean;
  isBold?: boolean;
  gameName?: string;
  text: string;
  config: SpotConfig;
}

export interface ParticipantModel extends Participant {
  index: number; // index into Tournament.participants
  gamesWon: number;
  gamesLost: number;
  matchesWon: number;
  matchesLost: number;
}

export interface ParticipantViewModel {
  index: number,
  id: number,
  name: string,
}

export class TournamentViewModel {
    public spots: SpotModel[];
    public participants: Record<number, ParticipantModel> = {};
    public participantList: ParticipantModel[] = [];

    constructor(
      public config: TournamentConfig,
      public tournament: Tournament
    ) {
        const spots = this.spots = this.getSpots();
    }

    /**
     * vm.spots will have spot information ready to display in the bracket
     */
    getSpots() : SpotModel[] {
      const {config, tournament} = this;

      const spots = config.spots.map((spotConfig, index) => <SpotModel>{ text: `Spot ${index}`, config: spotConfig, index });

      // process games adding game name and time
      config.matches.forEach((gameConfig, gameIndex) => {
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
      })

      // for seeds, use display name as text - th is is spotParticipant
      for(const k in tournament.spotParticipant) {
          const spotIndex = Number(k);
          const participantId = tournament.spotParticipant[spotIndex]; // participant id
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

      return spots;
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
        let gameConfig = this.config.matches[timeSlot.gameId];
        let participantA = this.getParticipant(this.tournament.spotParticipant[gameConfig.spotA]) || unknownParticipant;
        let participantB = this.getParticipant(this.tournament.spotParticipant[gameConfig.spotB]) || unknownParticipant;
        return {
          ...gameConfig, ...timeSlot, participantA, participantB, result: this.tournament.gameResultMap[timeSlot.gameId]
        }
      });
      return games;
    }

    deleteGameResult(gameId: number, useTournament?: Tournament) : Tournament {
      const tournament = useTournament ? useTournament : this.tournament;
      const config = this.config.matches[gameId];
      if (config.winnerTo) delete tournament.spotParticipant[config.winnerTo];
      if (config.loserTo) delete tournament.spotParticipant[config.loserTo];
      delete tournament.gameResultMap[gameId];
      return tournament;
    }

    // to reset final 2 games (from /games):
    // var t = x.vm.cloneTournament(); delete t.gameResultMap[29]; delete t.gameResultMap[30]; cGames.service.setTournament(x.tournamentId, t);
    // var t = x.vm.cloneTournament(); [58, 59, 60, 61].forEach(i => delete t.spotParticipant[i]); cGames.service.setTournament(x.tournamentId, t);
    // ----- or -----
    // var t = x.vm.deleteGameResult(29);
    // t = x,vm.deleteGameResult(30, t);
    // cGame.service.setTournament(x.tournamentId, t);
    setGameResult(gameId: any, info: { lagWinner?: number; matchWinner?: number; gameWinners: (number)[]; }, useTournament?: Tournament) {
      // use passed tournament or clone a new one
      let tournament = useTournament ? useTournament : this.cloneTournament();

      const gameConfig = this.config.matches[gameId];

      const {lagWinner, matchWinner, gameWinners} = info;
      const A = tournament.spotParticipant[gameConfig.spotA];
      const B = tournament.spotParticipant[gameConfig.spotB];

      let matchLoser = undefined;
      let isFinished = false;
      if (matchWinner) {
        isFinished = true;
        matchLoser = (matchWinner === A) ? B : A; // loser is other

        const winnerSourceSpot = (matchWinner === A) ? gameConfig.spotA : gameConfig.spotB;
        const loserSourceSpot = (matchWinner === A) ? gameConfig.spotB : gameConfig.spotA;
        tournament.resultMap[winnerSourceSpot] = true;
        tournament.resultMap[loserSourceSpot] = false;
        tournament.spotParticipant[gameConfig.winnerTo as number] = matchWinner;
        tournament.spotParticipant[gameConfig.loserTo as number] = matchLoser;
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
        tournament.spotParticipant[gameConfig.loserTo as number] = notNeededId;
        tournament.gameResultMap[skippedGameId].skipped = true;
        tournament.gameResultMap[skippedGameId].matchWinner = notNeededId;
      }

      return tournament;
    }

    // OLD method - deprecated and doesn't work
    declareWinner(gameId: number, winnerId: number): Tournament {
      const tournament = this.cloneTournament();
      const gameConfig = this.config.matches[gameId];
      const info = this.getParticipant(tournament.spotParticipant[gameConfig.spotA]).id === winnerId ? {
        winnerSourceSpot: gameConfig.spotA,
        loserSourceSpot: gameConfig.spotB,
        winner: tournament.spotParticipant[gameConfig.spotA],
        loser: tournament.spotParticipant[gameConfig.spotB],
      } : {
        winnerSourceSpot: gameConfig.spotB,
        loserSourceSpot: gameConfig.spotA,
        winner: tournament.spotParticipant[gameConfig.spotB],
        loser: tournament.spotParticipant[gameConfig.spotA],
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
      tournament.spotParticipant[gameConfig.winnerTo as number] = info.winner;
      tournament.spotParticipant[gameConfig.loserTo as number] = info.loser;
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
        const participant = this.tournament.spotParticipant[index];
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
      n.spotParticipant = {...n.spotParticipant};
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

    /**
     * Get array of player ids that might be in this spot as a record with the spot index
     * as the key.
     * 
     * Sample usage: data.vm.getPossiblePlayers()[47].map(x => data.vm.getParticipant(x).name)
     */
    getPossiblePlayers() {
      const spotMap: Record<number, number[]> = {};

      // fill in spots where we know the player
      const {tournament, config} = this;
      Object.keys(tournament.spotParticipant).forEach((key) => {
        const keyNumber = Number(key)
        const value = tournament.spotParticipant[keyNumber];
        spotMap[keyNumber] = [value]
      });

      // Follow unplayed games to find ids of players that might get there.
      // Use timeSlots to get games in play order which should make sure
      // there are players in the spots we're getting from
      this.getUnfinishedGames().forEach(({gameId}) => {
        const {spotA, spotB, winnerTo, loserTo} = config.matches[gameId];
        const possible = [...spotMap[spotA], ...spotMap[spotB]];
        if(winnerTo) spotMap[winnerTo] = possible;
        if(loserTo) spotMap[loserTo] = possible;
      });

      return spotMap;
    }

    getUnfinishedGamesForParticipant(participantId: number) {

    }

    getUnfinishedGames(): ({gameId: number,  utc: number, timeSlotIndex: number}[]) {
      const {tournament, config} = this;
      return tournament.timeSlots.map(({gameId, utc}, timeSlotIndex) => {
        if (tournament.gameResultMap[gameId] && tournament.gameResultMap[gameId].isFinished) return null;
        return {gameId, utc, timeSlotIndex};
        //const {spotA, spotB, winnerTo, loserTo} = config.games[gameId];
        // const possible = [...spotMap[spotA], ...spotMap[spotB]];
        // if(winnerTo) spotMap[winnerTo] = possible;
        // if(loserTo) spotMap[loserTo] = possible;
      }).filter(x => x != null) as {gameId: number,  utc: number, timeSlotIndex: number}[];
    }

    getParticipantViewModels() {
      const {participants, gameResultMap, spotParticipant, timeSlots} = this.tournament;
      const results = participants.map((x, index) => ({...x, index})).filter(x => !x.hidden).map(participant => {
        // want the game results in time order where it is the winner or loser
        // parse games to get lags, games, and matches won/lost

        const spotsIds = Object.keys(spotParticipant).reduce((acc, key) => {
          const participantId = spotParticipant[Number(key)];
          if (participantId === participant.id) {
            acc.push(Number(key));
          }
          return acc;
        }, <number[]>[]);
        const games = this.tournament.timeSlots.map(x => {
        });
      });
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