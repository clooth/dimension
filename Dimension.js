var Dimension;
(function (Dimension) {
    (function (GameEvent) {
        GameEvent[GameEvent["ATTACK"] = 0] = "ATTACK";
        GameEvent[GameEvent["DAMAGE"] = 1] = "DAMAGE";
        GameEvent[GameEvent["DAMAGE_DEALT"] = 2] = "DAMAGE_DEALT";
        GameEvent[GameEvent["START_OF_TURN"] = 3] = "START_OF_TURN";
        GameEvent[GameEvent["END_OF_TURN"] = 4] = "END_OF_TURN";
        GameEvent[GameEvent["DEATH"] = 5] = "DEATH";
        GameEvent[GameEvent["CAST"] = 6] = "CAST";
        GameEvent[GameEvent["HEAL"] = 7] = "HEAL";
        GameEvent[GameEvent["DRAW"] = 8] = "DRAW";
        GameEvent[GameEvent["SECRET_REVEALED"] = 9] = "SECRET_REVEALED";
        GameEvent[GameEvent["SUMMON"] = 10] = "SUMMON";
    })(Dimension.GameEvent || (Dimension.GameEvent = {}));
    var GameEvent = Dimension.GameEvent;
})(Dimension || (Dimension = {}));
var Dimension;
(function (Dimension) {
    var Triggerable = (function () {
        function Triggerable() {
        }
        Triggerable.prototype.getTrigger = function (e) {
            switch (e) {
                case 0 /* ATTACK */:
                    return this.onAttack;
                case 1 /* DAMAGE */:
                    return this.onDamage;
                case 2 /* DAMAGE_DEALT */:
                    return this.onDamageDealt;
                case 3 /* START_OF_TURN */:
                    return this.onStartOfTurn;
                case 4 /* END_OF_TURN */:
                    return this.onEndOfTurn;
                case 5 /* DEATH */:
                    return this.onDeath;
                case 6 /* CAST */:
                    return this.onCast;
                case 7 /* HEAL */:
                    return this.onHeal;
                case 8 /* DRAW */:
                    return this.onDraw;
                case 9 /* SECRET_REVEALED */:
                    return this.onSecretRevealed;
                case 10 /* SUMMON */:
                    return this.onSummon;
            }

            return null;
        };

        Triggerable.prototype.applyToAura = function (a) {
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
        };
        return Triggerable;
    })();
    Dimension.Triggerable = Triggerable;
})(Dimension || (Dimension = {}));
var Collections;
(function (Collections) {
    

    

    

    function defaultCompare(a, b) {
        if (a < b) {
            return -1;
        } else if (a === b) {
            return 0;
        } else {
            return 1;
        }
    }
    Collections.defaultCompare = defaultCompare;

    function defaultEquals(a, b) {
        return a === b;
    }
    Collections.defaultEquals = defaultEquals;

    function defaultToString(item) {
        if (item === null) {
            return 'COLLECTION_NULL';
        } else if (Collections.isUndefined(item)) {
            return 'COLLECTION_UNDEFINED';
        } else if (Collections.isString(item)) {
            return item;
        } else {
            return item.toString();
        }
    }
    Collections.defaultToString = defaultToString;

    function makeString(item, join) {
        if (typeof join === "undefined") { join = ","; }
        if (item === null) {
            return 'COLLECTION_NULL';
        } else if (Collections.isUndefined(item)) {
            return 'COLLECTION_UNDEFINED';
        } else if (Collections.isString(item)) {
            return item.toString();
        } else {
            var toret = "{";
            var first = true;
            for (var prop in item) {
                if (item.hasOwnProperty(prop)) {
                    if (first)
                        first = false;
                    else
                        toret = toret + join;
                    toret = toret + prop + ":" + item[prop];
                }
            }
            return toret + "}";
        }
    }
    Collections.makeString = makeString;

    function isFunction(func) {
        return (typeof func) === 'function';
    }
    Collections.isFunction = isFunction;

    function isUndefined(obj) {
        return (typeof obj) === 'undefined';
    }
    Collections.isUndefined = isUndefined;

    function isString(obj) {
        return Object.prototype.toString.call(obj) === '[object String]';
    }
    Collections.isString = isString;

    function reverseCompareFunction(compareFunction) {
        if (!Collections.isFunction(compareFunction)) {
            return function (a, b) {
                if (a < b) {
                    return 1;
                } else if (a === b) {
                    return 0;
                } else {
                    return -1;
                }
            };
        } else {
            return function (d, v) {
                return compareFunction(d, v) * -1;
            };
        }
    }
    Collections.reverseCompareFunction = reverseCompareFunction;

    function compareToEquals(compareFunction) {
        return function (a, b) {
            return compareFunction(a, b) === 0;
        };
    }
    Collections.compareToEquals = compareToEquals;

    var LinkedListNode = (function () {
        function LinkedListNode(value) {
            this.value = value;
            this.next = null;
            this.previous = null;
        }
        return LinkedListNode;
    })();
    Collections.LinkedListNode = LinkedListNode;

    var LinkedList = (function () {
        function LinkedList() {
            this.firstNode = null;
            this.lastNode = null;
            this.count = 0;
        }
        LinkedList.prototype.add = function (item) {
            var newNode = new LinkedListNode(item);

            if (this.firstNode == null) {
                this.firstNode = newNode;
                this.lastNode = newNode;
            } else {
                this.lastNode.next = newNode;
                newNode.previous = this.lastNode;
                this.lastNode = newNode;
            }

            this.count++;
        };

        LinkedList.prototype.clear = function () {
            this.firstNode = null;
            this.lastNode = null;
            this.count = 0;
        };

        LinkedList.prototype.contains = function (item) {
            return this.getNode(this.firstNode, item) != null;
        };

        LinkedList.prototype.remove = function (item) {
            var nodeToRemove = this.getNode(this.firstNode, item);

            if (nodeToRemove == null) {
                return false;
            }

            if (nodeToRemove.previous != null) {
                nodeToRemove.previous.next = nodeToRemove.next;
            }

            if (nodeToRemove.next != null) {
                nodeToRemove.next.previous = nodeToRemove.previous;
            } else {
                this.lastNode = nodeToRemove.previous;
            }

            if (nodeToRemove.previous == null && nodeToRemove.next == null) {
                this.firstNode = null;
            }

            this.count--;

            return true;
        };

        LinkedList.prototype.getNode = function (node, findValue) {
            if (node == null) {
                return null;
            }

            if (node.value == findValue) {
                return node;
            }

            if (node.next == null) {
                return null;
            }

            return this.getNode(node.next, findValue);
        };
        return LinkedList;
    })();
    Collections.LinkedList = LinkedList;

    

    var Dictionary = (function () {
        function Dictionary(toStrFunction) {
            this.table = {};
            this.nElements = 0;
            this.toStr = toStrFunction || Collections.defaultToString;
        }
        Dictionary.prototype.getValue = function (key) {
            var pair = this.table[this.toStr(key)];
            if (Collections.isUndefined(pair)) {
                return undefined;
            }
            return pair.value;
        };

        Dictionary.prototype.setValue = function (key, value) {
            if (Collections.isUndefined(key) || Collections.isUndefined(value)) {
                return undefined;
            }

            var ret;
            var k = this.toStr(key);
            var previousElement = this.table[k];
            if (Collections.isUndefined(previousElement)) {
                this.nElements++;
                ret = undefined;
            } else {
                ret = previousElement.value;
            }
            this.table[k] = {
                key: key,
                value: value
            };
            return ret;
        };

        Dictionary.prototype.remove = function (key) {
            var k = this.toStr(key);
            var previousElement = this.table[k];
            if (!Collections.isUndefined(previousElement)) {
                delete this.table[k];
                this.nElements--;
                return previousElement.value;
            }
            return undefined;
        };

        Dictionary.prototype.keys = function () {
            var array = [];
            for (var name in this.table) {
                if (this.table.hasOwnProperty(name)) {
                    var pair = this.table[name];
                    array.push(pair.key);
                }
            }
            return array;
        };

        Dictionary.prototype.values = function () {
            var array = [];
            for (var name in this.table) {
                if (this.table.hasOwnProperty(name)) {
                    var pair = this.table[name];
                    array.push(pair.value);
                }
            }
            return array;
        };

        Dictionary.prototype.forEach = function (callback) {
            for (var name in this.table) {
                if (this.table.hasOwnProperty(name)) {
                    var pair = this.table[name];
                    var ret = callback(pair.key, pair.value);
                    if (ret === false) {
                        return;
                    }
                }
            }
        };

        Dictionary.prototype.containsKey = function (key) {
            return !Collections.isUndefined(this.getValue(key));
        };

        Dictionary.prototype.clear = function () {
            this.table = {};
            this.nElements = 0;
        };

        Dictionary.prototype.size = function () {
            return this.nElements;
        };

        Dictionary.prototype.isEmpty = function () {
            return this.nElements <= 0;
        };

        Dictionary.prototype.toString = function () {
            var toret = "{";
            this.forEach(function (k, v) {
                toret = toret + "\n\t" + k.toString() + " : " + v.toString();
            });
            return toret + "\n}";
        };
        return Dictionary;
    })();
    Collections.Dictionary = Dictionary;
})(Collections || (Collections = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Dimension;
(function (Dimension) {
    var Character = (function (_super) {
        __extends(Character, _super);
        function Character(game) {
            _super.call(this, game);
            this.armor = 0;
            this.attackCount = 0;
            this.frozen = 0;
            this.windfury = false;
            this.divineShield = false;
            this.stealth = false;
        }
        Character.prototype.getAttack = function () {
            return Math.max(0, this.attack + this.sumAurasByStat(1 /* ATTACK */));
        };

        Character.prototype.getHealth = function () {
            return Math.max(0, this.health + this.sumAurasByStat(2 /* HEALTH */));
        };

        Character.prototype.isDamaged = function () {
            return this.getHealth() < this.maxHealth;
        };

        Character.prototype.combatDamage = function (damage, source) {
            if (damage < 0)
                return false;

            if (this.divineShield) {
                this.divineShield = false;
                return false;
            }

            var migitation = Math.min(damage, this.armor);
            this.armor -= migitation;
            damage -= migitation;
            this.health -= damage;

            return (damage > 0);
        };

        Character.prototype.damage = function (damage, source) {
            if (damage < 0)
                return;

            var inflicted = this.combatDamage(damage, source);
            if (!inflicted) {
                return;
            }

            this.onEvent(1 /* DAMAGE */, this, source);
            this.game.postDamage();
        };

        Character.prototype.spellDamage = function (damage, source) {
            damage += source.owner.sumAurasByStat(9 /* SPELL_POWER */);

            if (damage <= 0) {
                return;
            }

            var inflicted = this.combatDamage(damage, source);
            if (!inflicted) {
                return;
            }

            this.onEvent(1 /* DAMAGE */, this, source);
            this.game.postDamage();
        };

        Character.prototype.destroy = function () {
            this.health = -1000;
            this.game.postDamage();
        };

        Character.prototype.heal = function (amount) {
            amount = Math.min(amount, Math.max(this.maxHealth - this.getHealth(), 0));

            if (amount > 0) {
                this.health += amount;
                this.onEvent(7 /* HEAL */, this, null);
            }
        };

        Character.prototype.gain = function (attack, health) {
            if (this.getHealth() <= 0)
                return;

            this.attack += attack;
            this.health += health;
        };

        Character.prototype.freeze = function () {
            this.freezeForTurns(1);
        };

        Character.prototype.freezeForTurns = function (turns) {
            this.frozen = Math.max(turns, this.frozen);
        };

        Character.prototype.isFrozen = function () {
            return this.frozen > 0;
        };

        Character.prototype.unfreeze = function () {
            if (this.frozen > 0)
                this.frozen--;
        };
        return Character;
    })(Dimension.GameObject);
    Dimension.Character = Character;
})(Dimension || (Dimension = {}));
var Dimension;
(function (Dimension) {
    (function (CardType) {
        CardType[CardType["MINION"] = 0] = "MINION";
        CardType[CardType["SPELL"] = 1] = "SPELL";
        CardType[CardType["WEAPON"] = 2] = "WEAPON";
        CardType[CardType["ABILITY"] = 3] = "ABILITY";
    })(Dimension.CardType || (Dimension.CardType = {}));
    var CardType = Dimension.CardType;
})(Dimension || (Dimension = {}));
var Dimension;
(function (Dimension) {
    (function (CardSubType) {
        CardSubType[CardSubType["BEAST"] = 0] = "BEAST";
        CardSubType[CardSubType["DEMON"] = 1] = "DEMON";
        CardSubType[CardSubType["DRAGON"] = 2] = "DRAGON";
        CardSubType[CardSubType["MURLOC"] = 3] = "MURLOC";
        CardSubType[CardSubType["PIRATE"] = 4] = "PIRATE";
        CardSubType[CardSubType["TOTEM"] = 5] = "TOTEM";
        CardSubType[CardSubType["GENERAL"] = 6] = "GENERAL";
    })(Dimension.CardSubType || (Dimension.CardSubType = {}));
    var CardSubType = Dimension.CardSubType;
})(Dimension || (Dimension = {}));
var Dimension;
(function (Dimension) {
    (function (CardRarity) {
        CardRarity[CardRarity["BASIC"] = 0] = "BASIC";
        CardRarity[CardRarity["COMMON"] = 1] = "COMMON";
        CardRarity[CardRarity["RARE"] = 2] = "RARE";
        CardRarity[CardRarity["EPIC"] = 3] = "EPIC";
        CardRarity[CardRarity["LEGENDARY"] = 4] = "LEGENDARY";
    })(Dimension.CardRarity || (Dimension.CardRarity = {}));
    var CardRarity = Dimension.CardRarity;
})(Dimension || (Dimension = {}));
var Dimension;
(function (Dimension) {
    var Card = (function (_super) {
        __extends(Card, _super);
        function Card(type, id, name, cost, hero, description, rarity) {
            _super.call(this);
            this.overload = 0;
            this.durabilityLoss = 1;

            this.id = id;
            if (this.id == 10000)
                this.id = 0;

            this.type = type;
            this.name = name;
            this.cost = cost;
            this.hero = hero.toLowerCase();
            this.description = description;
            this.rarity = rarity;
        }
        Card.createMinion = function (id, name, cost, hero, description, attack, health, rarity, subtype) {
            if (typeof subtype === "undefined") { subtype = 6 /* GENERAL */; }
            var spell = new Card(0 /* MINION */, id, name, cost, hero, description, rarity);
            spell.attack = attack;
            spell.health = health;
            spell.subtype = subtype;
            Card.spells.setValue(name, spell);
            return spell;
        };

        Card.createSpell = function (id, name, cost, hero, description, rarity) {
            var spell = new Card(1 /* SPELL */, id, name, cost, hero, description, rarity);
            Card.spells.setValue(name, spell);
            return spell;
        };

        Card.createWeapon = function (id, name, cost, hero, description, attack, durability, rarity) {
            var spell = new Card(2 /* WEAPON */, id, name, cost, hero, description, rarity);
            spell.attack = attack;
            spell.durability = durability;
            Card.spells.setValue(name, spell);
            return spell;
        };

        Card.createAbility = function (id, name, cost, hero, description) {
            var spell = new Card(3 /* ABILITY */, id, name, cost, hero, description, 1 /* COMMON */);
            Card.spells.setValue(name, spell);
            return spell;
        };

        Card.get = function (name) {
            return Card.spells.getValue(name);
        };
        Card.spells = new Collections.Dictionary();
        return Card;
    })(Dimension.Triggerable);
    Dimension.Card = Card;
})(Dimension || (Dimension = {}));
var Dimension;
(function (Dimension) {
    var Spell = (function () {
        function Spell(card, owner) {
            this.card = card;
            this.owner = owner;
        }
        Spell.prototype.getCost = function () {
            return 0;
        };
        return Spell;
    })();
    Dimension.Spell = Spell;
})(Dimension || (Dimension = {}));
var Dimension;
(function (Dimension) {
    var Minion = (function (_super) {
        __extends(Minion, _super);
        function Minion(name, attack, health, card, owner) {
            _super.call(this, owner.game);
            this.token = false;
            this.sick = true;
            this.charge = false;
            this.taunt = false;
            this.defender = false;
            this.shroud = false;

            this.controller = this.owner = owner;

            this.name = name;
            this.attack = attack;
            this.health = health;
            this.maxHealth = health;

            if (card != null) {
                this.card = card;
                this.token = card.token;
                this.charge = card.charge;
                this.defender = card.defender;
                this.taunt = card.taunt;
                this.divineShield = card.divineShield;
                this.windfury = card.windfury;
                this.stealth = card.stealth;
                this.shroud = card.shroud;

                this.addAuraFromCard(card);
            }
        }
        Minion.prototype.onEvent = function (e, source, other) {
            _super.prototype.onEvent.call(this, e, source, other);

            if (e == 5 /* DEATH */) {
                this.removeAuras();
            }
        };

        Minion.prototype.silence = function () {
            this.taunt = false;
            this.charge = false;
            this.windfury = false;
            this.divineShield = false;
            this.stealth = false;
            this.shroud = false;

            this.removeAuras();
        };

        Minion.prototype.hasCharge = function () {
            if (this.sumAurasByStat(5 /* CHARGE */) > 0)
                return true;
            return this.charge;
        };

        Minion.prototype.hasWindfury = function () {
            if (this.sumAurasByStat(6 /* WINDFURY */) > 0)
                return true;
            return this.windfury;
        };

        Minion.prototype.isAdjacentTo = function (m) {
            var index = this.controller.board.indexOf(this);
            var index2 = this.controller.board.indexOf(m);

            if (index2 == -1)
                return false;
            if (Math.abs(index - index2) == 1)
                return true;

            return false;
        };

        Minion.prototype.forEachNeighbor = function (handler) {
            var index = this.controller.board.indexOf(this);

            var right = index + 1;
            if (right < this.controller.board.length)
                this.game.invoke(handler, this.controller.board[right], null);

            var left = index - 1;
            if (left >= 0)
                this.game.invoke(handler, this.controller.board[left], null);
        };

        Minion.prototype.transform = function (name) {
            var card = Dimension.Card.get(name);
            this.removeAuras();

            this.card = card;
            this.name = name;
            this.attack = card.attack;
            this.health = card.health;
            this.maxHealth = card.health;
            this.charge = card.charge;
            this.defender = card.defender;
            this.taunt = card.taunt;
            this.divineShield = card.divineShield;
            this.windfury = card.windfury;
            this.stealth = card.stealth;
            this.shroud = card.shroud;
        };
        return Minion;
    })(Dimension.Character);
    Dimension.Minion = Minion;
})(Dimension || (Dimension = {}));
var Dimension;
(function (Dimension) {
    (function (Stat) {
        Stat[Stat["NONE"] = 0] = "NONE";
        Stat[Stat["ATTACK"] = 1] = "ATTACK";
        Stat[Stat["HEALTH"] = 2] = "HEALTH";
        Stat[Stat["MANA"] = 3] = "MANA";
        Stat[Stat["TAUNT"] = 4] = "TAUNT";
        Stat[Stat["CHARGE"] = 5] = "CHARGE";
        Stat[Stat["WINDFURY"] = 6] = "WINDFURY";
        Stat[Stat["DIVINE_SHIELD"] = 7] = "DIVINE_SHIELD";
        Stat[Stat["COST"] = 8] = "COST";
        Stat[Stat["SPELL_POWER"] = 9] = "SPELL_POWER";
    })(Dimension.Stat || (Dimension.Stat = {}));
    var Stat = Dimension.Stat;
})(Dimension || (Dimension = {}));
var Dimension;
(function (Dimension) {
    var Weapon = (function (_super) {
        __extends(Weapon, _super);
        function Weapon() {
            _super.apply(this, arguments);
        }
        Weapon.prototype.getAttack = function () {
            return Math.max(0, this.attack + this.sumAurasByStat(1 /* ATTACK */));
        };

        Weapon.prototype.decayAttack = function (amount) {
            this.attack = Math.max(0, this.attack - amount);
        };

        Weapon.prototype.decayDurability = function (amount) {
            if (amount == -1) {
                amount = this.durabilityLoss;
            }
            this.durability -= amount;
            if (this.durability <= 0 && this.owner.weapon == this) {
                this.destroy();
            }
        };

        Weapon.prototype.gainDurability = function (amount) {
            this.durability += amount;
        };

        Weapon.prototype.destroy = function () {
            this.removeAuras();
            this.owner.weapon = null;
        };
        return Weapon;
    })(Dimension.GameObject);
    Dimension.Weapon = Weapon;
})(Dimension || (Dimension = {}));
var Dimension;
(function (Dimension) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game, deck) {
            _super.call(this, game);
            this.library = new Collections.LinkedList();
            this.hand = new Collections.LinkedList();
            this.secrets = new Collections.LinkedList();
            this.board = new Array();
            this.mana = 0;
            this.maxMana = 0;
            this.overload = 0;
            this.weapon = null;

            this.controller = this.owner = this;

            this.health = 30;
            this.maxHealth = 30;
            this.attack = 0;
            this.ability = Dimension.Card.get(deck.hero);

            this.deck = deck;
            for (var i = 0, l = deck.spells.length; i < l; i++) {
                this.library.add(new Dimension.Spell(deck.spells[i], this));
            }
            this.library.shuffle();
        }
        Player.prototype.getAttack = function () {
            return _super.prototype.getAttack.call(this) + (this.weapon != null) ? this.weapon.getAttack() : 0;
        };

        Player.prototype.getMana = function () {
            return Math.max(0, Math.min(this.getMaxMana(), this.mana + this.sumAurasByStat(3 /* MANA */)));
        };

        Player.prototype.getMaxMana = function () {
            return Math.max(0, Math.min(10, this.maxMana + this.sumAurasByStat(3 /* MANA */)));
        };
        return Player;
    })(Dimension.Character);
    Dimension.Player = Player;
})(Dimension || (Dimension = {}));
var Dimension;
(function (Dimension) {
    (function (GameState) {
        GameState[GameState["CAST_SPELL"] = 0] = "CAST_SPELL";
        GameState[GameState["ATTACK"] = 1] = "ATTACK";
        GameState[GameState["TARGET"] = 2] = "TARGET";
        GameState[GameState["SUMMON"] = 3] = "SUMMON";
        GameState[GameState["CHOOSE_ONE"] = 4] = "CHOOSE_ONE";
        GameState[GameState["MULLIGAN"] = 5] = "MULLIGAN";
    })(Dimension.GameState || (Dimension.GameState = {}));
    var GameState = Dimension.GameState;
})(Dimension || (Dimension = {}));
var Dimension;
(function (Dimension) {
    var Game = (function () {
        function Game() {
            this.players = new Array();
            this.currentPlayerIndex = 0;
            this.state = 5 /* MULLIGAN */;
            this.globalAuras = new Collections.LinkedList();
            this.spellCounter = 0;
            this.turnCounter = 0;
            this.minionCounter = 0;
        }
        Game.prototype.currentPlayer = function () {
            return this.players[this.currentPlayerIndex];
        };

        Game.prototype.currentOpponent = function () {
            return this.players[(this.currentPlayerIndex + 1 % this.players.length)];
        };

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

            this.spellCounter = 0;
            this.minionCounter = 0;

            var player = this.currentPlayer();
            if (player.maxMana < 10) {
                player.maxMana++;
            }
            player.mana = player.maxMana - player.overload;
            player.overload = 0;

            player.attackCount = 0;
            _.each(player.board, function (m) {
                m.sick = false;
                m.attackCount = 0;
            });

            player.abilityUsed = false;

            player.drawCard();

            _.each(this.players, function (player) {
                player.onEvent(3 /* START_OF_TURN */, player, null);
                _.each(player.board, function (minion) {
                    minion.onEvent(3 /* START_OF_TURN */, minion, null);
                });
            });
        };

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

            if (attacker instanceof Dimension.Player && attacker.hasWeapon())
                attacker.weapon.decayDurability(1);
        };

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

        Game.prototype.sumAurasByStat = function (stat) {
            var sum = 0;
            var auras = this.aurasByStat(stat);

            for (var ai = 0, ac = auras.count; ai < ac; ai++) {
                sum += auras[ai].amountFor(this);
            }

            return sum;
        };

        Game.prototype.removeExpiredAuras = function () {
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

                if (c.controller == this.currentPlayer()) {
                    c.unfreeze();
                }

                c.onEvent(4 /* END_OF_TURN */, c, null);

                this.globalAuras = _.remove(this.globalAuras, 'expires');

                c.auras = _.remove(c.auras, 'expires');

                if (c instanceof Dimension.Player) {
                    var player = c;
                    if (player.hasWeapon()) {
                        player.weapon.auras = _.remove(player.weapon.auras, 'expires');
                    }
                }
            }
        };

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

        Game.prototype.invoke = function (handler, self, other) {
            if (handler != null) {
                return handler.apply(this, [self, other]);
            }
            return null;
        };

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

        Game.prototype.targetsCountWithFilter = function (filter) {
            return this.validTargetsWithFilter(filter).count;
        };

        Game.prototype.chooseTarget = function (filter, handler) {
            if (this.targetsCountWithFilter(filter) == 0)
                return;

            this.filter = filter;
            this.onTargetHandler = handler;
            this.state = 2 /* TARGET */;
        };

        Game.prototype.chooseOne = function (s1, h1, s2, h2) {
        };

        Game.prototype.hasCombo = function () {
            return this.spellCounter >= 1;
        };

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
var Dimension;
(function (Dimension) {
    var EventObject = (function () {
        function EventObject(e, source, other) {
            this.event = e;
            this.source = source;
            this.other = other;
        }
        EventObject.prototype.toString = function () {
            return this.event + " " + this.source + " " + this.other;
        };
        return EventObject;
    })();

    var GameObject = (function () {
        function GameObject(game) {
            this.eventStack = [];
            this.auras = [];
            this.game = game;
        }
        GameObject.prototype.getController = function () {
            return (this.controller == null) ? this.owner : this.controller;
        };

        GameObject.prototype.runEvent = function (e, source, other) {
            var auras = this.getAuras();
            for (var i = 0, l = auras.length; i < l; i++) {
                this.game.aura = auras[i];
                this.game.invoke(auras[i].getTrigger(e), source, other);
            }
        };

        GameObject.prototype.onEvent = function (e, source, other) {
            this.eventStack.push(new EventObject(e, source, other));

            if (this.eventStack.length > 1)
                return;

            while (this.eventStack.length > 0) {
                var eo = this.eventStack.shift();
                this.handleRunEvent(eo);
            }
        };

        GameObject.prototype.handleRunEvent = function (eo) {
            this.runEvent(eo.event, eo.source, eo.other);

            this.removeObject(eo, this.eventStack);
        };

        GameObject.prototype.addAura = function (stat, amount, expires, global) {
            if (typeof global === "undefined") { global = false; }
            var aura = new Dimension.Aura(this, stat, amount, expires);

            if (global)
                this.game.globalAuras.add(aura);
            else
                this.auras.push(aura);

            return aura;
        };

        GameObject.prototype.addDynamicAura = function (stat, calculation, expires, global) {
            if (typeof global === "undefined") { global = false; }
            var aura = Dimension.Aura.createDynamic(this, stat, calculation, expires);

            if (global)
                this.game.globalAuras.add(aura);
            else
                this.auras.push(aura);

            return aura;
        };

        GameObject.prototype.addAuraFromCard = function (card) {
            var aura = new Dimension.Aura(this, 0 /* NONE */, 0, false);
            card.applyToAura(aura);
            this.auras.push(aura);

            return aura;
        };

        GameObject.prototype.removeAuras = function () {
            this.auras.length = 0;
            var ggAuras = this.game.globalAuras;

            for (var i = 0, l = ggAuras.count; i < l; i++) {
                if (ggAuras[i].owner == this) {
                    this.removeObject(ggAuras[i], this.game.globalAuras);
                }
            }
        };

        GameObject.prototype.getAuras = function () {
            var auras = [];

            auras = auras.concat(this.auras);
            auras = auras.concat(this.getController().secrets);
            auras = auras.concat(this.getController().opponent.secrets);
            auras = auras.concat(this.game.globalAuras);

            return auras;
        };

        GameObject.prototype.aurasByStat = function (stat) {
            var list = [];
            var auras = this.getAuras();

            for (var i = 0, l = auras.length; i < l; i++) {
                if (auras[i].stat == stat) {
                    list.push(auras[i]);
                }
            }

            return list;
        };

        GameObject.prototype.sumAurasByStat = function (stat) {
            var sum = 0;
            return sum;
        };

        GameObject.prototype.removeObject = function (object, from) {
            var index = from.indexOf(object, 0);
            if (index != undefined) {
                from.splice(index, 1);
            }
        };
        return GameObject;
    })();
    Dimension.GameObject = GameObject;
})(Dimension || (Dimension = {}));
var Dimension;
(function (Dimension) {
    var Aura = (function (_super) {
        __extends(Aura, _super);
        function Aura(owner, stat, amount, expires) {
            _super.call(this);
            this.expires = false;
            this.stat = 0 /* NONE */;
            this.amount = 0;
            this.dynamic = false;
            this.owner = owner;
            this.stat = stat;
            this.amount = amount;
            this.expires = expires;
            this.dynamic = false;
        }
        Aura.createDynamic = function (owner, stat, calculation, expires) {
            var aura = new Aura(owner, stat, 0, expires);
            aura.calculation = calculation;
            aura.dynamic = true;
            return aura;
        };

        Aura.createTriggerable = function (owner, onTrigger) {
            var aura = new Aura(owner, null, 0, false);
            aura.onTrigger = onTrigger;
            return aura;
        };

        Aura.prototype.amountFor = function (c) {
            if (!this.dynamic)
                return this.amount;
            else
                return this.owner.game.invoke(this.calculation, c, null);
        };

        Aura.prototype.trigger = function (source) {
            this.owner.game.removeAura(this);
            this.owner.secrets.remove(this);
            this.owner.onEvent(9 /* SECRET_REVEALED */, this, source);
            this.owner.game.invoke(this.onTrigger, this.owner, source);
        };
        return Aura;
    })(Dimension.Triggerable);
    Dimension.Aura = Aura;
})(Dimension || (Dimension = {}));
var Dimension;
(function (Dimension) {
    var Deck = (function () {
        function Deck(deckString) {
            var _this = this;
            this.spells = new Collections.LinkedList();
            var lines = deckString.split("\n");
            this.hero = lines.shift();

            var line;
            for (var i = 0, l = lines.count; i < l; i++) {
                line = lines[i];
                var data = line.split("x ");

                var spell = Dimension.Card.get(data[1].trim());
                if (spell != null) {
                    _.times(~~data[0].trim(), function () {
                        _this.spells.add(spell);
                    });
                }
            }
        }
        return Deck;
    })();
    Dimension.Deck = Deck;
})(Dimension || (Dimension = {}));
//# sourceMappingURL=Dimension.js.map
