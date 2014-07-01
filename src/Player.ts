/// <reference path="../typings/lodash/lodash.d.ts" />

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

    /**
     * The current number of usable mana
     * @type {number}
     */
    public mana: number = 0;

    /**
     * The maximum number of usable mana per turn
     * @type {number}
     */
    public maxMana: number = 0;

    /**
     * Amount of mana overload subtracted from the mana
     * @type {number}
     */
    public overload: number = 0;

    /**
     * The currently equipped weapon card
     * @type {Weapon}
     */
    public weapon: Weapon = null;

    /**
     * The hero ability for the player's hero
     */
    public ability: Card;

    /**
     * Whether or not the player has used their ability this turn
     */
    public abilityUsed: boolean;

    /**
     * The current opposing player for this player
     */
    public opponent: Player;

    /**
     * Create a new Player to a given game with a given Deck
     * @param game
     * @param deck
     */
    constructor(game: Game, deck: Deck) {
      super(game);

      this.controller = this.owner = this;

      this.health = 30;
      this.maxHealth = 30;
      this.attack = 0;
      this.ability = Card.get(deck.hero);

      this.deck = deck;
      for (var i = 0, l = deck.spells.size(); i < l; i++) {
        this.library.add(new Spell(deck.spells[i], this));
      }
    }

    /**
     * Get the total attack with the weapon included
     * @returns {number}
     */
    public getAttack(): number {
      return super.getAttack() + ((this.weapon != null) ? this.weapon.getAttack() : 0);
    }

    /**
     * Get the total mana with auras included
     * @returns {number}
     */
    public getMana(): number {
      return Math.max(0, Math.min(this.getMaxMana(), this.mana + this.sumAurasByStat(Stat.MANA)));
    }

    /**
     * Get the total maximum mana with auras included
     * @returns {number}
     */
    public getMaxMana(): number {
      return Math.max(0, Math.min(10, this.maxMana + this.sumAurasByStat(Stat.MANA)));
    }

    /**
     * Gain a number of mana crystals this turn
     * @param amount
     */
    public gainMana(amount: number): void {
      this.mana = Math.max(this.maxMana, this.mana + amount);
    }

    /**
     * Gain a number of permanent mana crystals
     * @param amount
     */
    public gainManaCrystals(amount: number): void {
      this.maxMana = Math.max(10, this.maxMana + amount);
    }

    /**
     * Destroy a number of permanent mana crystals
     * @param amount
     */
    public destroyManaCrystals(amount: number): void {
      this.maxMana = Math.max(0, this.maxMana - amount);
      if (this.mana > this.maxMana)
        this.mana = this.maxMana;
    }


    /**
     * Whether or not the player has any cards left in their deck
     * @returns {boolean}
     */
    public hasCardsLeft(): boolean {
      return (this.library.size() > 0);
    }
    public handleOutOfCards(): void {}

    /**
     * Whether or not the player's hand is too full
     * @returns {boolean}
     */
    public isHandFull(): boolean {
      return (this.hand.size() >= Game.MAXIMUM_HAND_SIZE);
    }
    public handleFullHand(): void {}

    /**
     * Whether or not the player's board is too full
     */
    public isBoardFull(): boolean {
      return (this.board.length >= Game.MAXIMUM_BOARD_SIZE);
    }

    /**
     * Draw a Card from the top of the deck
     */
    public drawCard(): void {
      // If no cards left, issue fatigue and deal accordingly
      if (!this.hasCardsLeft()) {
        // TODO: Implement card fatigue
        this.handleOutOfCards();
        return;
      }

      // If hand too full, burn the card in mid-air
      if (this.isHandFull()) {
        // TODO: Implement card discarding
        this.handleFullHand();
        return;
      }

      // Draw card
      var spell: Spell = this.library.removeElementAtIndex(0);
      this.hand.add(spell);
      this.onEvent(GameEvent.DRAW, spell, null);
    }

    /**
     * Draw a specific card by name into the player's hand
     * @param name
     */
    public drawCardNamed(name: string): void {
      // If no cards left, issue fatigue and deal accordingly
      if (!this.hasCardsLeft()) {
        // TODO: Implement card fatigue
        this.handleOutOfCards();
        return;
      }

      // If hand too full, burn the card in mid-air
      if (this.isHandFull()) {
        // TODO: Implement card discarding
        this.handleFullHand();
        return;
      }

      // Draw card
      var card: Card = Card.get(name);
      if (card != null) {
        this.hand.add(new Spell(card, this));
      }
    }

    /**
     * Cast a given spell object
     * @param spell
     */
    public castSpell(spell: Spell): void {
      this.castSpellBeforeMinion(spell, null);
    }

    /**
     * Cast a given spell before (index) a minion
     * @param spell
     * @param before
     */
    public castSpellBeforeMinion(spell: Spell, before: Minion): void {
      this.mana -= spell.getCost();
      this.overload += spell.card.overload;
      this.hand.remove(spell);

      this.game.spellCounter++;

      if (spell.card.type == CardType.MINION) {
        this.handleCastMinion(spell, before);
      }
      else if (spell.card.type == CardType.WEAPON) {
        this.handleCastWeapon(spell, before);
      }
      else {
        this.handleCastSpell(spell, before);
      }
    }

    private handleCastMinion(spell: Spell, before: Minion): void {
      if (this.isBoardFull()) {
        // TODO: Shouldn't be here.
        return;
      }

      var minion: Minion = new Minion(spell.card.name, spell.card.attack, spell.card.health, spell.card, this);

      // If cast before another minion
      var beforeIndex = this.board.indexOf(before);
      if (beforeIndex >= 0) {
        this.board.splice(beforeIndex, 0, minion);
      }
      else {
        this.board.push(minion);
      }

      minion.onEvent(GameEvent.CAST, minion, null);
      minion.onEvent(GameEvent.SUMMON, minion, null);

      this.game.minionCounter++;
    }

    private handleCastWeapon(spell: Spell, before: Minion): void {
      this.weapon = new Weapon(spell.card.name, spell.card.attack, spell.card.durability, spell.card, this);
      this.onEvent(GameEvent.CAST, spell, null);
      this.game.invoke(spell.card.onCast, this.weapon, null);
    }

    private handleCastSpell(spell: Spell, before: Minion): void {
      this.onEvent(GameEvent.CAST, spell, null);
      this.game.invoke(spell.card.onCast, spell, null);
    }

    /**
     * Summon a minion by name to the player's board
     * @param name
     */
    public summonMinionNamed(name: string): void {
      if (this.isBoardFull()) {
        console.log("Shouldn't be here.");
        return;
      }

      var card : Card = Card.get(name);
      var minion: Minion = new Minion(card.name, card.attack, card.health, card, this);
      this.board.push(minion);
      this.game.invoke(card.onCast, minion, null);
      minion.onEvent(GameEvent.SUMMON, minion, null);
    }

    /**
     * Equip a weapon card by name
     * @param name
     */
    public equipWeaponNamed(name: string): void {
      var card: Card = Card.get(name);
      this.weapon = new Weapon(card.name, card.attack, card.durability, card, this);
    }

    /**
     * Whether or not the player is protected by any taunt minions
     */
    public hasTaunt(): boolean {
      var hasTaunt: boolean = false;

      _.each(this.board, (minion: Minion) => {
        if (minion.taunt && !minion.stealth)
          hasTaunt = true;
      });

      return hasTaunt;
    }

    /**
     * Whether or not the player has any weapon equipped
     */
    public hasWeapon(): boolean {
      return (this.weapon != null && this.weapon.durability > 0);
    }

    /**
     * Discard a number of random cards from the player's hand
     * @param count
     */
    public discardRandomCount(count: number): void {
      _.times(count, () => {
        if (this.hand.size() > 0)
          var desiredIndex = Math.floor(Math.random() * this.hand.size());
          this.discardSpell(this.hand[desiredIndex]);
      });
    }

    /**
     * Discard a specific spell from the player's hand
     * @param spell
     */
    public discardSpell(spell: Spell): void {
      this.hand.remove(spell);
    }

    /**
     * Use the player's hero ability
     */
    public useAbility(): void {
      this.mana -= this.ability.cost;
      this.abilityUsed = true;
      this.game.invoke(this.ability.onCast, this, null);
    }

    /**
     * Add a new "triggered aura" to the player
     * @param trigger
     */
    public addSecretAura(trigger: Function): Aura {
      var aura: Aura = Aura.createTriggerable(this, trigger);
      this.secrets.add(aura);
      return aura;
    }

  }

}