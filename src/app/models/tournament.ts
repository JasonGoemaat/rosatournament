export interface Participant {
  name?: string;
  id?: number;
  seed?: number;
  uid?: string;
  isHidden?: boolean; // for 'BYE' and 'NOT NEEDED' players
  hasPaid?: boolean;
}

export type spotParticipant = Record<number, number>

export type ResultMap = Record<number, boolean>

export interface Tournament {
  ownerUid?: string;
  ownerName?: string;
  name?: string;
  participants: Participant[];
  isPublic: boolean;
  scheduleMinutes: number;
  timeSlots: TimeSlot[];
  spotParticipant: spotParticipant; // index with spot, gives participant ID
  resultMap: ResultMap; // index with spot, tells you if they won (true), lost (false) or haven't played (undefined)
  matchResultMap: MatchResultMap;
  roles: Record<string, string>;
}

export interface MatchResult {
  isFinished?: boolean;
  skipped?: boolean; // for matches where there is a BYE or not played if winner bracket winner never loses
  matchWinner?: number;
  matchLoser?: number;
  lagWinner?: number, // who won the lag (if we want to track)
  gameWinners?: number[]; // IDs for winner of each match played (if we want to track)
  startTime?: number;
  endTime?: number;
  entryTime?: number;
}

// Tournament.matches is MatchMap, match is only added when it is scored
export type MatchResultMap = Record<number, MatchResult>

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
  matchIndex: number;
}

export type TournamentSpots = Record<number, TournamentSpot>;

export interface TournamentData {
  spots: TournamentSpots;
}

export const data = {
  spots: { },
  matchMap: {},
  timeSlots: [
  ]
}



/* Actions:

SeatPlayer(playerId, spotIndex) - puts player in spot
DeclareWinner(matchIndex, winnerindex) - assigns winner and loser, puts them into the new spots automatically

Display:

If spot has displayName set, 
*/
