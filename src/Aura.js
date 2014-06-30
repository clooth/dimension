/// <reference path="Triggerable.ts" />
/// <reference path="GameObject.ts" />
/// <reference path="Player.ts" />
/// <reference path="Stat.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Dimension;
(function (Dimension) {
    var Aura = (function (_super) {
        __extends(Aura, _super);
        function Aura(owner, stat, amount, expires) {
            _super.call(this);
            this.expires = false;
            this.stat = 0 /* NONE */;
            this.amount = 0;
            this.dynamic = false;
            this.owner = owner;
            this.stat = stat;
            this.amount = amount;
            this.expires = expires;
            this.dynamic = false;
        }
        Aura.createDynamic = function (owner, stat, calculation, expires) {
            var aura = new Aura(owner, stat, 0, expires);
            aura.calculation = calculation;
            aura.dynamic = true;
            return aura;
        };

        Aura.createTriggerable = function (owner, onTrigger) {
            var aura = new Aura(owner, null, 0, false);
            aura.onTrigger = onTrigger;
            return aura;
        };

        Aura.prototype.amountFor = function (c) {
            if (!this.dynamic)
                return this.amount;
            else
                return this.owner.game.invoke(this.calculation, c, null);
        };

        Aura.prototype.trigger = function (source) {
            this.owner.game.removeAura(this);
            this.owner.secrets.remove(this);
            this.owner.onEvent(9 /* SECRET_REVEALED */, this, source);
            this.owner.game.invoke(this.onTrigger, this.owner, source);
        };
        return Aura;
    })(Dimension.Triggerable);
    Dimension.Aura = Aura;
})(Dimension || (Dimension = {}));
//# sourceMappingURL=Aura.js.map
