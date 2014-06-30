/// <reference path="GameObject.ts" />
/// <reference path="Card.ts" />
/// <reference path="Stat.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Dimension;
(function (Dimension) {
    var Weapon = (function (_super) {
        __extends(Weapon, _super);
        function Weapon() {
            _super.apply(this, arguments);
        }
        Weapon.prototype.getAttack = function () {
            return Math.max(0, this.attack + this.sumAurasByStat(1 /* ATTACK */));
        };

        Weapon.prototype.decayAttack = function (amount) {
            this.attack = Math.max(0, this.attack - amount);
        };

        Weapon.prototype.decayDurability = function (amount) {
            if (amount == -1) {
                amount = this.durabilityLoss;
            }
            this.durability -= amount;
            if (this.durability <= 0 && this.owner.weapon == this) {
                this.destroy();
            }
        };

        Weapon.prototype.gainDurability = function (amount) {
            this.durability += amount;
        };

        Weapon.prototype.destroy = function () {
            this.removeAuras();
            this.owner.weapon = null;
        };
        return Weapon;
    })(Dimension.GameObject);
    Dimension.Weapon = Weapon;
})(Dimension || (Dimension = {}));
//# sourceMappingURL=Weapon.js.map
