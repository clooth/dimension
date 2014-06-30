/// <reference path="GameObject.ts" />
/// <reference path="Card.ts" />
/// <reference path="Stat.ts" />

module Dimension {

  export class Weapon extends GameObject {
    public card: Card;
    public attack: number;
    public durability: number;
    public durabilityLoss: number;

    public getAttack(): number {
      return Math.max(0, this.attack + this.sumAurasByStat(Stat.ATTACK));
    }

    public decayAttack(amount: number): void {
      this.attack = Math.max(0, this.attack - amount)
    }

    public decayDurability(amount: number): void {
      if (amount == -1) {
        amount = this.durabilityLoss;
      }
      this.durability -= amount;
      if (this.durability <= 0 && this.owner.weapon == this) {
        this.destroy();
      }
    }

    public gainDurability(amount: number): void {
      this.durability += amount;
    }

    public destroy(): void {
      this.removeAuras();
      this.owner.weapon = null;
    }
  }

}