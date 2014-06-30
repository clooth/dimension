/// <reference path="Triggerable.ts" />
/// <reference path="GameObject.ts" />
/// <reference path="Player.ts" />
/// <reference path="Stat.ts" />

module Dimension {

  export class Aura extends Triggerable {
    public owner : GameObject;
    public expires : boolean = false;
    public stat : Stat = Stat.NONE;
    public amount : number = 0;
    public dynamic : boolean = false;
    public calculation : Function;
    public onTrigger : Function;

    constructor(owner:GameObject, stat:Stat, amount:number, expires:boolean) {
      super();
      this.owner = owner;
      this.stat = stat;
      this.amount = amount;
      this.expires = expires;
      this.dynamic = false;
    }

    public static createDynamic(owner:GameObject, stat:Stat, calculation:Function, expires:boolean) : Aura {
      var aura : Aura = new Aura(owner, stat, 0, expires);
      aura.calculation = calculation;
      aura.dynamic = true;
      return aura;
    }

    public static createTriggerable(owner:GameObject, onTrigger:Function) : Aura {
      var aura : Aura = new Aura(owner, null, 0, false);
      aura.onTrigger = onTrigger;
      return aura;
    }

    public amountFor(c : any) : number {
      if (!this.dynamic)
        return this.amount;
      else
        return this.owner.game.invoke(this.calculation, c, null);
    }

    public trigger(source : any) : void {
      this.owner.game.removeAura(this);
      (<Player>this.owner).secrets.remove(this);
      this.owner.onEvent(GameEvent.SECRET_REVEALED, this, source);
      this.owner.game.invoke(this.onTrigger, this.owner, source);
    }
  }
}