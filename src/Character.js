/// <reference path="GameObject.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Dimension;
(function (Dimension) {
    /**
    * TODO: Documentation
    */
    var Character = (function (_super) {
        __extends(Character, _super);
        function Character(game) {
            _super.call(this, game);
            this.armor = 0;
            this.attackCount = 0;
            this.frozen = 0;
            this.windfury = false;
            this.divineShield = false;
            this.stealth = false;
        }
        Character.prototype.getAttack = function () {
            return Math.max(0, this.attack + this.sumAurasByStat(1 /* ATTACK */));
        };

        Character.prototype.getHealth = function () {
            return Math.max(0, this.health + this.sumAurasByStat(2 /* HEALTH */));
        };

        Character.prototype.isDamaged = function () {
            return this.getHealth() < this.maxHealth;
        };

        Character.prototype.combatDamage = function (damage, source) {
            if (damage < 0)
                return false;

            if (this.divineShield) {
                this.divineShield = false;
                return false;
            }

            var migitation = Math.min(damage, this.armor);
            this.armor -= migitation;
            damage -= migitation;
            this.health -= damage;

            return (damage > 0);
        };

        Character.prototype.damage = function (damage, source) {
            if (damage < 0)
                return;

            var inflicted = this.combatDamage(damage, source);
            if (!inflicted) {
                return;
            }

            this.onEvent(1 /* DAMAGE */, this, source);
            this.game.postDamage();
        };

        Character.prototype.spellDamage = function (damage, source) {
            damage += source.owner.sumAurasByStat(9 /* SPELL_POWER */);

            if (damage <= 0) {
                return;
            }

            var inflicted = this.combatDamage(damage, source);
            if (!inflicted) {
                return;
            }

            this.onEvent(1 /* DAMAGE */, this, source);
            this.game.postDamage();
        };

        Character.prototype.destroy = function () {
            this.health = -1000;
            this.game.postDamage();
        };

        Character.prototype.heal = function (amount) {
            amount = Math.min(amount, Math.max(this.maxHealth - this.getHealth(), 0));

            if (amount > 0) {
                this.health += amount;
                this.onEvent(7 /* HEAL */, this, null);
            }
        };

        Character.prototype.gain = function (attack, health) {
            if (this.getHealth() <= 0)
                return;

            this.attack += attack;
            this.health += health;
        };

        Character.prototype.freeze = function () {
            this.freezeForTurns(1);
        };

        Character.prototype.freezeForTurns = function (turns) {
            this.frozen = Math.max(turns, this.frozen);
        };

        Character.prototype.isFrozen = function () {
            return this.frozen > 0;
        };

        Character.prototype.unfreeze = function () {
            if (this.frozen > 0)
                this.frozen--;
        };
        return Character;
    })(Dimension.GameObject);
    Dimension.Character = Character;
})(Dimension || (Dimension = {}));
//# sourceMappingURL=Character.js.map
