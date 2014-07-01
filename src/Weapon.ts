module Dimension {

  export class Weapon extends GameObject {
    public card: Card;
    public attack: number;
    public durability: number;
    public durabilityLoss: number = 1;

    constructor(name: string, attack: number, durability: number, card: Card, owner: Player) {
        super(owner.game);
        this.card = card;
        this.owner = this.controller = owner;
        this.attack = attack;
        this.durability = durability;
        this.durabilityLoss = card.durabilityLoss;
    }

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