export enum BorderConfig {
  None = 0,
  Bottom,
  BottomRight,
  DashedBottom,
  DashedBottomRight
}

export interface TournamentSpotConfig {
  gridArea: string;
  borders: BorderConfig;
  seed?: number;
  winnerOfGame?: number;
  loserOfGame?: number;
  place?: number;
  copySpot?: number; // for placings at end, copy name from spot as winner
  hidden?: boolean; // special
}

export interface TournamentGameConfig {
  spotA: number;
  spotB: number;
  winnerTo?: number; // spot, this is also where game winner is displayed and game time
  loserTo?: number;
  name?: string;
  description?: string
}

export interface TournamentTextConfig {
  gridArea: string;
  text: string;
  borders?: BorderConfig;
}

export interface TournamentConfig {
  name: string;
  spots: TournamentSpotConfig[];
  texts: TournamentTextConfig[];
  games: TournamentGameConfig[];
}

const createDefaultConfig = () : TournamentConfig => {
  const config: TournamentConfig = {
    name: "16 Player Double Elimination",
    spots: [
      // winner bracket round 1
      {gridArea: '1/1/span 2/span 2', borders: BorderConfig.Bottom, seed: 1},
      {gridArea: '3/1/span 2/span 2', borders: BorderConfig.BottomRight, seed: 16},
      {gridArea: '5/1/span 2/span 2', borders: BorderConfig.Bottom, seed: 9},
      {gridArea: '7/1/span 2/span 2', borders: BorderConfig.BottomRight, seed: 8},
      {gridArea: '9/1/span 2/span 2', borders: BorderConfig.Bottom, seed: 5},
      {gridArea: '11/1/span 2/span 2', borders: BorderConfig.BottomRight, seed: 12},
      {gridArea: '13/1/span 2/span 2', borders: BorderConfig.Bottom, seed: 13},
      {gridArea: '15/1/span 2/span 2', borders: BorderConfig.BottomRight, seed: 4},
      {gridArea: '17/1/span 2/span 2', borders: BorderConfig.Bottom, seed: 3},
      {gridArea: '19/1/span 2/span 2', borders: BorderConfig.BottomRight, seed: 14},
      {gridArea: '21/1/span 2/span 2', borders: BorderConfig.Bottom, seed: 11},
      {gridArea: '23/1/span 2/span 2', borders: BorderConfig.BottomRight, seed: 6},
      {gridArea: '25/1/span 2/span 2', borders: BorderConfig.Bottom, seed: 7},
      {gridArea: '27/1/span 2/span 2', borders: BorderConfig.BottomRight, seed: 10},
      {gridArea: '29/1/span 2/span 2', borders: BorderConfig.Bottom, seed: 15},
      {gridArea: '31/1/span 2/span 2', borders: BorderConfig.BottomRight, seed: 2},

      // loser bracket round 1
      {gridArea: '40/1/span 4/span 2', borders: BorderConfig.Bottom},
      {gridArea: '44/1/span 4/span 2', borders: BorderConfig.BottomRight},
      {gridArea: '48/1/span 4/span 2', borders: BorderConfig.Bottom},
      {gridArea: '52/1/span 4/span 2', borders: BorderConfig.BottomRight},
      {gridArea: '56/1/span 4/span 2', borders: BorderConfig.Bottom},
      {gridArea: '60/1/span 4/span 2', borders: BorderConfig.BottomRight},
      {gridArea: '64/1/span 4/span 2', borders: BorderConfig.Bottom},
      {gridArea: '68/1/span 4/span 2', borders: BorderConfig.BottomRight},

      // winner bracket round 2
      {gridArea: '1/3/span 3/span 2', borders: BorderConfig.Bottom},
      {gridArea: '4/3/span 4/span 2', borders: BorderConfig.BottomRight},
      {gridArea: '8/3/span 4/span 2', borders: BorderConfig.Bottom},
      {gridArea: '12/3/span 4/span 2', borders: BorderConfig.BottomRight},
      {gridArea: '16/3/span 4/span 2', borders: BorderConfig.Bottom},
      {gridArea: '20/3/span 4/span 2', borders: BorderConfig.BottomRight},
      {gridArea: '24/3/span 4/span 2', borders: BorderConfig.Bottom},
      {gridArea: '28/3/span 4/span 2', borders: BorderConfig.BottomRight},

      // loser bracket round 2
      {gridArea: '38/3/span 4/span 2', borders: BorderConfig.Bottom},
      {gridArea: '42/3/span 4/span 2', borders: BorderConfig.BottomRight},
      {gridArea: '46/3/span 4/span 2', borders: BorderConfig.Bottom},
      {gridArea: '50/3/span 4/span 2', borders: BorderConfig.BottomRight},
      {gridArea: '54/3/span 4/span 2', borders: BorderConfig.Bottom},
      {gridArea: '58/3/span 4/span 2', borders: BorderConfig.BottomRight},
      {gridArea: '62/3/span 4/span 2', borders: BorderConfig.Bottom},
      {gridArea: '66/3/span 4/span 2', borders: BorderConfig.BottomRight},

      // winner bracket round 3
      {gridArea: '1/5/span 5/span 4', borders: BorderConfig.Bottom},
      {gridArea: '6/5/span 8/span 4', borders: BorderConfig.BottomRight},
      {gridArea: '14/5/span 8/span 4', borders: BorderConfig.Bottom},
      {gridArea: '22/5/span 8/span 4', borders: BorderConfig.BottomRight},

      // loser bracket round 3
      {gridArea: '36/5/span 8/span 2', borders: BorderConfig.Bottom},
      {gridArea: '44/5/span 8/span 2', borders: BorderConfig.BottomRight},
      {gridArea: '52/5/span 8/span 2', borders: BorderConfig.Bottom},
      {gridArea: '60/5/span 8/span 2', borders: BorderConfig.BottomRight},

      // loser bracket round 4
      {gridArea: '32/7/span 8/span 2', borders: BorderConfig.Bottom},
      {gridArea: '40/7/span 8/span 2', borders: BorderConfig.BottomRight},
      {gridArea: '56/7/span 8/span 2', borders: BorderConfig.Bottom},
      {gridArea: '64/7/span 8/span 2', borders: BorderConfig.BottomRight},

      // winner bracket round 4
      {gridArea: '1/9/span 9/span 2', borders: BorderConfig.Bottom},
      {gridArea: '10/9/span 16/span 2', borders: BorderConfig.BottomRight},

      // loser bracket round 5
      {gridArea: '36/9/span 8/span 2', borders: BorderConfig.Bottom},
      {gridArea: '44/9/span 24/span 2', borders: BorderConfig.BottomRight},

      // loser bracket round 6
      {gridArea: '24/11/span 8/span 2', borders: BorderConfig.Bottom},
      {gridArea: '32/11/span 24/span 2', borders: BorderConfig.BottomRight},

      // championship game
      {gridArea: '2/11/span 16/span 4', borders: BorderConfig.Bottom},
      {gridArea: '18/13/span 26/span 2', borders: BorderConfig.BottomRight},

      // championship playoff if needed
      {gridArea: '14/15/span 17/span 2', borders: BorderConfig.Bottom},
      {gridArea: '31/15/span 26/span 2', borders: BorderConfig.DashedBottomRight},

      // champion
      {gridArea: '31/17/span 13/span 2', borders: BorderConfig.DashedBottom, place: 1}, // not displayed

      // spot for 1st place
      {gridArea: '62/17/span 2/span 2', borders: BorderConfig.DashedBottom, place: 1, copySpot: 62, hidden: true },

      // 2rd place is loser of championship/playoff
      {gridArea: '62/17/span 2/span 2', borders: BorderConfig.DashedBottom, place: 2},

      // 3rd place is loser of loser bracket round 6
      {gridArea: '66/17/span 2/span 2', borders: BorderConfig.DashedBottom, place: 3},

      // 4rd place is loser of loser bracket round 5
      {gridArea: '70/17/span 2/span 2', borders: BorderConfig.DashedBottom, place: 4},

      // 5th and 6th have playoff from losers of loser bracket round 4
      {gridArea: '70/15/span 4/span 2', borders: BorderConfig.DashedBottom},
      {gridArea: '74/15/span 4/span 2', borders: BorderConfig.DashedBottomRight},
      {gridArea: '74/17/span 2/span 2', borders: BorderConfig.DashedBottom, place: 5},
      {gridArea: '80/17/span 2/span 2', borders: BorderConfig.DashedBottom, place: 6},

      // 7th and 8th have playoff from losers of loser bracket round 3
      {gridArea: '82/15/span 4/span 2', borders: BorderConfig.DashedBottom},
      {gridArea: '86/15/span 4/span 2', borders: BorderConfig.DashedBottomRight},
      {gridArea: '86/17/span 2/span 2', borders: BorderConfig.DashedBottom, place: 7},
      {gridArea: '90/17/span 2/span 2', borders: BorderConfig.DashedBottom, place: 8},

    ],
    texts: [
      {gridArea: '35/1/span 2/span 2', text: '13th-16th'},
      {gridArea: '35/3/span 2/span 2', text: '9th-12th'},
      {gridArea: '35/5/span 2/span 2', text: '7th-8th'},
      {gridArea: '35/7/span 2/span 2', text: '5th-6th'},
    ],
    games: [
      // winner bracket round 1 (games 0-7)
      { spotA: 0, spotB: 1, winnerTo: 24, loserTo: 16, name: 'WA' },
      { spotA: 2, spotB: 3, winnerTo: 25, loserTo: 17, name: 'WB' },
      { spotA: 4, spotB: 5, winnerTo: 26, loserTo: 18, name: 'WC' },
      { spotA: 6, spotB: 7, winnerTo: 27, loserTo: 19, name: 'WD' },
      { spotA: 8, spotB: 9, winnerTo: 28, loserTo: 20, name: 'WE' },
      { spotA: 10, spotB: 11, winnerTo: 29, loserTo: 21, name: 'WF' },
      { spotA: 12, spotB: 13, winnerTo: 30, loserTo: 22, name: 'WG' },
      { spotA: 14, spotB: 15, winnerTo: 31, loserTo: 23, name: 'WH' },

      // loser bracket round 1 (games 8-11)
      { spotA: 16, spotB: 17, winnerTo: 33, name: 'LA' },
      { spotA: 18, spotB: 19, winnerTo: 35, name: 'LB' },
      { spotA: 20, spotB: 21, winnerTo: 37, name: 'LC' },
      { spotA: 22, spotB: 23, winnerTo: 39, name: 'LD' },

      // winner bracket round 2 (games 12-15)
      { spotA: 24, spotB: 25, winnerTo: 40, loserTo: 32, name: 'WI', },
      { spotA: 26, spotB: 27, winnerTo: 41, loserTo: 34, name: 'WJ' },
      { spotA: 28, spotB: 29, winnerTo: 42, loserTo: 36, name: 'WK' },
      { spotA: 30, spotB: 31, winnerTo: 43, loserTo: 38, name: 'WL' },

      // loser bracket round 2 (games 16-19)
      { spotA: 32, spotB: 33, winnerTo: 44, name: 'LE' },
      { spotA: 34, spotB: 35, winnerTo: 45, name: 'LF' },
      { spotA: 36, spotB: 37, winnerTo: 46, name: 'LG' },
      { spotA: 38, spotB: 39, winnerTo: 47, name: 'LH' },

      // winner bracket round 3 (games 20-21)
      { spotA: 40, spotB: 41, winnerTo: 52, loserTo: 48, name: 'WM' },
      { spotA: 42, spotB: 43, winnerTo: 53, loserTo: 51, name: 'WN' },

      // loser bracket round 3 (games 22-23) (losers go to 7th and 8th place)
      { spotA: 44, spotB: 45, winnerTo: 49, loserTo: 71, name: 'LI' },
      { spotA: 46, spotB: 47, winnerTo: 50, loserTo: 72, name: 'LJ' },

      // loser bracket round 4 (games 24-25) (losers go to 5th and 6th place)
      { spotA: 48, spotB: 49, winnerTo: 54, loserTo: 67, name: 'LK' },
      { spotA: 50, spotB: 51, winnerTo: 55, loserTo: 68, name: 'LL' },

      // winner bracket round 4
      { spotA: 52, spotB: 53, winnerTo: 58, loserTo: 56, name: 'WO' },

      // loser bracket round 5
      { spotA: 54, spotB: 55, winnerTo: 57, loserTo: 66, name: 'LO' },

      // loser bracket round 6
      { spotA: 56, spotB: 57, winnerTo: 59, loserTo: 65, name: 'LP' },

      // finals - winners of winner bracket and lose bracket
      { spotA: 58, spotB: 59, winnerTo: 60, loserTo: 61, name: 'WP' },

      // final playoff (if needed because loser bracket champion beat winner bracket champion, if
      // not needed just select the winner)
      { spotA: 60, spotB: 61, winnerTo: 62, loserTo: 64, name: 'LQ' },

      // playoff to determine 5th and 6th
      { spotA: 67, spotB: 68, winnerTo: 69, loserTo: 70, name: 'LN' },

      // playoff to determine 7th and 8th
      { spotA: 71, spotB: 72, winnerTo: 73, loserTo: 74, name: 'LM' },
    ]
  };

  config.games.forEach((game, i) => {
    if (game.loserTo != undefined) {
      config.spots[game.loserTo].loserOfGame = i;
    }
    if (game.winnerTo != undefined) {
      config.spots[game.winnerTo].winnerOfGame = i;
    }
  })
  return config;
}
export const defaultConfig: TournamentConfig = createDefaultConfig();
