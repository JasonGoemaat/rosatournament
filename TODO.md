# TODO

## For running the tournament

1. Click on Spot for a winning game that hasn't been played - go to games/gameId?
2. Click on any spot - allow selecting a player directly?  Maybe a TournamentSpotComponent?  Allow selecting game winner if it's an open spot for a game winner?
3. Allow adjusting time slots?  Only unplayed games?  select different timeslot?  Showing times, game names?


* TournamentGamesComponent I think should show upcoming games (maybe limit to 5 or 10, 'show more' and 'show completed' links?)
* Click on game to go to individual game?
* Do we want to track who won the lag and the winners of each game?  I have just an array for the ids in the models, I was thinking just select a winner for the next game, and X to delete one already selected
* Something for determining if we are ahead or behind?
* Do we want to click on 'start game' to track when they start?  Does the time need to be adjustable if we really want to track it?

## For viewing players

1. route to individual participant from TournamentParticipantsComponent
2. For TournamentParticipant, show upcoming games
  * Schedule - next games by time both for if you win or not, limit 5?  Show possible competitors you'll be facing?
  * Bracket for upcoming games - showing who you might be playing if you win or lose
