module Dimension {

  class EventObject {
    event: GameEvent;
    source: any;
    other: any;

    constructor(e: GameEvent, source: any, other: any) {
      this.event = e;
      this.source = source;
      this.other = other;
    }

    public toString(): string {
      return this.event + " " + this.source + " " + this.other;
    }
  }

  export class GameObject {
    public owner: Player;
    public controller: Player;
    public game: Game;

    private eventStack: Array<EventObject> = [];

    constructor(game: Game) {
      this.game = game;
    }

    public getController(): Player {
      return (this.controller == null) ? this.owner : this.controller;
    }

    public runEvent(e: GameEvent, source: any, other: any) {
      var auras: Array<Aura> = this.getAuras();
      for (var i = 0, l = auras.length; i < l; i++) {
        this.game.aura = auras[i];
        this.game.invoke(auras[i].getTrigger(e), source, other);
      }
    }

    /**
     * Push a GameEvent onto this object's event stack
     * @param e      The event to run
     * @param source The event's source object
     * @param other  The event's target object
     */
    public onEvent(e: GameEvent, source: any, other: any): void {
      this.eventStack.push(new EventObject(e, source, other));

      if (this.eventStack.length > 1)
        return;

      while (this.eventStack.length > 0) {
        var eo: EventObject = this.eventStack.shift();
        this.handleRunEvent(eo);
      }
    }

    /**
     * Handler for running an event from the event stack.
     * Also removes the event ran.
     * @param eo The EventObject to run
     */
    private handleRunEvent(eo: EventObject): void {
      this.runEvent(eo.event, eo.source, eo.other);

      this.removeObject(eo, this.eventStack);
    }

    auras: Collections.LinkedList<Aura> = new Collections.LinkedList<Aura>();

    public addAura(stat: Stat, amount: number, expires: boolean, global: boolean = false): Aura {
      var aura: Aura = new Aura(this, stat, amount, expires);

      if (global)
        this.game.globalAuras.add(aura);
      else
        this.auras.add(aura);

      return aura;
    }

    public addDynamicAura(stat: Stat, calculation: Function, expires: boolean, global: boolean = false): Aura {
      var aura: Aura = Aura.createDynamic(this, stat, calculation, expires);

      if (global)
        this.game.globalAuras.add(aura);
      else
        this.auras.add(aura);

      return aura;
    }

    public addAuraFromCard(card: Card): Aura {
      var aura: Aura = new Aura(this, Stat.NONE, 0, false);
      card.applyToAura(aura);
      this.auras.add(aura);

      return aura;
    }

    public removeAuras(): void {
      this.auras.clear();
      var ggAuras = this.game.globalAuras;

      for (var i = 0, l = ggAuras.size(); i < l; i++) {
        if (ggAuras[i].owner == this) {
          this.removeObject(ggAuras[i], this.game.globalAuras);
        }
      }
    }

    public getAuras(): Array<Aura> {
      var auras: Array<Aura> = [];

      auras = auras.concat(this.auras.toArray());
      auras = auras.concat(this.getController().secrets.toArray());
      auras = auras.concat(this.getController().opponent.secrets.toArray());
      auras = auras.concat(this.game.globalAuras.toArray());

      return auras;
    }

    public aurasByStat(stat: Stat): Array<Aura> {
      var list: Array<Aura> = [];
      var auras = this.getAuras();

      for (var i = 0, l = auras.length; i < l; i++) {
        if (auras[i].stat == stat) {
          list.push(auras[i]);
        }
      }

      return list;
    }

    public sumAurasByStat(stat: Stat): number {
      var sum: number = 0;
      return sum;
    }

    private removeObject(object, from) {
      var index = from.indexOf(object, 0);
      if (index != undefined) {
        from.splice(index, 1);
      }
    }

  }

}