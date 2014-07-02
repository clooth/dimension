module Dimension {

  /**
   * Represents a static or dynamic "buff" for a character
   */
  export class Aura extends Triggerable {
    /**
     * The match object this Aura belongs to
     * @type {MatchObject}
     */
    public owner : MatchObject;

    /**
     * Expires at the end of the owner's turn
     * @type {boolean}
     */
    public expires : boolean = false;

    /**
     * The Stat this aura is buffing
     * @type {Stat}
     */
    public stat : Stat = Stat.NONE;

    /**
     * The amount this aura is buffing the stat by
     * @type {number}
     */
    public amount : number = 0;

    /**
     * The amount is calculated dynamically
     * @type {boolean}
     */
    public dynamic : boolean = false;

    /**
     * The function for dynamic amount calculation
     * @type {Function}
     */
    public calculation : Function;

    /**
     * The handler that's triggered on the match when this aura is triggered
     * @type {Function}
     */
    public onTrigger : Function;

  /**
   * Create a new Aura instance
   *
   * @param {MatchObject} owner   The match object that owns this aura
   * @param {Stat}       stat    The Stat this aura is buffing
   * @param {number}     amount  The amount its buffing it by
   * @param {boolean}    expires Whether or not it expires next turn
   */
    constructor(owner: MatchObject, stat: Stat, amount: number, expires: boolean) {
      super();
      this.owner = owner;
      this.stat = stat;
      this.amount = amount;
      this.expires = expires;
      this.dynamic = false;
    }

    /**
     * Create a dynamically calculated aura
     *
     * @param  {MatchObject} owner       The match object which owns this aura
     * @param  {Stat}       stat        The stat the aura is buffing
     * @param  {Function}   calculation The function that calculates the amount
     * @param  {boolean}    expires     Whether or not it expires next turn
     * @return {Aura}                   The newly created Aura
     */
    public static createDynamic(owner: MatchObject, stat: Stat, calculation: Function, expires: boolean) : Aura {
      var aura : Aura = new Aura(owner, stat, 0, expires);
      aura.calculation = calculation;
      aura.dynamic = true;
      return aura;
    }

    /**
     * Create a triggerable aura
     *
     * @param  {MatchObject} owner     The match object which owns this aura
     * @param  {Function}   onTrigger The function to invoke when the aura is triggered
     * @return {Aura}                 The newly created Aura
     */
    public static createTriggerable(owner: MatchObject, onTrigger: Function) : Aura {
      var aura : Aura = new Aura(owner, null, 0, false);
      aura.onTrigger = onTrigger;
      return aura;
    }

    /**
     * Calculate the amount value for a given object
     *
     * @param  {any}    c The object to calculate the amount for
     * @return {number}   The final amount value
     */
    public amountFor(c: any): number {
      // Static amount
      if (!this.dynamic)
        return this.amount;
      // Invoke dynamic calculation function
      else
        return this.owner.match.invoke(this.calculation, c, null);
    }

    /**
     * Trigger this aura with a given source object
     *
     * @param {any} source The object that triggered the aura
     */
    public trigger(source: any): void {
      // Remove the aura from the match
      this.owner.match.removeAura(this);
      (<Player>this.owner).secrets.remove(this);
      // Send events
      this.owner.onEvent(MatchEvent.SECRET_REVEALED, this, source);
      this.owner.match.invoke(this.onTrigger, this.owner, source);
    }
  }
}