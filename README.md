# Dimension
## Divine Card Gaming

—

### Introduction

Dimension gives you a solid platform for creating your own multiplayer card games by only defining the rules of your game.

Dimension provides the base functionality for:
- Handling a deck and hand
- Handling game events and triggers
- Different card types and dynamic spells
- Game board logic and rules

Dimension can be bent into supporting all kinds of different card games via extending the Vie engine into your own game’s needs.

## Game States

Dimension keeps track of the state for the game depending on the players’ actions. These are useful when implementing support for dynamic actions.

**IDLE**
This state is active when a player is in idle state during their turn, and hasn’t yet chosen their next action.

**ATTACK**
This state is active when a character is about to attack a defending character.

**TARGET**
This state is active when the player is choosing a target object for their current action.

**SUMMON**
This state is activated when the player plays a minion card onto the board.

**CHOOSE_OPTION**
This state is activated when the player needs to pick from multiple options provided by their chosen action.

**MULLIGAN**
This state is activated when a match begins and the players are given the possibility to discard cards from their initial hand.

## Game Events

Dimension emits and listens to multiple game events that can be triggered throughout a single battle.

The following events are supported out of the box:

**START_OF_TURN**
Triggered when a player’s turn begins.

**END_OF_TURN**
Triggered when a player’s turn ends.

**ATTACK**
Triggered when a character (minion or hero) attacked another character.

**DAMAGE_DEALT**
Triggered when a character (minion or hero) is about to deal damage to a defending character.

**DAMAGE_TAKEN**
Triggered when a character (minion or hero) takes damage from another character.

**HEAL**
Triggered when a character (minion or hero) was healed by something.

**DEATH**
Triggered when a minion has perished from the game board.

**PLAY_CARD**
Triggered when a card was played by a player.

**SUMMON**
Triggered when a minion is summoned onto the game board.

**DRAW**
Triggered when a player has drew a card from their remaining deck.

**SECRET_AURA_REVEALED**
Triggered when a secret (player aura) was triggered by something.
