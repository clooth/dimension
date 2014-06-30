/// <reference path="Card.ts" />
/// <reference path="Player.ts" />

module Dimension {

  export class Spell {
    public card : Card;
    public owner: Player;

    constructor(card: Card, owner: Player) {
      this.card = card;
      this.owner = owner;
    }

    public getCost() : number {
      return 0;
    }

  }

}