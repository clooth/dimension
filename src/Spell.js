/// <reference path="Card.ts" />
/// <reference path="Player.ts" />
var Dimension;
(function (Dimension) {
    var Spell = (function () {
        function Spell(card, owner) {
            this.card = card;
            this.owner = owner;
        }
        Spell.prototype.getCost = function () {
            return 0;
        };
        return Spell;
    })();
    Dimension.Spell = Spell;
})(Dimension || (Dimension = {}));
//# sourceMappingURL=Spell.js.map
