module Dimension {

  export class Triggerable {
    public onCast : Function;
    public onDamage: Function;
    public onDamageDealt : Function;
    public onDeath : Function;
    public onStartOfTurn: Function;
    public onEndOfTurn: Function;
    public onHeal: Function;
    public onDraw: Function;
    public onAttack: Function;
    public onSecretRevealed: Function;
    public onSummon: Function;

    constructor() {
    }

    public getTrigger(e : GameEvent) : Function {
      switch (e) {
        case GameEvent.ATTACK:
          return this.onAttack;
        case GameEvent.DAMAGE:
          return this.onDamage;
        case GameEvent.DAMAGE_DEALT:
          return this.onDamageDealt;
        case GameEvent.START_OF_TURN:
          return this.onStartOfTurn;
        case GameEvent.END_OF_TURN:
          return this.onEndOfTurn;
        case GameEvent.DEATH:
          return this.onDeath;
        case GameEvent.CAST:
          return this.onCast;
        case GameEvent.HEAL:
          return this.onHeal;
        case GameEvent.DRAW:
          return this.onDraw;
        case GameEvent.SECRET_REVEALED:
          return this.onSecretRevealed;
        case GameEvent.SUMMON:
          return this.onSummon;
      }

      return null;
    }

    public applyToAura(a : Aura) : void {
      a.onCast = this.onCast;
      a.onDamage = this.onDamage;
      a.onDamageDealt = this.onDamageDealt;
      a.onDeath = this.onDeath;
      a.onStartOfTurn = this.onStartOfTurn;
      a.onEndOfTurn = this.onEndOfTurn;
      a.onHeal = this.onHeal;
      a.onDraw = this.onDraw;
      a.onAttack = this.onAttack;
      a.onSecretRevealed = this.onSecretRevealed;
      a.onSummon = this.onSummon;
    }
  }

}