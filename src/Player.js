/// <reference path="Collections.ts" />
/// <reference path="Character.ts" />
/// <reference path="Spell.ts" />
/// <reference path="Aura.ts" />
/// <reference path="Minion.ts" />
/// <reference path="Weapon.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Dimension;
(function (Dimension) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game, deck) {
            _super.call(this, game);
            /**
            * The player's library, from which the player's remaining cards are drawn from
            * @type {Collections.LinkedList<Spell>}
            */
            this.library = new Collections.LinkedList();
            /**
            * The player's current hand of cards, that they can currently play on their turn
            * @type {Collections.LinkedList<Spell>}
            */
            this.hand = new Collections.LinkedList();
            /**
            * The list of active "triggered" auras for the player
            * @type {Collections.LinkedList<Aura>}
            */
            this.secrets = new Collections.LinkedList();
            /**
            * The list of minions on the player's board
            * @type {Array<Minion>}
            */
            this.board = new Array();
            this.mana = 0;
            this.maxMana = 0;
            this.overload = 0;
            this.weapon = null;

            this.controller = this.owner = this;

            this.health = 30;
            this.maxHealth = 30;
            this.attack = 0;
            this.ability = Dimension.Card.get(deck.hero);

            this.deck = deck;
            for (var i = 0, l = deck.spells.length; i < l; i++) {
                this.library.add(new Dimension.Spell(deck.spells[i], this));
            }
            this.library.shuffle();
        }
        Player.prototype.getAttack = function () {
            return _super.prototype.getAttack.call(this) + (this.weapon != null) ? this.weapon.getAttack() : 0;
        };

        Player.prototype.getMana = function () {
            return Math.max(0, Math.min(this.getMaxMana(), this.mana + this.sumAurasByStat(3 /* MANA */)));
        };

        Player.prototype.getMaxMana = function () {
            return Math.max(0, Math.min(10, this.maxMana + this.sumAurasByStat(3 /* MANA */)));
        };
        return Player;
    })(Dimension.Character);
    Dimension.Player = Player;
})(Dimension || (Dimension = {}));
//# sourceMappingURL=Player.js.map
