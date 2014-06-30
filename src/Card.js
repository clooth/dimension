/// <reference path="Collections.ts" />
/// <reference path="Triggerable.ts" />
/// <reference path="CardType.ts" />
/// <reference path="CardSubType.ts" />
/// <reference path="CardRarity.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Dimension;
(function (Dimension) {
    var Card = (function (_super) {
        __extends(Card, _super);
        function Card(type, id, name, cost, hero, description, rarity) {
            _super.call(this);
            this.overload = 0;
            this.durabilityLoss = 1;

            this.id = id;
            if (this.id == 10000)
                this.id = 0;

            this.type = type;
            this.name = name;
            this.cost = cost;
            this.hero = hero.toLowerCase();
            this.description = description;
            this.rarity = rarity;
        }
        Card.createMinion = function (id, name, cost, hero, description, attack, health, rarity, subtype) {
            if (typeof subtype === "undefined") { subtype = 6 /* GENERAL */; }
            var spell = new Card(0 /* MINION */, id, name, cost, hero, description, rarity);
            spell.attack = attack;
            spell.health = health;
            spell.subtype = subtype;
            Card.spells.setValue(name, spell);
            return spell;
        };

        Card.createSpell = function (id, name, cost, hero, description, rarity) {
            var spell = new Card(1 /* SPELL */, id, name, cost, hero, description, rarity);
            Card.spells.setValue(name, spell);
            return spell;
        };

        Card.createWeapon = function (id, name, cost, hero, description, attack, durability, rarity) {
            var spell = new Card(2 /* WEAPON */, id, name, cost, hero, description, rarity);
            spell.attack = attack;
            spell.durability = durability;
            Card.spells.setValue(name, spell);
            return spell;
        };

        Card.createAbility = function (id, name, cost, hero, description) {
            var spell = new Card(3 /* ABILITY */, id, name, cost, hero, description, 1 /* COMMON */);
            Card.spells.setValue(name, spell);
            return spell;
        };

        Card.get = function (name) {
            return Card.spells.getValue(name);
        };
        Card.spells = new Collections.Dictionary();
        return Card;
    })(Dimension.Triggerable);
    Dimension.Card = Card;
})(Dimension || (Dimension = {}));
//# sourceMappingURL=Card.js.map
