/// <reference path="../dim.d.ts" />

module Dimension {

  // Abomination
  Card.create((card: Card) => {
    // Basic info
    card.type   = CardType.MINION;
    card.id     = 107;
    card.name   = "Abomination";
    card.cost   = 5;
    card.text   = "Taunt. Deathrattle: Deal 2 damage to ALL characters.";
    card.rarity = CardRarity.RARE;

    // Combat info
    card.attack = 4;
    card.health = 4;
    card.taunt  = true;

    // Death trigger
    card.onDeath = function (game: Game) {
      game.damageForEachWithFilter(TargetFilter.CHARACTER, 2, null);
    };
  });

}