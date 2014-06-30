/// <reference path="Collections.ts" />
/// <reference path="Character.ts" />
/// <reference path="Spell.ts" />
/// <reference path="Aura.ts" />
/// <reference path="Minion.ts" />
/// <reference path="Weapon.ts" />

module Dimension {

  export class Player extends Character {
    /**
     * The player's deck, that they have constructed and selected for the game
     * @type {Dimension.Deck}
     */
    public deck: Deck;

    /**
     * The player's library, from which the player's remaining cards are drawn from
     * @type {Collections.LinkedList<Spell>}
     */
    public library: Collections.LinkedList<Spell> = new Collections.LinkedList<Spell>();

    /**
     * The player's current hand of cards, that they can currently play on their turn
     * @type {Collections.LinkedList<Spell>}
     */
    public hand: Collections.LinkedList<Spell> = new Collections.LinkedList<Spell>();

    /**
     * The list of active "triggered" auras for the player
     * @type {Collections.LinkedList<Aura>}
     */
    public secrets: Collections.LinkedList<Aura> = new Collections.LinkedList<Aura>();

    /**
     * The list of minions on the player's board
     * @type {Array<Minion>}
     */
    public board: Array<Minion> = new Array<Minion>();

    public mana: number = 0;
    public maxMana: number = 0;
    public overload: number = 0;

    public weapon: Weapon = null;
    public ability: Card;
    public abilityUsed: boolean;

    public opponent: Player;

    constructor(game: Game, deck: Deck) {
      super(game);

      this.controller = this.owner = this;

      this.health = 30;
      this.maxHealth = 30;
      this.attack = 0;
      this.ability = Card.get(deck.hero);

      this.deck = deck;
      for (var i = 0, l = deck.spells.length; i < l; i++) {
        this.library.add(new Spell(deck.spells[i], this));
      }
      this.library.shuffle();
    }

    public getAttack(): number {
      return super.getAttack() + (this.weapon != null) ? this.weapon.getAttack() : 0;
    }

    public getMana(): number {
      return Math.max(0, Math.min(this.getMaxMana(), this.mana + this.sumAurasByStat(Stat.MANA)));
    }

    public getMaxMana(): number {
      return Math.max(0, Math.min(10, this.maxMana + this.sumAurasByStat(Stat.MANA)));
    }


  }

}