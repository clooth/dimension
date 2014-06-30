/// <reference path="Collections.ts" />
/// <reference path="Triggerable.ts" />
/// <reference path="CardType.ts" />
/// <reference path="CardSubType.ts" />
/// <reference path="CardRarity.ts" />

module Dimension {

  export class Card extends Triggerable {
    public id : number;

    public type: CardType;
    public token: boolean;
    public name: string;
    public hero: string;
    public description: string;
    public subtype: CardSubType;
    public rarity: CardRarity;

    public cost: number;
    public overload: number = 0;
    public attack: number;
    public health: number;
    public durability: number;
    public durabilityLoss: number = 1;

    public charge: boolean;
    public taunt: boolean;
    public defender: boolean;
    public windfury: boolean;
    public divineShield: boolean;
    public stealth: boolean;
    public shroud: boolean;

    public costModifier: Function;

    constructor(type: CardType, id: number, name: string, cost: number, hero: string, description: string, rarity: CardRarity) {
      super();

      this.id = id;
      if (this.id == 10000) this.id = 0;

      this.type = type;
      this.name = name;
      this.cost = cost;
      this.hero = hero.toLowerCase();
      this.description = description;
      this.rarity = rarity;
    }

    static spells : Collections.Dictionary<string, Card> = new Collections.Dictionary<string, Card>();

    static createMinion(id: number, name: string, cost: number, hero: string, description: string, attack: number,
                        health: number, rarity: CardRarity, subtype: CardSubType = CardSubType.GENERAL): Card {
      var spell: Card = new Card(CardType.MINION, id, name, cost, hero, description, rarity);
      spell.attack = attack;
      spell.health = health;
      spell.subtype = subtype;
      Card.spells.setValue(name, spell);
      return spell;
    }

    static createSpell(id: number, name: string, cost: number, hero: string, description: string,
                       rarity: CardRarity): Card {
      var spell: Card = new Card(CardType.SPELL, id, name, cost, hero, description, rarity);
      Card.spells.setValue(name, spell);
      return spell;
    }

    static createWeapon(id: number, name: string, cost: number, hero: string, description: string, attack: number,
                        durability: number, rarity: CardRarity): Card {
      var spell: Card = new Card(CardType.WEAPON, id, name, cost, hero, description, rarity);
      spell.attack = attack;
      spell.durability = durability;
      Card.spells.setValue(name, spell);
      return spell;
    }

    static createAbility(id: number, name: string, cost: number, hero: string, description: string): Card {
      var spell: Card = new Card(CardType.ABILITY, id, name, cost, hero, description, CardRarity.COMMON);
      Card.spells.setValue(name, spell);
      return spell;
    }

    static get(name: string): Card {
      return Card.spells.getValue(name);
    }

  }

}