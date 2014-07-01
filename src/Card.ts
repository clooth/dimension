module Dimension {

  /**
   * The possible rarity levels for Card objects
   */
  export enum CardRarity {
    BASIC,
    COMMON,
    RARE,
    EPIC,
    LEGENDARY
  }

  /**
   * The possible types for Card objects
   */
  export enum CardType {
    // A minion card summoned to the board
    MINION,
    // A castable spell card
    SPELL,
    // An equippable weapon card
    WEAPON,
    // A hero ability card
    ABILITY
  }

  /**
   * The possible sub types for Card objects
   */
  export enum CardSubType {
    GENERAL,
    BEAST,
    DEMON,
    DRAGON,
    MURLOC,
    PIRATE,
    TOTEM
  }

  /**
   * Represents a single card in the game.
   */
  export class Card extends Triggerable {
    /**
     * The unique identifier id of this card, could be used for images
     * @type {number}
     */
    public id : number;

    /**
     * The type of the card
     * @type {CardType}
     */
    public type: CardType;

    /**
     * Whether or not this card is summoned from a spell
     * @type {boolean} false if from a spell, true otherwise
     */
    public token: boolean;

    /**
     * The human readable name of this card
     * @type {string}
     */
    public name: string;

    /**
     * The hero name this card belongs to
     * Used when reading deck lists, since some cards are hero-specific
     * @type {string}
     */
    public hero: string;

    /**
     * The description text of the card
     * @type {string}
     */
    public text: string;

    /**
     * The sub type of this card, eg. beast, dragon, etc.
     * @type {CardSubType}
     */
    public subtype: CardSubType;

    /**
     * The rarity level of this card.
     * Currently not used for anything.
     * @type {CardRarity}
     */
    public rarity: CardRarity;

    /**
     * The amount of mana this card costs to cast
     * @type {number}
     */
    public cost: number;

    /**
     * The amount of mana overload caused by using this card
     * @type {number}
     */
    public overload: number = 0;

    /**
     * The attack (damage) value of the minion card
     * @type {number}
     */
    public attack: number;

    /**
     * The amount of health this minion card has
     * @type {number}
     */
    public health: number;

    /**
     * The amount of durability this weapon card has
     * @type {number}
     */
    public durability: number;

    /**
     * The amount of durability lost per attacking with this weapon card
     * @type {number}
     */
    public durabilityLoss: number = 1;

    /**
     * This minion can attack the same turn its summoned
     * @type {boolean} true if can
     */
    public charge: boolean;

    /**
     * This minion blocks attacks to minions without taunt
     * @type {boolean} true if blocking
     */
    public taunt: boolean;

    /**
     * This minion is unable to attack
     * @type {boolean} true if unable
     */
    public defender: boolean;

    /**
     * This minion can attack twice on the same turn
     * @type {boolean} true if can
     */
    public windfury: boolean;

    /**
     * This minion is protected from the first time damage
     * @type {boolean} true if protected
     */
    public divineShield: boolean;

    /**
     * This minion cannot be targeted by anything
     * @type {boolean}
     */
    public stealth: boolean;

    /**
     * This minion cannot be targeted by spells or hero powers
     * @type {boolean}
     */
    public shroud: boolean;

    /**
     * Dynamic cost calculation for this card
     * @type {Function}
     */
    public costModifier: Function;

    /**
     * Static container of created Card objects
     * @type {Collections.Dictionary<string, Card>}
     */
    static _cards: Collections.Dictionary<string, Card> = new Collections.Dictionary<string, Card>();

    constructor() {
      super();
    }

    /**
     * Create a new card instance and save it to the container
     * @param  {Card) => void} configure A configurator function
     * @return {Card}          The newly created Card object
     */
    static create(configure: (card: Card) => void): Card {
      var card: Card = new Card();
      configure(card);
      Card._cards.setValue(card.name, card);
      return Card.get(card.name);
    }

    /**
     * Get a Card copy by its name
     * @param  {string} name Name of the card we want
     * @return {Card}        The card, or null
     */
    static get(name: string): Card {
      return Card._cards.copyValue(name);
    }

  }

}