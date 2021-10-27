/**
 * When receiving a tournament from firebase and creating the TournamentViewModel,
 * pull out stats and things for each participant in a nice way for displaying
 * stats and future grid.
 */

export class ParticipantView {
  name!: string;
  id!: number;
  seed!: number;
}

export const sampleParticipant = {
  // from participant
  name: 'Jason Goemaat',
  id: 9,
  seed: 9,

  currentMatch: {
    config: { // TournamentMatchConfig.matches[1]
      spotA: 2, spotB: 3, winnerTo: 25, loserTo: 17, name: 'WB',
    },
    timeSlot: { // Tournament.timeSlots[1] (where matchIndex is 1)
      matchIndex: 1, utc: 1635604200000
    }
  },

  // list of all possible upcoming matches
  upcomingMatches: [
  ],

  // list of matches that have finished already
  finishedMatches: [
    {
      config: { // TournamentMatchConfig.matches[1]
        spotA: 2, spotB: 3, winnerTo: 25, loserTo: 17, name: 'WB',
      },
      timeSlot: { // Tournament.timeSlots[1] (where matchIndex is 1)
        matchIndex: 1, utc: 1635604200000
      },
      result: {
      },
    },
  ]
}