# TODO

## For running the tournament

1. Click on Spot for a winning game that hasn't been played - go to games/gameId?
2. Click on any spot - allow selecting a player directly?  Maybe a TournamentSpotComponent?  Allow selecting game winner if it's an open spot for a game winner?
3. Allow adjusting time slots?  Only unplayed games?  select different timeslot?  Showing times, game names?
4. Should selecting a game winner be super easy?   I really don't see Jack wanting to mark every game or who won the lag or anything, he doesn't pay that much attention in the tournament.  Maybe just a popup with two options for the winner when clicking on an empty 'winner' slot would be best...

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

## Security

Security rules are defined in the main repo 'goemaat-matest'.  Each firebase UID can be in the 'roles' object on a tournament and the tournament can only be saved if the user id is in there as 'owner' or 'admin'.  Should probably add that to the 
data object separately and not allow trying to edit or update things if you don't have access.  In the test project I saw that updating the tournament would show the changes even if you didn't have permission, but then would change back quickly as the actual tournament was pushed back to the observable from the firebase snapshot.

## Wishlist

### Log of actions taken

Could be separate doc or collection in firebase.  Store recent 5 or so in the tournament.

### Chat/Photos

There are samples out there on building a chat app using firebase, doesn't seem too difficult.  Probably store
with the same id but different doc, like 'chats/{tournamentId}'.  Could have system messages in there too
like for when a game is over...

Could use Firebase Storage for uploading pics. along with chat...  Apparently file upload works for pics on iphone...


