/// <reference path="Character.ts" />
/// <reference path="Card.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Dimension;
(function (Dimension) {
    var Minion = (function (_super) {
        __extends(Minion, _super);
        /**
        * Create a new Minion with given information
        * @param name   Name of the minion
        * @param attack Attack value
        * @param health Health value
        * @param card   Card created from
        * @param owner  Owner player
        */
        function Minion(name, attack, health, card, owner) {
            _super.call(this, owner.game);
            /**
            * Whether or not this minion is a token minion, i.e. not directly from a card
            * @type {boolean}
            */
            this.token = false;
            /**
            * Whether or not this minion has summoning sickness
            * @type {boolean}
            */
            this.sick = true;
            /**
            * Whether or not this minion has charge
            * @type {boolean}
            */
            this.charge = false;
            /**
            * Whether or not this minion has taunt
            * @type {boolean}
            */
            this.taunt = false;
            /**
            * Whether or not this minion is a defender, i.e. cannot attack
            * @type {boolean}
            */
            this.defender = false;
            /**
            * Whether or not this minion is shrouded, i.e. cannot be targeted by spells or hero powers
            * @type {boolean}
            */
            this.shroud = false;

            this.controller = this.owner = owner;

            this.name = name;
            this.attack = attack;
            this.health = health;
            this.maxHealth = health;

            if (card != null) {
                this.card = card;
                this.token = card.token;
                this.charge = card.charge;
                this.defender = card.defender;
                this.taunt = card.taunt;
                this.divineShield = card.divineShield;
                this.windfury = card.windfury;
                this.stealth = card.stealth;
                this.shroud = card.shroud;

                this.addAuraFromCard(card);
            }
        }
        /**
        * Override the onEvent method to react to {GameEvent.DEATH} more accurately
        * @param e The GameEvent to react to
        * @param source The source object
        * @param other The other object
        */
        Minion.prototype.onEvent = function (e, source, other) {
            _super.prototype.onEvent.call(this, e, source, other);

            if (e == 5 /* DEATH */) {
                this.removeAuras();
            }
        };

        /**
        * Silence the minion. i.e. remove all abilities and auras
        */
        Minion.prototype.silence = function () {
            this.taunt = false;
            this.charge = false;
            this.windfury = false;
            this.divineShield = false;
            this.stealth = false;
            this.shroud = false;

            this.removeAuras();
        };

        /**
        * Check if the minion has charge by itself or from auras
        * @returns {boolean}
        */
        Minion.prototype.hasCharge = function () {
            if (this.sumAurasByStat(5 /* CHARGE */) > 0)
                return true;
            return this.charge;
        };

        /**
        * Check if the minion has chage by itself or from auras
        * @returns {boolean}
        */
        Minion.prototype.hasWindfury = function () {
            if (this.sumAurasByStat(6 /* WINDFURY */) > 0)
                return true;
            return this.windfury;
        };

        /**
        * Check if this minion is next to another minion
        * @param m The minion we're checking to be next to
        * @returns {boolean}
        */
        Minion.prototype.isAdjacentTo = function (m) {
            var index = this.controller.board.indexOf(this);
            var index2 = this.controller.board.indexOf(m);

            if (index2 == -1)
                return false;
            if (Math.abs(index - index2) == 1)
                return true;

            return false;
        };

        /**
        * Trigger a handler for each neighboring minion (if any)
        * @param handler
        */
        Minion.prototype.forEachNeighbor = function (handler) {
            var index = this.controller.board.indexOf(this);

            // Right side
            var right = index + 1;
            if (right < this.controller.board.length)
                this.game.invoke(handler, this.controller.board[right], null);

            // Left side
            var left = index - 1;
            if (left >= 0)
                this.game.invoke(handler, this.controller.board[left], null);
        };

        /**
        * Transform this minion into another minion from a card
        * @param name The name of the card to transform into
        */
        Minion.prototype.transform = function (name) {
            var card = Dimension.Card.get(name);
            this.removeAuras();

            this.card = card;
            this.name = name;
            this.attack = card.attack;
            this.health = card.health;
            this.maxHealth = card.health;
            this.charge = card.charge;
            this.defender = card.defender;
            this.taunt = card.taunt;
            this.divineShield = card.divineShield;
            this.windfury = card.windfury;
            this.stealth = card.stealth;
            this.shroud = card.shroud;
        };
        return Minion;
    })(Dimension.Character);
    Dimension.Minion = Minion;
})(Dimension || (Dimension = {}));
//# sourceMappingURL=Minion.js.map
