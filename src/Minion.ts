/// <reference path="Character.ts" />
/// <reference path="Card.ts" />

module Dimension {

  export class Minion extends Character {

    /**
     * The card that this Minion was created from
     * @type {Card}
     */
    public card: Card;

    /**
     * Whether or not this minion is a token minion, i.e. not directly from a card
     * @type {boolean}
     */
    public token: boolean = false;

    /**
     * Whether or not this minion has summoning sickness
     * @type {boolean}
     */
    public sick: boolean = true;

    /**
     * Whether or not this minion has charge
     * @type {boolean}
     */
    public charge: boolean = false;

    /**
     * Whether or not this minion has taunt
     * @type {boolean}
     */
    public taunt: boolean = false;

    /**
     * Whether or not this minion is a defender, i.e. cannot attack
     * @type {boolean}
     */
    public defender: boolean = false;

    /**
     * Whether or not this minion is shrouded, i.e. cannot be targeted by spells or hero powers
     * @type {boolean}
     */
    public shroud: boolean = false;

    /**
     * Create a new Minion with given information
     * @param name   Name of the minion
     * @param attack Attack value
     * @param health Health value
     * @param card   Card created from
     * @param owner  Owner player
     */
    constructor(name: string, attack: number, health: number, card: Card, owner: Player) {
      super(owner.game);

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
    } // end constructor

    /**
     * Override the onEvent method to react to {GameEvent.DEATH} more accurately
     * @param e The GameEvent to react to
     * @param source The source object
     * @param other The other object
     */
    public onEvent(e: GameEvent, source: any, other: any): void {
      super.onEvent(e, source, other);

      if (e == GameEvent.DEATH) {
        this.removeAuras();
      }
    } // end onEvent

    /**
     * Silence the minion. i.e. remove all abilities and auras
     */
    public silence(): void {
      this.taunt = false;
      this.charge = false;
      this.windfury = false;
      this.divineShield = false;
      this.stealth = false;
      this.shroud = false;

      this.removeAuras();
    } // end silence

    /**
     * Check if the minion has charge by itself or from auras
     * @returns {boolean}
     */
    public hasCharge(): boolean {
      if (this.sumAurasByStat(Stat.CHARGE) > 0) return true;
      return this.charge;
    } // end hasCharge

    /**
     * Check if the minion has chage by itself or from auras
     * @returns {boolean}
     */
    public hasWindfury(): boolean {
      if (this.sumAurasByStat(Stat.WINDFURY) > 0) return true;
      return this.windfury;
    } // end hasWindfury

    /**
     * Check if this minion is next to another minion
     * @param m The minion we're checking to be next to
     * @returns {boolean}
     */
    public isAdjacentTo(m: Minion): boolean {
      var index: number = this.controller.board.indexOf(this);
      var index2: number = this.controller.board.indexOf(m);

      if (index2 == -1) return false;
      if (Math.abs(index-index2) == 1) return true;

      return false;
    } // end isAdjacentTo

    /**
     * Trigger a handler for each neighboring minion (if any)
     * @param handler
     */
    public forEachNeighbor(handler: Function): void {
      var index: number = this.controller.board.indexOf(this);

      // Right side
      var right = index + 1;
      if (right < this.controller.board.length)
        this.game.invoke(handler, this.controller.board[right], null);

      // Left side
      var left = index - 1;
      if (left >= 0)
        this.game.invoke(handler, this.controller.board[left], null);
    } // end forEachNeighbor

    /**
     * Transform this minion into another minion from a card
     * @param name The name of the card to transform into
     */
    public transform(name: string): void {
      var card: Card = Card.get(name);
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
    } // end transform

  } // end Minion

}