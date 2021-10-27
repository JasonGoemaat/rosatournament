import { UtilService } from "../services/util.service";
import { MatchResult, Participant, Tournament } from "./tournament";
import { TournamentConfig, SpotConfig, MatchConfig } from "./tournament-config";

export interface SpotModel {
  index: number;
  participant?: number;
  isWinner?: boolean;
  isLoser?: boolean;
  isItalic?: boolean;
  isBold?: boolean;
  matchName?: string;
  text: string;
  config: SpotConfig;
  loserOrWinnerText: string; // 'loser of WM' or 'winner of WM'
}

export interface ParticipantModel extends Participant {
  index: number; // index into Tournament.participants
  matchesWon: number;
  matchesLost: number;
  gamesWon: number;
  gamesLost: number;
  lagsWon: number;
  nextMatch?: MatchModel,
  place?: number,
  isFinished?: boolean,
}

/**
 * Match from a participant perspective.  Shows name, time,
 * who you'll play (i.e. '(loser of WB)' or name), time.  Also
 * has list of possible opponents.  And spot of this participant
 * along with spot of other participant.  If this player could
 * be in either spot (i.e. winner bracket winner vs. loser
 * bracket winner), the list of opponents will include everyone
 * that could be faced in either position.
 */
export interface ParticipantMatch {
}

export interface MatchModel {
  timeSlotIndex: number,
  matchIndex: number,
  utc: number,
  timeString: string,
  matchConfig: MatchConfig,
  participantsAIds: Set<number>,
  participantsBIds: Set<number>,
  matchResult: MatchResult,
  isFinished: boolean,
}

export class TournamentViewModel {
    public spotList: SpotModel[];
    public spotPossibleParticipants: Record<number, Set<number>>;
    public matchList: MatchModel[]; // order is by time slot
    public matches: Record<number, MatchModel> = {};
    public participants: Record<number, ParticipantModel> = {}; // by id
    public participantList: ParticipantModel[];

    constructor(
      public config: TournamentConfig,
      public tournament: Tournament
    ) {
        this.spotList = this.generateSpotModels();
        this.spotPossibleParticipants = this.generatePossibleParticipants();
        this.matchList = this.generateMatchModels();
        this.participantList = this.generateParticipantModels();
        this.participantList.forEach(x => this.participants[x.id as number] = x);

        this.matchList.forEach(x => {
          const assignNextMatch = (id: number) => {
            if (!this.participants[id].nextMatch) {
              this.participants[id].nextMatch = x;
              this.participants[id].isFinished = false;
            }
          }

          const matchResult = x.matchResult;

          this.matches[x.matchIndex] = x;
          if (matchResult?.isFinished) {
            const {matchWinner, matchLoser, lagWinner, gameWinners} = matchResult;
            if (matchWinner) this.participants[matchWinner].matchesWon++;
            if (matchLoser) this.participants[matchLoser].matchesLost++;
            if (lagWinner) this.participants[lagWinner].lagsWon++;
            if (gameWinners) {
              gameWinners.forEach(winnerId => {
                const loserId = (winnerId === matchWinner) ? matchLoser : matchWinner; // OTHER participant
                if (winnerId) this.participants[winnerId].gamesWon++;
                if (loserId) this.participants[loserId].gamesLost++;
              })
            }
          } else {
            let a = [...x.participantsAIds];
            let b = [...x.participantsBIds];
            if (a.length === 1) assignNextMatch(a[0]);
            if (b.length === 1) assignNextMatch(b[0]);
          }
        });

        // assign places
        this.spotList.forEach(x => {
          if (x.config.place) {
            const participantId = this.tournament.spotParticipant[x.index];
            if (participantId) this.participants[participantId].place = x.config.place;
          } 
        });
        
        this.participantList.forEach(x => {

        });
    }

    generateParticipantModels(): ParticipantModel[] {
      return this.tournament.participants.map((x, index): ParticipantModel => {
        return {
          index,
          ...x,
          matchesWon: 0,
          matchesLost: 0,
          gamesWon: 0,
          gamesLost: 0,
          lagsWon: 0,
          isFinished: true, // default, will clear if player has upcoming match
        }
      });
    }

    /**
     * vm.spots will have spot information ready to display in the bracket
     */
    generateSpotModels() : SpotModel[] {
      const {config, tournament} = this;

      const spots = config.spots.map((spotConfig, index) => <SpotModel>{ text: `Spot ${index}`, config: spotConfig, index, participant: this.tournament.spotParticipant[index] });

      // process matches adding match name and time
      config.matches.forEach((matchConfig, matchIndex) => {
          const { winnerTo, loserTo, name } = matchConfig;
          if (winnerTo) {
              spots[winnerTo].matchName = name;
              const timeSlot = tournament.timeSlots.find(ts => ts.matchIndex == matchIndex);
              if (timeSlot) {
                  const utc = timeSlot.utc;
                  //spots[winnerTo].text = getTimeString(utc);
                  spots[winnerTo].text = UtilService.formatTime(utc);
                } else {
                  spots[winnerTo].text = 'BAD SLOT TIME';
              }
              spots[winnerTo].isBold = true;
              spots[winnerTo].loserOrWinnerText = `(winner of ${name})`;
          }
          if (loserTo) {
              spots[loserTo].text = spots[loserTo].loserOrWinnerText = `(loser of ${name})`
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


    /**
     * Get array of player ids that might be in this spot as a record with the spot index
     * as the key.
     * 
     * Sample usage: data.vm.getPossiblePlayers()[47].map(x => data.vm.getParticipant(x).name)
     */
     generatePossibleParticipants() {
      const spotMap: Record<number, Set<number>> = {};

      // fill in spots where we know the player
      const {tournament, config} = this;
      
      // normally would use matchModels, but need this for that
      Object.keys(tournament.spotParticipant).forEach((key) => {
        const keyNumber = Number(key)
        const value = tournament.spotParticipant[keyNumber];
        spotMap[keyNumber] = new Set();
        spotMap[keyNumber].add(value);
      });

      // Follow unplayed matches to find ids of players that might get there.
      // Use timeSlots to get matches in play order which should make sure
      // there are players in the spots we're getting from
      this.getUnfinishedMatches().forEach(({matchIndex}) => {
        if (config.matches[matchIndex]) {
          const {spotA, spotB, winnerTo, loserTo} = config.matches[matchIndex];
          const possible = new Set([...spotMap[spotA], ...spotMap[spotB]]);
          if(winnerTo) spotMap[winnerTo] = possible;
          if(loserTo) spotMap[loserTo] = possible;
        }
      });

      return spotMap;
    }

    /**
     * vm.matches will have match info in order, should be run
     * after generating participants for a spot to list participants
     * in each spot.
     */
    generateMatchModels(): MatchModel[] {
      const models = this.tournament.timeSlots.map((ts, index) => {
        const matchConfig = this.config.matches[ts.matchIndex]
        const participantsAIds = this.spotPossibleParticipants[matchConfig.spotA];
        const participantsBIds = this.spotPossibleParticipants[matchConfig.spotB];
        return {
          timeSlotIndex: index,
          matchIndex: ts.matchIndex,
          utc: ts.utc,
          timeString: UtilService.formatTime(ts.utc),
          matchConfig,
          matchResult: this.tournament.matchResultMap[ts.matchIndex],
          participantsAIds, // Set<number>
          participantsBIds, // Set<number>
          isFinished: !!(this.tournament.matchResultMap[ts.matchIndex]?.isFinished),
        }
      });
      
      return models;
    }

    getParticipant(participantId: number) : Participant {
      return this.tournament.participants.find(p => p.id === participantId) as Participant;
    }

    /**
     * To show upcoming matches, list unplayed matches in order by time slot
     */
    getMatches(unplayedOnly = false) {
      const timeSlots = this.tournament.timeSlots.filter(timeSlot => !unplayedOnly || this.tournament.matchResultMap[timeSlot.matchIndex] === undefined);
      const unknownParticipant: Participant = { name: 'UNKNOWN' };
      const matches = timeSlots.map(timeSlot => {
        let matchConfig = this.config.matches[timeSlot.matchIndex];
        let participantA = this.getParticipant(this.tournament.spotParticipant[matchConfig.spotA]) || unknownParticipant;
        let participantB = this.getParticipant(this.tournament.spotParticipant[matchConfig.spotB]) || unknownParticipant;
        return {
          ...matchConfig, ...timeSlot, participantA, participantB, result: this.tournament.matchResultMap[timeSlot.matchIndex]
        }
      });
      return matches;
    }

    deleteMatchResult(matchIndex: number, useTournament?: Tournament) : Tournament {
      const tournament = useTournament ? useTournament : this.tournament;
      const config = this.config.matches[matchIndex];
      if (config.winnerTo) delete tournament.spotParticipant[config.winnerTo];
      if (config.loserTo) delete tournament.spotParticipant[config.loserTo];
      delete tournament.matchResultMap[matchIndex];
      return tournament;
    }

    // to reset final 2 matches (from /matches):
    // var t = x.vm.cloneTournament(); delete t.matchResultMap[29]; delete t.matchResultMap[30]; cMatches.service.setTournament(x.tournamentId, t);
    // var t = x.vm.cloneTournament(); [58, 59, 60, 61].forEach(i => delete t.spotParticipant[i]); cMatches.service.setTournament(x.tournamentId, t);
    // ----- or -----
    // var t = x.vm.deleteMatchResult(29);
    // t = x,vm.deleteMatchResult(30, t);
    // cMatch.service.setTournament(x.tournamentId, t);
    setMatchResult(matchIndex: any, info: { lagWinner?: number; matchWinner?: number; gameWinners: (number)[]; }, useTournament?: Tournament) {
      // use passed tournament or clone a new one
      let tournament = useTournament ? useTournament : this.cloneTournament();

      const matchConfig = this.config.matches[matchIndex];

      const {lagWinner, matchWinner, gameWinners} = info;
      const A = tournament.spotParticipant[matchConfig.spotA];
      const B = tournament.spotParticipant[matchConfig.spotB];

      let matchLoser = undefined;
      let isFinished = false;
      if (matchWinner) {
        isFinished = true;
        matchLoser = (matchWinner === A) ? B : A; // loser is other

        const winnerSourceSpot = (matchWinner === A) ? matchConfig.spotA : matchConfig.spotB;
        const loserSourceSpot = (matchWinner === A) ? matchConfig.spotB : matchConfig.spotA;
        tournament.resultMap[winnerSourceSpot] = true;
        tournament.resultMap[loserSourceSpot] = false;
        tournament.spotParticipant[matchConfig.winnerTo as number] = matchWinner;
        tournament.spotParticipant[matchConfig.loserTo as number] = matchLoser;
      }

      var oldResult = tournament.matchResultMap[matchIndex];
      const startTime = oldResult && oldResult.startTime ? oldResult.startTime : Date.now()

      var matchResult: MatchResult = {
        isFinished,
        matchWinner,
        matchLoser,
        lagWinner,
        gameWinners,
        startTime,
        endTime: Date.now(),
        entryTime: Date.now(),
      }

      if (!matchResult.lagWinner) delete matchResult.lagWinner;
      if (!matchResult.matchWinner) delete matchResult.matchWinner;
      if (!matchResult.matchLoser) delete matchResult.matchLoser;

      console.log('setting matchResult:', matchResult);
      console.log('matchIndex:', matchIndex);

      tournament.matchResultMap[matchIndex] = matchResult;

      //--------------------------------------------------------------------------------
      // if the match we just set the result for is the playoff match
      // (ifAWinsSkipMatch is set) and A won, then we can skip this match.  To do that
      // we set the matchResult as if A won again and recursively call this function
      // to make it appear as if they played the match and A won.  Then we just alter
      // that match result to show that B was really a BYE.  This should put everyone
      // in the correct spots
      //--------------------------------------------------------------------------------
      if (matchConfig.ifAWinsSkipMatch as number >= 0 && matchWinner === A) {
        // set match result as if A won again
        const skippedMatchId = matchConfig.ifAWinsSkipMatch as number;
        tournament = this.setMatchResult(skippedMatchId, {matchWinner, gameWinners: [], lagWinner: undefined}, tournament);
        
        // change person at spotB of skipped match to 'NOT NEEDED'
        const notNeededId = this.getNotNeededParticipant().id as number;
        tournament.spotParticipant[matchConfig.loserTo as number] = notNeededId;
        tournament.matchResultMap[skippedMatchId].skipped = true;
        tournament.matchResultMap[skippedMatchId].matchWinner = notNeededId;
      }

      return tournament;
    }

    // OLD method - deprecated and doesn't work
    declareWinner(matchIndex: number, winnerId: number): Tournament {
      const tournament = this.cloneTournament();
      const matchConfig = this.config.matches[matchIndex];
      const info = this.getParticipant(tournament.spotParticipant[matchConfig.spotA]).id === winnerId ? {
        winnerSourceSpot: matchConfig.spotA,
        loserSourceSpot: matchConfig.spotB,
        winner: tournament.spotParticipant[matchConfig.spotA],
        loser: tournament.spotParticipant[matchConfig.spotB],
      } : {
        winnerSourceSpot: matchConfig.spotB,
        loserSourceSpot: matchConfig.spotA,
        winner: tournament.spotParticipant[matchConfig.spotB],
        loser: tournament.spotParticipant[matchConfig.spotA],
      }

      var matchResult: MatchResult = {
        isFinished: true,
        matchWinner: info.winner,
        matchLoser: info.loser,
        lagWinner: info.winner,
        gameWinners: [info.winner, info.loser, info.winner],
        startTime: Date.now() - 20 * 60 * 1000,
        endTime: Date.now(),
        entryTime: Date.now()
      }

      tournament.matchResultMap[matchIndex] = matchResult;
      tournament.resultMap[info.winnerSourceSpot] = true;
      tournament.resultMap[info.loserSourceSpot] = false;
      tournament.spotParticipant[matchConfig.winnerTo as number] = info.winner;
      tournament.spotParticipant[matchConfig.loserTo as number] = info.loser;
      return tournament;
    }

    getMatchResultForSpot(spotIndex: number) : MatchResult | null {
      return null;
    }

    getUpcomingMatches() {
      const matches = this.getMatches(true).slice(0, 5);
      const match = matches[0];
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
      n.matchResultMap = {...n.matchResultMap};
      Object.keys(n.matchResultMap).forEach(key => {
        const k = Number(key);
        const map = {...n.matchResultMap[k]};
        const winners = map.gameWinners;
        if (winners) {
          n.matchResultMap[k].gameWinners = [...winners];
        }
      });
      return n;
    }

    getByeParticipant(useTournament?: Tournament): Participant {
      const tournament = useTournament ? useTournament : this.tournament;
      let result = tournament.participants.find(p => p.isHidden && p.name === 'BYE');
      if (!result) {
        let newId = tournament.participants.reduce((acc, v) => Math.max(acc, v.id as number), 0) + 1;
        result = {
          id: newId,
          isHidden: true,
          name: 'BYE'
        };
        tournament.participants.push(result);
      }
      return result;
    }

    getNotNeededParticipant(useTournament?: Tournament): Participant {
      const tournament = useTournament ? useTournament : this.tournament;
      let result = tournament.participants.find(p => p.isHidden && p.name === 'NOT NEEDED');
      if (!result) {
        let newId = tournament.participants.reduce((acc, v) => Math.max(acc, v.id as number), 0) + 1;
        result = {
          id: newId,
          isHidden: true,
          name: 'NOT NEEDED'
        };
        tournament.participants.push(result);
      }
      return result;
    }

    getUnfinishedMatchesForParticipant(participantId: number) {

    }

    getUnfinishedMatches(): ({matchIndex: number,  utc: number, timeSlotIndex: number}[]) {
      const {tournament, config} = this;
      return tournament.timeSlots.map(({matchIndex, utc}, timeSlotIndex) => {
        if (tournament.matchResultMap[matchIndex] && tournament.matchResultMap[matchIndex].isFinished) return null;
        return {matchIndex, utc, timeSlotIndex};
        //const {spotA, spotB, winnerTo, loserTo} = config.matches[matchIndex];
        // const possible = [...spotMap[spotA], ...spotMap[spotB]];
        // if(winnerTo) spotMap[winnerTo] = possible;
        // if(loserTo) spotMap[loserTo] = possible;
      }).filter(x => x != null) as {matchIndex: number,  utc: number, timeSlotIndex: number}[];
    }

    getParticipantViewModels() {
      const {participants, matchResultMap, spotParticipant, timeSlots} = this.tournament;
      const results = participants.map((x, index) => ({...x, index})).filter(x => !x.isHidden).map(participant => {
        // want the match results in time order where it is the winner or loser
        // parse matches to get lags, matches, and matches won/lost

        const spotsIds = Object.keys(spotParticipant).reduce((acc, key) => {
          const participantId = spotParticipant[Number(key)];
          if (participantId === participant.id) {
            acc.push(Number(key));
          }
          return acc;
        }, <number[]>[]);
        const matches = this.tournament.timeSlots.map(x => {
        });
      });
    }

}

/*

export interface Match {
  isFinished?: boolean;
  matchWinner?: number;
  matchLoser?: number;
  lagWinner?: number, // who won the lag (if we want to track)
  matchWinners?: []; // IDs for winner of each match played (if we want to track)
  startTime?: number;
  endTime?: number;
  entryTime?: number;
}
*/