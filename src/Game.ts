/// <reference path="Player.ts" />
/// <reference path="GameState.ts" />

module Dimension {

  /**
   * Represents a single Dimension Game
   */
  export class Game {

    /**
     * Maximum number of minions allowed on the board
     */
    public static MAXIMUM_BOARD_SIZE: number = 7;

    /**
     * Maximum number of spells allowed in a player's hand
     */
    public static MAXIMUM_HAND_SIZE: number = 10;

    /**
     * List of players in this game
     */
    public players: Array<Player> = new Array<Player>();

    /**
     * The index of the current player
     */
    public currentPlayerIndex: number = 0;

    /**
     * The current game state
     */
    public state: GameState = GameState.MULLIGAN;

    /**
     * List of global auras in the current game
     */
    public globalAuras: Collections.LinkedList<Aura> = new Collections.LinkedList<Aura>();

    /**
     * Temporary aura storage for event triggers
     */
    public aura: Aura;

    /**
     * Number of spells played this turn
     * @type {number}
     */
    public spellCounter: number = 0;

    /**
     * Number of turn rounds completed in this game
     * @type {number}
     */
    public turnCounter: number = 0;

    /**
     * Number of minions played this turn
     * @type {number}
     */
    public minionCounter: number = 0;

    /**
     * Get the currently in-turn player object
     * @returns {Player}
     */
    public currentPlayer(): Player {
      return this.players[this.currentPlayerIndex];
    }

    /**
     * Get the current player's opponent
     * @returns {Player}
     */
    public currentOpponent(): Player {
      return this.players[(this.currentPlayerIndex + 1 % this.players.length)];
    }

    /**
     * Initialize a new game instance
     */
    public init(): void {
      this.state = GameState.MULLIGAN;
      this.currentPlayerIndex = 0;

      this.currentPlayer().opponent = this.currentOpponent();
      this.currentOpponent().opponent = this.currentPlayer();

      // Draw mulligan cards
      for (var pi = 0, pc = this.players.length; pi < pc; pi++) {
        var player: Player = this.players[pi];
        while (player.hand.count < 3) {
          player.drawCard();
        }
      }
      this.currentOpponent().drawCard();
    }

    /**
     * Start the game normally (called after mulligan)
     */
    public start(): void {
      this.state = GameState.CAST_SPELL;

      this.currentPlayer().mana = 1;
      this.currentPlayer().maxMana = 1;

      for (var pi = 0, pc = this.players.length; pi < pc; pi++) {
        var player: Player = this.players[pi];
        while (player.hand.count < 4) {
          player.drawCard();
        }
      }
    }

    public endTurn(): void {
      this.removeExpiredAuras();

      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % (this.players.length);
      if (this.currentPlayerIndex == 0)
        this.turnCounter++;

      // Reset counters
      this.spellCounter = 0;
      this.minionCounter = 0;

      // Handle current mana
      var player: Player = this.currentPlayer();
      if (player.maxMana < 10) {
        player.maxMana++;
      }
      player.mana = player.maxMana - player.overload;
      player.overload = 0;

      // Remove sickness and reset attack count
      player.attackCount = 0;
      _.each(player.board, (m: Minion) => {
        m.sick = false;
        m.attackCount = 0;
      });

      // Reset ability usage
      player.abilityUsed = false;

      // Draw a card
      player.drawCard();

      // Send start of turn events
      _.each(this.players, (player: Player) => {
        player.onEvent(GameEvent.START_OF_TURN, player, null);
        _.each(player.board, (minion: Minion) => {
          minion.onEvent(GameEvent.START_OF_TURN, minion, null);
        });
      });
    }

    /**
     * Handle combat damage between two characters
     * @param attacker
     * @param defender
     */
    public combat(attacker: Character, defender: Character): void {
      attacker.attackCount++;
      attacker.stealth = false;
      attacker.onEvent(GameEvent.ATTACK, attacker, defender);

      var a1: number = attacker.getAttack();
      var a2: number = (defender instanceof Minion) ? defender.getAttack() : 0;

      if (a1 > 0) {
        attacker.onEvent(GameEvent.DAMAGE_DEALT, defender, attacker);
        defender.combatDamage(a1, attacker);
        defender.onEvent(GameEvent.DAMAGE, attacker, defender);
      }

      if (a2 > 0) {
        defender.onEvent(GameEvent.DAMAGE_DEALT, attacker, defender);
        attacker.combatDamage(a2, defender);
        attacker.onEvent(GameEvent.DAMAGE, attacker, defender);
      }

      this.postDamage();

      // Decay weapon durability
      if (attacker instanceof Player && (<Player>attacker).hasWeapon())
        (<Player>attacker).weapon.decayDurability(1);
    }

    /**
     * Handle the removal of dead minions and send death events
     */
    public postDamage(): void {
      _.each(this.players, (player: Player) => {
        _.each(player.board, (minion: Minion) => {
          if (minion.getHealth() <= 0) {
            minion.controller.board.remove(minion);
            minion.onEvent(GameEvent.DEATH, minion, null);
          }
        });
      });
    }

    /**
     * Get a list of global auras by a given stat
     * @param stat The Stat value we're looking for auras of
     * @returns {Collections.LinkedList<Aura>}
     */
    public aurasByStat(stat: Stat): Collections.LinkedList<Aura> {
      var list: Collections.LinkedList<Aura> = new Collections.LinkedList<Aura>();

      for (var ai = 0, ac = this.globalAuras.count; ai < ac; ai++) {
        var aura: Aura = this.globalAuras[ai];
        if (aura.stat == stat) {
          list.add(aura);
        }
      }

      return list;
    }

    /**
     * Sum the amount of all auras by a given stat
     * @param stat The Stat value we want to sum up
     * @returns {number}
     */
    public sumAurasByStat(stat: Stat): number {
      var sum: number = 0;
      var auras: Collections.LinkedList<Aura> = this.aurasByStat(stat);

      for (var ai = 0, ac = auras.count; ai < ac; ai++) {
        sum += auras[ai].amountFor(this);
      }

      return sum;
    }

    /**
     * Remove all expiring auras from the game
     */
    public removeExpiredAuras(): void {
      // Gather a list of all characters in existence
      var chars: Collections.LinkedList<Character> = new Collections.LinkedList<Character>();
      for (var pi = 0, pc = this.players.length; pi < pc; pi++) {
        var player: Player = this.players[pi];
        chars.add(player);
        for (var mi = 0, mc = player.board.length; mi < mc; mi++) {
          chars.add(player.board[mi]);
        }
      }

      // Work magic on all of them
      for (var ci = 0, cc = chars.count; ci < cc; ci++) {
        var c: Character = chars[ci];

        // FIXME: Unfreezing shouldn't belong here
        if (c.controller == this.currentPlayer()) {
          c.unfreeze();
        }

        c.onEvent(GameEvent.END_OF_TURN, c, null);

        // Remove global auras
        this.globalAuras = _.remove(this.globalAuras, 'expires');

        // Remove character auras
        c.auras = _.remove(c.auras, 'expires');

        // If the character is a player, remove weapon auras too
        if (c instanceof Player) {
          var player: Player = <Player>c;
          if (player.hasWeapon()) {
            player.weapon.auras = _.remove(player.weapon.auras, 'expires');
          }
        }
      }
    }

    /**
     * Remove a given aura from the whole game
     * @param aura The aura to remove
     */
    public removeAura(aura: Aura): void {
      this.globalAuras.remove(aura);

      for (var pi = 0, pc = this.players.length; pi < pc; pi++) {
        var player: Player = this.players[pi];
        player.secrets.remove(aura);
        player.auras.remove(aura);
        for (var mi = 0, mc = player.board.length; mi < mc; mi++) {
          var minion: Minion = player.board[mi];
          minion.auras.remove(aura);
        }
      }
    }

    /**
     * TODO: This might not work due to javascript's reference nature
     * @param handler
     * @param self
     * @param other
     */
    public invoke(handler: Function, self: any, other: any) {
      if (handler != null) {
        return handler.apply(this, [self, other]);
      }
      return null;
    }

    /**
     * !!! TARGETING
     */

    /**
     * The filter to use when targeting characters
     */
    public filter: Function;

    /**
     * The handler to invoke on the targeted character
     */
    public onTargetHandler: Function;

    /**
     * Get a list of valid targets in the game for a specific filter
     * @param filter The filtering function used
     * @returns {Collections.LinkedList<Character>}
     */
    public validTargetsWithFilter(filter: Function): Collections.LinkedList<Character> {
      var targets: Collections.LinkedList<Character> = new Collections.LinkedList<Character>();

      _.each(this.players, (player: Player) => {
        if (this.invoke(filter, player, null) == true) {
          targets.add(player);
        }

        _.each(player.board, (minion: Minion) => {
          if (!minion.shroud && (this.invoke(filter, minion, null) == true)) {
            targets.add(minion);
          }
        });
      });

      return targets;
    }

    /**
     * Count the number of valid targets for a filter
     * @param filter The filter used
     * @returns {number}
     */
    public targetsCountWithFilter(filter: Function): number {
      return this.validTargetsWithFilter(filter).count;
    }

    /**
     * Activate the targeting mode with a filter and handler function
     * @param filter  The filter function to use
     * @param handler The callback handler to invoke on the targeted character
     */
    public chooseTarget(filter: Function, handler: Function): void {
      if (this.targetsCountWithFilter(filter) == 0)
        return;

      this.filter = filter;
      this.onTargetHandler = handler;
      this.state = GameState.TARGET;
    }

    public chooseOne(s1: string, h1: Function, s2: string, h2: Function): void {
//      this.options.clear();
//      this.options.add(new Option(self, s1, h1));
//      this.options.add(new Option(self, s2, h2));
//      this.state = GameState.CHOOSE_ONE;
    }


    /**
     * !!! HELPERS FOR CARDS
     */

    public hasCombo(): boolean {
      return this.spellCounter >= 1;
    }

    /**
     * !!! ENUMERATING TARGETS
     */
    public forEachTargetWithFilter(filter: Function, handler: Function) {
      this.forEachTarget(this.validTargetsWithFilter(filter), handler);
    }

    public forNumberOfRandomTargetsWithFilter(count: number, filter: Function, handler: Function): void {
      var targets: Collections.LinkedList<Character> = this.validTargetsWithFilter(filter);
      this.forEachTarget(_.sample(targets, count), handler);
    }

    public forEachTargetWithFilterExceptRandom(count: number, filter: Function, handler: Function): void {
      var targets: Collections.LinkedList<Character> = this.validTargetsWithFilter(filter);
      this.forEachTarget(_.sample(targets, targets.count - count), handler);
    }

    public forEachTarget(targets: Collections.LinkedList<Character>, handler: Function): void {
      _.each(targets, (char: Character) => {
        if (char.getHealth() > 0) {
          this.invoke(handler, char, null);
        }
      });
    }

    /**
     * !!! DAMAGING TARGETS
     */
    private assignDamageForEach(list: Collections.LinkedList<Character>, damage: number, source: Character): void {
      _.each(list, (character: Character) => {
        character.combatDamage(damage, source);
        character.onEvent(GameEvent.DAMAGE, character, source);
      });
      this.postDamage();
    }

    public damageForEachWithFilter(filter: Function, damage: number, source: Character): void {
      this.assignDamageForEach(this.validTargetsWithFilter(filter), damage, source);
    }

    public spellDamageForEachWithFilter(filter: Function, damage: number, source: Character): void {
      damage += source.owner.sumAurasByStat(Stat.SPELL_POWER);
      this.assignDamageForEach(this.validTargetsWithFilter(filter), damage, source);
    }

    public damageForNumberOfRandom(count: number, filter: Function, damage: number, source: Character): void {
      this.assignDamageForEach(_.sample(this.validTargetsWithFilter(filter), count), damage, source)
    }

    public spellDamageForNumberOfRandom(count: number, filter: Function, damage: number, source: Character): void {
      damage += source.owner.sumAurasByStat(Stat.SPELL_POWER);
      this.assignDamageForEach(_.sample(this.validTargetsWithFilter(filter), count), damage, source)
    }

  }

}