/// <reference path="Collections.ts" />
/// <reference path="Card.ts" />

module Dimension {

  export class Deck {
    public hero: string;
    public spells: Collections.LinkedList<Card> = new Collections.LinkedList<Card>();

    constructor(deckString: string) {
      var lines: string[] = deckString.split("\n");
      this.hero = lines.shift();

      var line;
      for (var i = 0, l = lines.count; i < l; i++) {
        line = lines[i];
        var data: string[] = line.split("x ");

        var spell: Card = Card.get(data[1].trim());
        if (spell != null) {
          _.times(~~data[0].trim(), () => {
            this.spells.add(spell);
          });
        }
      }
    }
  }

}