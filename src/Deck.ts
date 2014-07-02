module Dimension {

  export class Deck {
    public hero: string;
    public spells: Collections.LinkedList<Card> = new Collections.LinkedList<Card>();

    static fromString(deckString: string) {
      var deck: Deck = new Deck();

      var lines: string[] = deckString.trim().split("\n");
      deck.hero = lines.shift().trim();

      var line;
      for (var i = 0, l = lines.length; i < l; i++) {
        line = lines[i];
        var data: string[] = line.split("x ");

        var spell: Card = Card.get(data[1].trim());
        if (spell != null) {
          _.times(~~data[0].trim(), () => {
            deck.spells.add(Card.get(data[1].trim()));
          });
        }
      }

      return deck;
    }

    static fromDOM(domId: string) {
      var str = document.getElementById(domId).textContent;
      return Deck.fromString(str);
    }
  }

}