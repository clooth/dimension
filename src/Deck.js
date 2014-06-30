/// <reference path="Collections.ts" />
/// <reference path="Card.ts" />
var Dimension;
(function (Dimension) {
    var Deck = (function () {
        function Deck(deckString) {
            var _this = this;
            this.spells = new Collections.LinkedList();
            var lines = deckString.split("\n");
            this.hero = lines.shift();

            var line;
            for (var i = 0, l = lines.count; i < l; i++) {
                line = lines[i];
                var data = line.split("x ");

                var spell = Dimension.Card.get(data[1].trim());
                if (spell != null) {
                    _.times(~~data[0].trim(), function () {
                        _this.spells.add(spell);
                    });
                }
            }
        }
        return Deck;
    })();
    Dimension.Deck = Deck;
})(Dimension || (Dimension = {}));
//# sourceMappingURL=Deck.js.map
