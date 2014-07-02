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

    public getTrigger(e : MatchEvent) : Function {
      switch (e) {
        case MatchEvent.ATTACK:
          return this.onAttack;
        case MatchEvent.DAMAGE:
          return this.onDamage;
        case MatchEvent.DAMAGE_DEALT:
          return this.onDamageDealt;
        case MatchEvent.START_OF_TURN:
          return this.onStartOfTurn;
        case MatchEvent.END_OF_TURN:
          return this.onEndOfTurn;
        case MatchEvent.DEATH:
          return this.onDeath;
        case MatchEvent.CAST:
          return this.onCast;
        case MatchEvent.HEAL:
          return this.onHeal;
        case MatchEvent.DRAW:
          return this.onDraw;
        case MatchEvent.SECRET_REVEALED:
          return this.onSecretRevealed;
        case MatchEvent.SUMMON:
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