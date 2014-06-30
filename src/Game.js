/// <reference path="Player.ts" />
/// <reference path="GameState.ts" />
var Dimension;
(function (Dimension) {
    /**
    * Represents a single Dimension Game
    */
    var Game = (function () {
        function Game() {
            /**
            * List of players in this game
            */
            this.players = new Array();
            /**
            * The index of the current player
            */
            this.currentPlayerIndex = 0;
            /**
            * The current game state
            */
            this.state = 5 /* MULLIGAN */;
            /**
            * List of global auras in the current game
            */
            this.globalAuras = new Collections.LinkedList();
            /**
            * Number of spells played this turn
            * @type {number}
            */
            this.spellCounter = 0;
            /**
            * Number of turn rounds completed in this game
            * @type {number}
            */
            this.turnCounter = 0;
            /**
            * Number of minions played this turn
            * @type {number}
            */
            this.minionCounter = 0;
        }
        /**
        * Get the currently in-turn player object
        * @returns {Player}
        */
        Game.prototype.currentPlayer = function () {
            return this.players[this.currentPlayerIndex];
        };

        /**
        * Get the current player's opponent
        * @returns {Player}
        */
        Game.prototype.currentOpponent = function () {
            return this.players[(this.currentPlayerIndex + 1 % this.players.length)];
        };

        /**
        * Initialize a new game instance
        */
        Game.prototype.init = function () {
            this.state = 5 /* MULLIGAN */;
            this.currentPlayerIndex = 0;

            this.currentPlayer().opponent = this.currentOpponent();
            this.currentOpponent().opponent = this.currentPlayer();

            for (var pi = 0, pc = this.players.length; pi < pc; pi++) {
                var player = this.players[pi];
                while (player.hand.count < 3) {
                    player.drawCard();
                }
            }
            this.currentOpponent().drawCard();
        };

        /**
        * Start the game normally (called after mulligan)
        */
        Game.prototype.start = function () {
            this.state = 0 /* CAST_SPELL */;

            this.currentPlayer().mana = 1;
            this.currentPlayer().maxMana = 1;

            for (var pi = 0, pc = this.players.length; pi < pc; pi++) {
                var player = this.players[pi];
                while (player.hand.count < 4) {
                    player.drawCard();
                }
            }
        };

        Game.prototype.endTurn = function () {
            this.removeExpiredAuras();

            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % (this.players.length);
            if (this.currentPlayerIndex == 0)
                this.turnCounter++;

            // Reset counters
            this.spellCounter = 0;
            this.minionCounter = 0;

            // Handle current mana
            var player = this.currentPlayer();
            if (player.maxMana < 10) {
                player.maxMana++;
            }
            player.mana = player.maxMana - player.overload;
            player.overload = 0;

            // Remove sickness and reset attack count
            player.attackCount = 0;
            _.each(player.board, function (m) {
                m.sick = false;
                m.attackCount = 0;
            });

            // Reset ability usage
            player.abilityUsed = false;

            // Draw a card
            player.drawCard();

            // Send start of turn events
            _.each(this.players, function (player) {
                player.onEvent(3 /* START_OF_TURN */, player, null);
                _.each(player.board, function (minion) {
                    minion.onEvent(3 /* START_OF_TURN */, minion, null);
                });
            });
        };

        /**
        * Handle combat damage between two characters
        * @param attacker
        * @param defender
        */
        Game.prototype.combat = function (attacker, defender) {
            attacker.attackCount++;
            attacker.stealth = false;
            attacker.onEvent(0 /* ATTACK */, attacker, defender);

            var a1 = attacker.getAttack();
            var a2 = (defender instanceof Dimension.Minion) ? defender.getAttack() : 0;

            if (a1 > 0) {
                attacker.onEvent(2 /* DAMAGE_DEALT */, defender, attacker);
                defender.combatDamage(a1, attacker);
                defender.onEvent(1 /* DAMAGE */, attacker, defender);
            }

            if (a2 > 0) {
                defender.onEvent(2 /* DAMAGE_DEALT */, attacker, defender);
                attacker.combatDamage(a2, defender);
                attacker.onEvent(1 /* DAMAGE */, attacker, defender);
            }

            this.postDamage();

            // Decay weapon durability
            if (attacker instanceof Dimension.Player && attacker.hasWeapon())
                attacker.weapon.decayDurability(1);
        };

        /**
        * Handle the removal of dead minions and send death events
        */
        Game.prototype.postDamage = function () {
            _.each(this.players, function (player) {
                _.each(player.board, function (minion) {
                    if (minion.getHealth() <= 0) {
                        minion.controller.board.remove(minion);
                        minion.onEvent(5 /* DEATH */, minion, null);
                    }
                });
            });
        };

        /**
        * Get a list of global auras by a given stat
        * @param stat The Stat value we're looking for auras of
        * @returns {Collections.LinkedList<Aura>}
        */
        Game.prototype.aurasByStat = function (stat) {
            var list = new Collections.LinkedList();

            for (var ai = 0, ac = this.globalAuras.count; ai < ac; ai++) {
                var aura = this.globalAuras[ai];
                if (aura.stat == stat) {
                    list.add(aura);
                }
            }

            return list;
        };

        /**
        * Sum the amount of all auras by a given stat
        * @param stat The Stat value we want to sum up
        * @returns {number}
        */
        Game.prototype.sumAurasByStat = function (stat) {
            var sum = 0;
            var auras = this.aurasByStat(stat);

            for (var ai = 0, ac = auras.count; ai < ac; ai++) {
                sum += auras[ai].amountFor(this);
            }

            return sum;
        };

        /**
        * Remove all expiring auras from the game
        */
        Game.prototype.removeExpiredAuras = function () {
            // Gather a list of all characters in existence
            var chars = new Collections.LinkedList();
            for (var pi = 0, pc = this.players.length; pi < pc; pi++) {
                var player = this.players[pi];
                chars.add(player);
                for (var mi = 0, mc = player.board.length; mi < mc; mi++) {
                    chars.add(player.board[mi]);
                }
            }

            for (var ci = 0, cc = chars.count; ci < cc; ci++) {
                var c = chars[ci];

                // FIXME: Unfreezing shouldn't belong here
                if (c.controller == this.currentPlayer()) {
                    c.unfreeze();
                }

                c.onEvent(4 /* END_OF_TURN */, c, null);

                // Remove global auras
                this.globalAuras = _.remove(this.globalAuras, 'expires');

                // Remove character auras
                c.auras = _.remove(c.auras, 'expires');

                // If the character is a player, remove weapon auras too
                if (c instanceof Dimension.Player) {
                    var player = c;
                    if (player.hasWeapon()) {
                        player.weapon.auras = _.remove(player.weapon.auras, 'expires');
                    }
                }
            }
        };

        /**
        * Remove a given aura from the whole game
        * @param aura The aura to remove
        */
        Game.prototype.removeAura = function (aura) {
            this.globalAuras.remove(aura);

            for (var pi = 0, pc = this.players.length; pi < pc; pi++) {
                var player = this.players[pi];
                player.secrets.remove(aura);
                player.auras.remove(aura);
                for (var mi = 0, mc = player.board.length; mi < mc; mi++) {
                    var minion = player.board[mi];
                    minion.auras.remove(aura);
                }
            }
        };

        /**
        * TODO: This might not work due to javascript's reference nature
        * @param handler
        * @param self
        * @param other
        */
        Game.prototype.invoke = function (handler, self, other) {
            if (handler != null) {
                return handler.apply(this, [self, other]);
            }
            return null;
        };

        /**
        * Get a list of valid targets in the game for a specific filter
        * @param filter The filtering function used
        * @returns {Collections.LinkedList<Character>}
        */
        Game.prototype.validTargetsWithFilter = function (filter) {
            var _this = this;
            var targets = new Collections.LinkedList();

            _.each(this.players, function (player) {
                if (_this.invoke(filter, player, null) == true) {
                    targets.add(player);
                }

                _.each(player.board, function (minion) {
                    if (!minion.shroud && (_this.invoke(filter, minion, null) == true)) {
                        targets.add(minion);
                    }
                });
            });

            return targets;
        };

        /**
        * Count the number of valid targets for a filter
        * @param filter The filter used
        * @returns {number}
        */
        Game.prototype.targetsCountWithFilter = function (filter) {
            return this.validTargetsWithFilter(filter).count;
        };

        /**
        * Activate the targeting mode with a filter and handler function
        * @param filter  The filter function to use
        * @param handler The callback handler to invoke on the targeted character
        */
        Game.prototype.chooseTarget = function (filter, handler) {
            if (this.targetsCountWithFilter(filter) == 0)
                return;

            this.filter = filter;
            this.onTargetHandler = handler;
            this.state = 2 /* TARGET */;
        };

        Game.prototype.chooseOne = function (s1, h1, s2, h2) {
            //      this.options.clear();
            //      this.options.add(new Option(self, s1, h1));
            //      this.options.add(new Option(self, s2, h2));
            //      this.state = GameState.CHOOSE_ONE;
        };

        /**
        * !!! HELPERS FOR CARDS
        */
        Game.prototype.hasCombo = function () {
            return this.spellCounter >= 1;
        };

        /**
        * !!! ENUMERATING TARGETS
        */
        Game.prototype.forEachTargetWithFilter = function (filter, handler) {
            this.forEachTarget(this.validTargetsWithFilter(filter), handler);
        };

        Game.prototype.forNumberOfRandomTargetsWithFilter = function (count, filter, handler) {
            var targets = this.validTargetsWithFilter(filter);
            this.forEachTarget(_.sample(targets, count), handler);
        };

        Game.prototype.forEachTargetWithFilterExceptRandom = function (count, filter, handler) {
            var targets = this.validTargetsWithFilter(filter);
            this.forEachTarget(_.sample(targets, targets.count - count), handler);
        };

        Game.prototype.forEachTarget = function (targets, handler) {
            var _this = this;
            _.each(targets, function (char) {
                if (char.getHealth() > 0) {
                    _this.invoke(handler, char, null);
                }
            });
        };

        /**
        * !!! DAMAGING TARGETS
        */
        Game.prototype.assignDamageForEach = function (list, damage, source) {
            _.each(list, function (character) {
                character.combatDamage(damage, source);
                character.onEvent(1 /* DAMAGE */, character, source);
            });
            this.postDamage();
        };

        Game.prototype.damageForEachWithFilter = function (filter, damage, source) {
            this.assignDamageForEach(this.validTargetsWithFilter(filter), damage, source);
        };

        Game.prototype.spellDamageForEachWithFilter = function (filter, damage, source) {
            damage += source.owner.sumAurasByStat(9 /* SPELL_POWER */);
            this.assignDamageForEach(this.validTargetsWithFilter(filter), damage, source);
        };

        Game.prototype.damageForNumberOfRandom = function (count, filter, damage, source) {
            this.assignDamageForEach(_.sample(this.validTargetsWithFilter(filter), count), damage, source);
        };

        Game.prototype.spellDamageForNumberOfRandom = function (count, filter, damage, source) {
            damage += source.owner.sumAurasByStat(9 /* SPELL_POWER */);
            this.assignDamageForEach(_.sample(this.validTargetsWithFilter(filter), count), damage, source);
        };
        Game.MAXIMUM_BOARD_SIZE = 7;

        Game.MAXIMUM_HAND_SIZE = 10;
        return Game;
    })();
    Dimension.Game = Game;
})(Dimension || (Dimension = {}));
//# sourceMappingURL=Game.js.map
