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

const rxTime = /([0-9]+:)([0-9]+):[0-9]+( AM| PM)/
const getTimeString = (utc: number) => {
    const lts = new Date(utc).toLocaleTimeString();
    const arr = lts.match(rxTime);
    return arr ? arr.slice(1).join('') : 'BAD TIME';
}

export class TournamentViewModel {
    public spots: SpotViewModel[];

    constructor(public config: TournamentConfig, public tournament: Tournament) {
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
                    spots[winnerTo].text = getTimeString(utc);
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
        let result = {};
        let gameConfig = this.config.games[timeSlot.gameId];
        let participantA = this.getParticipant(this.tournament.participantMap[gameConfig.spotA]) || unknownParticipant;
        let participantB = this.getParticipant(this.tournament.participantMap[gameConfig.spotB]) || unknownParticipant;
        return {
          ...gameConfig, ...timeSlot, participantA, participantB, result: this.tournament.gameResultMap[timeSlot.gameId]
        }
      });
      return games;
    }

    declareWinner(gameId: number, winnerId: number) {
      const gameConfig = this.config.games[gameId];
      const info = this.getParticipant(this.tournament.participantMap[gameConfig.spotA]).id === winnerId ? {
        winnerSourceSpot: gameConfig.spotA,
        loserSourceSpot: gameConfig.spotB,
        winner: this.tournament.participantMap[gameConfig.spotA],
        loser: this.tournament.participantMap[gameConfig.spotB],
      } : {
        winnerSourceSpot: gameConfig.spotB,
        loserSourceSpot: gameConfig.spotA,
        winner: this.tournament.participantMap[gameConfig.spotB],
        loser: this.tournament.participantMap[gameConfig.spotA],
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

      this.tournament.gameResultMap[gameId] = gameResult;
      this.tournament.resultMap[info.winnerSourceSpot] = true;
      this.tournament.resultMap[info.loserSourceSpot] = false;
      this.tournament.participantMap[gameConfig.winnerTo as number] = info.winner;
      this.tournament.participantMap[gameConfig.loserTo as number] = info.loser;

      console.log('gameConfig:', gameConfig);
      console.log('info:', info);
      console.log('resultMap:', this.tournament.resultMap);
      console.log('gameResultMap:', this.tournament.gameResultMap);
      console.log('participantMap:', this.tournament.participantMap);
    }

    getGameResultForSpot(spotIndex: number) : GameResult | null {
      return null;
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