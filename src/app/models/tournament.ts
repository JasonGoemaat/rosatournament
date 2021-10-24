export interface Participant {
  name?: string;
  id?: number;
  seed?: number;
  uid?: string;
}

export type ParticipantMap = Record<number, number>

export type ResultMap = Record<number, boolean>

export interface Tournament {
  ownerUid: string | undefined;
  ownerName: string | undefined;
  name: string | undefined;
  participants: Participant[];
  isPublic: boolean;
  scheduleMinutes: number;
  timeSlots: TimeSlot[];
  participantMap: ParticipantMap; // index with spot, gives participant ID
  resultMap: ResultMap; // index with spot, tells you if they won (true), lost (false) or haven't played (undefined)
  gameResultMap: GameResultMap;
}

export interface GameResult {
  isFinished?: boolean;
  matchWinner?: number;
  matchLoser?: number;
  lagWinner?: number, // who won the lag (if we want to track)
  gameWinners?: number[]; // IDs for winner of each game played (if we want to track)
  startTime?: number;
  endTime?: number;
  entryTime?: number;
}

// Tournament.games is GameMap, game is only added when it is scored
export type GameResultMap = Record<number, GameResult>

export interface TournamentSpot {
  playerId?: number;
  isWinner?: boolean;
  isLoser?: boolean;
  isBye?: boolean;
  displayTime?: string;
  displayName?: string;
  className?: string;
}

export interface TimeSlot {
  utc: number;
  gameId: number;
}

export type TournamentSpots = Record<number, TournamentSpot>;

export interface TournamentData {
  spots: TournamentSpots;
}

export const data = {
  spots: { },
  gameMap: {},
  timeSlots: [
  ]
}



/* Actions:

SeatPlayer(playerId, spotIndex) - puts player in spot
DeclareWinner(gameIndex, winnerindex) - assigns winner and loser, puts them into the new spots automatically

Display:

If spot has displayName set, 
*/
