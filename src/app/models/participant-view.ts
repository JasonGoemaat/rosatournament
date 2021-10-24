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

  currentGame: {
    config: { // TournamentGameConfig.games[1]
      spotA: 2, spotB: 3, winnerTo: 25, loserTo: 17, name: 'WB',
    },
    timeSlot: { // Tournament.timeSlots[1] (where gameId is 1)
      gameId: 1, utc: 1635604200000
    }
  },

  // list of all possible upcoming games
  upcomingGames: [
  ],

  // list of games that have finished already
  finishedGames: [
    {
      config: { // TournamentGameConfig.games[1]
        spotA: 2, spotB: 3, winnerTo: 25, loserTo: 17, name: 'WB',
      },
      timeSlot: { // Tournament.timeSlots[1] (where gameId is 1)
        gameId: 1, utc: 1635604200000
      },
      result: {
      },
    },
  ]
}