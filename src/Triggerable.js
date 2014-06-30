/// <reference path="GameEvent.ts" />
/// <reference path="Aura.ts" />
var Dimension;
(function (Dimension) {
    var Triggerable = (function () {
        function Triggerable() {
        }
        Triggerable.prototype.getTrigger = function (e) {
            switch (e) {
                case 0 /* ATTACK */:
                    return this.onAttack;
                case 1 /* DAMAGE */:
                    return this.onDamage;
                case 2 /* DAMAGE_DEALT */:
                    return this.onDamageDealt;
                case 3 /* START_OF_TURN */:
                    return this.onStartOfTurn;
                case 4 /* END_OF_TURN */:
                    return this.onEndOfTurn;
                case 5 /* DEATH */:
                    return this.onDeath;
                case 6 /* CAST */:
                    return this.onCast;
                case 7 /* HEAL */:
                    return this.onHeal;
                case 8 /* DRAW */:
                    return this.onDraw;
                case 9 /* SECRET_REVEALED */:
                    return this.onSecretRevealed;
                case 10 /* SUMMON */:
                    return this.onSummon;
            }

            return null;
        };

        Triggerable.prototype.applyToAura = function (a) {
            a.onCast = this.onCast;
            a.onDamage = this.onDamage;
            a.onDamageDealt = this.onDamageDealt;
            a.onDeath = this.onDeath;
            a.onStartOfTurn = this.onStartOfTurn;
            a.onEndOfTurn = this.onEndOfTurn;
            a.onHeal = this.onHeal;
            a.onDraw = this.onDraw;
            a.onAttack = this.onAttack;
            a.onSecretRevealed = this.onSecretRevealed;
            a.onSummon = this.onSummon;
        };
        return Triggerable;
    })();
    Dimension.Triggerable = Triggerable;
})(Dimension || (Dimension = {}));
//# sourceMappingURL=Triggerable.js.map
