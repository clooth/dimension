module Dimension {

  /**
   * Represents a single character object (minion or hero)
   */
  export class Character extends GameObject {
    /**
     * The name of the character
     * @type {string}
     */
    public name: string;

    /**
     * The current attack value
     * @type {number}
     */
    public attack: number;

    /**
     * The current health value
     * @type {number}
     */
    public health: number;

    /**
     * The maximum amount of health
     * @type {number}
     */
    public maxHealth: number;

    /**
     * The amount of damage migitated from incoming damage (removed when used)
     * @type {number}
     */
    public armor: number = 0;

    /**
     * The amount of times this character has attacked this turn
     * @type {number}
     */
    public attackCount: number = 0;

    /**
     * The amount of turns this character is frozen for (cannot attack)
     * @type {number}
     */
    public frozen: number = 0;

    /**
     * Whether or not able to attack twice the same turn
     * @type {boolean}
     */
    public windfury: boolean = false;

    /**
     * Negates first time damage
     * @type {boolean}
     */
    public divineShield: boolean = false;

    /**
     * Unable to be targeted
     * @type {boolean}
     */
    public stealth: boolean = false;

    constructor(game) {
      super(game);
    }

    /**
     * Calculate the actual attack value by counting in attack auras
     *
     * @return {number} The actual attack value
     */
    public getAttack(): number {
      return Math.max(0, this.attack + this.sumAurasByStat(Stat.ATTACK));
    }

    /**
     * Calculate the actual health value by counting in health auras
     *
     * @return {number} The actual health value
     */
    public getHealth(): number {
      return Math.max(0, this.health + this.sumAurasByStat(Stat.HEALTH));
    }

    /**
     * Whether or not the character is damaged
     *
     * @return {boolean} true if damaged
     */
    public isDamaged(): boolean {
      return this.getHealth() < this.maxHealth;
    }

    /**
     * Called when a character attacks this character
     *
     * @param  {number}    damage The amount of damage being inflicted
     * @param  {Character} source The attacking character
     * @return {boolean}          true if this character was damaged by the attack
     */
    public combatDamage(damage: number, source: Character): boolean {
      if (damage < 0) return false;

      // Negate first time damage if protected by divine shield
      if (this.divineShield) {
        this.divineShield = false;
        return false;
      }

      // Calculate armor migitation for incoming damage
      var migitation: number = Math.min(damage, this.armor);
      this.armor -= migitation;
      damage -= migitation;
      this.health -= damage;

      // Damaged or not
      return (damage > 0);
    }

    /**
     * Incoming damage from an attacking character
     *
     * In addition to `combatDamage`, this function sends out `GameEvent.DAMAGE`
     * and notifies the game about damage.
     *
     * @param {number}    damage        The amount of damage being inflicted
     * @param {Character} source        The attacking character
     * @param {boolean}   isSpellDamage Whether or not spell damage
     */
    public damage(damage: number, source: Character, isSpellDamage: boolean = false): void {
      // Add up spell power auras if any
      if (isSpellDamage)
        damage += source.owner.sumAurasByStat(Stat.SPELL_POWER);

      // Nope.
      if (damage < 0) return;

      // Deal combat damage, and return if no damage was dealt
      var inflicted: boolean = this.combatDamage(damage, source);
      if (!inflicted) {
        return;
      }

      // Notify interested parties about damage
      this.onEvent(GameEvent.DAMAGE, this, source);
      this.game.postDamage();
    }

    /**
     * Destroy this character without damage events.
     */
    public destroy(): void {
      this.health = -1000;
      this.game.postDamage();
    }

    /**
     * Heal by a given amount, but only up to maxHealth
     *
     * @param {number} amount The amount of health to recover
     */
    public heal(amount: number): void {
      // Maximum heal is up to max health
      amount = Math.min(amount, Math.max(this.maxHealth-this.getHealth(), 0));

      // Recover health and send events
      if (amount > 0) {
        this.health += amount;
        this.onEvent(GameEvent.HEAL, this, null);
      }
    }

    /**
     * Gain a number of attack and health
     *
     * @param {number} attack Amount of attack to gain
     * @param {number} health Amount of health to gain
     */
    public gain(attack: number, health: number): void {
      if (this.getHealth() <= 0) return;

      this.attack += attack;
      this.health += health;
    }

    /**
     * Freeze for a single turn
     */
    public freeze(): void {
      this.freezeForTurns(1);
    }

    /**
     * Freeze for a given number of turns
     * 
     * @param {number} turns Number of turns to freeze for
     */
    public freezeForTurns(turns: number): void {
      this.frozen = Math.max(turns, this.frozen);
    }

    /**
     * Whether or not the character is frozen
     *
     * @return {boolean} true if frozen
     */
    public isFrozen(): boolean {
      return this.frozen > 0;
    }

    /**
     * Remove one layer of freeze
     */
    public unfreeze(): void {
      if (this.frozen > 0)
        this.frozen--;
    }

  } // end Character

}