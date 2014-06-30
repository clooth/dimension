/// <reference path="GameObject.ts" />

module Dimension {

  /**
   * TODO: Documentation
   */
  export class Character extends GameObject {
    public name: string;

    public attack: number;
    public health: number;
    public maxHealth: number;
    public armor: number = 0;

    public attackCount: number = 0;
    public frozen: number = 0;

    public windfury: boolean = false;
    public divineShield: boolean = false;
    public stealth: boolean = false;

    constructor(game) {
      super(game);
    }

    public getAttack(): number {
      return Math.max(0, this.attack + this.sumAurasByStat(Stat.ATTACK));
    }

    public getHealth(): number {
      return Math.max(0, this.health + this.sumAurasByStat(Stat.HEALTH));
    }

    public isDamaged(): boolean {
      return this.getHealth() < this.maxHealth;
    }

    public combatDamage(damage: number, source: Character): boolean {
      if (damage < 0) return false;

      if (this.divineShield) {
        this.divineShield = false;
        return false;
      }

      var migitation: number = Math.min(damage, this.armor);
      this.armor -= migitation;
      damage -= migitation;
      this.health -= damage;

      return (damage > 0);
    }

    public damage(damage: number, source: Character): void {
      if (damage < 0) return;

      var inflicted: boolean = this.combatDamage(damage, source);
      if (!inflicted) {
        return;
      }

      this.onEvent(GameEvent.DAMAGE, this, source);
      this.game.postDamage();
    }

    public spellDamage(damage: number, source: Character): void {
      damage += source.owner.sumAurasByStat(Stat.SPELL_POWER);

      if (damage <= 0) {
        return;
      }

      var inflicted: boolean = this.combatDamage(damage, source);
      if (!inflicted) {
        return;
      }

      this.onEvent(GameEvent.DAMAGE, this, source);
      this.game.postDamage();
    }

    public destroy(): void {
      this.health = -1000;
      this.game.postDamage();
    }

    public heal(amount: number): void {
      amount = Math.min(amount, Math.max(this.maxHealth-this.getHealth(), 0));

      if (amount > 0) {
        this.health += amount;
        this.onEvent(GameEvent.HEAL, this, null);
      }
    }

    public gain(attack: number, health: number): void {
      if (this.getHealth() <= 0) return;

      this.attack += attack;
      this.health += health;
    }

    public freeze(): void {
      this.freezeForTurns(1);
    }

    public freezeForTurns(turns: number): void {
      this.frozen = Math.max(turns, this.frozen);
    }

    public isFrozen(): boolean {
      return this.frozen > 0;
    }

    public unfreeze(): void {
      if (this.frozen > 0)
        this.frozen--;
    }

  }

}