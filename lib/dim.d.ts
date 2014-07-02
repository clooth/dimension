/// <reference path="../src/typings/lodash/lodash.d.ts" />
declare module Collections {
    interface ICompareFunction<T> {
        (a: T, b: T): number;
    }
    interface IEqualsFunction<T> {
        (a: T, b: T): boolean;
    }
    interface ILoopFunction<T> {
        (a: T): boolean;
    }
    function defaultCompare<T>(a: T, b: T): number;
    function defaultEquals<T>(a: T, b: T): boolean;
    function defaultToString(item: any): string;
    function makeString<T>(item: T, join?: string): string;
    function isFunction(func: any): boolean;
    function isUndefined(obj: any): boolean;
    function isString(obj: any): boolean;
    function reverseCompareFunction<T>(compareFunction: ICompareFunction<T>): ICompareFunction<T>;
    function compareToEquals<T>(compareFunction: ICompareFunction<T>): IEqualsFunction<T>;
    function deepCopy(src: any, _visited?: any): any;
    module arrays {
        function indexOf<T>(array: T[], item: T, equalsFunction?: IEqualsFunction<T>): number;
        function lastIndexOf<T>(array: T[], item: T, equalsFunction?: IEqualsFunction<T>): number;
        function contains<T>(array: T[], item: T, equalsFunction?: IEqualsFunction<T>): boolean;
        function remove<T>(array: T[], item: T, equalsFunction?: IEqualsFunction<T>): boolean;
        function frequency<T>(array: T[], item: T, equalsFunction?: IEqualsFunction<T>): number;
        function equals<T>(array1: T[], array2: T[], equalsFunction?: IEqualsFunction<T>): boolean;
        function copy<T>(array: T[]): T[];
        function swap<T>(array: T[], i: number, j: number): boolean;
        function toString<T>(array: T[]): string;
        function forEach<T>(array: T[], callback: (item: T) => boolean): void;
    }
    interface ILinkedListNode<T> {
        element: T;
        next: ILinkedListNode<T>;
    }
    class LinkedList<T> {
        public firstNode: ILinkedListNode<T>;
        private lastNode;
        private nElements;
        constructor();
        public add(item: T, index?: number): boolean;
        public first(): T;
        public last(): T;
        public elementAtIndex(index: number): T;
        public copyAtIndex(index: number): T;
        public indexOf(item: T, equalsFunction?: IEqualsFunction<T>): number;
        public contains(item: T, equalsFunction?: IEqualsFunction<T>): boolean;
        public remove(item: T, equalsFunction?: IEqualsFunction<T>): boolean;
        public clear(): void;
        public equals(other: LinkedList<T>, equalsFunction?: IEqualsFunction<T>): boolean;
        private equalsAux(n1, n2, eqF);
        public removeElementAtIndex(index: number): T;
        public forEach(callback: (item: T) => boolean): void;
        public reverse(): void;
        public toArray(): T[];
        public size(): number;
        public isEmpty(): boolean;
        public toString(): string;
        private nodeAtIndex(index);
        private createNode(item);
    }
    class Dictionary<K, V> {
        private table;
        private nElements;
        private toStr;
        constructor(toStrFunction?: (key: K) => string);
        public getValue(key: K): V;
        public copyValue(key: K): V;
        public setValue(key: K, value: V): V;
        public remove(key: K): V;
        public keys(): K[];
        public values(): V[];
        public forEach(callback: (key: K, value: V) => any): void;
        public containsKey(key: K): boolean;
        public clear(): void;
        public size(): number;
        public isEmpty(): boolean;
        public toString(): string;
    }
    class MultiDictionary<K, V> {
        private dict;
        private equalsF;
        private allowDuplicate;
        constructor(toStrFunction?: (key: K) => string, valuesEqualsFunction?: IEqualsFunction<V>, allowDuplicateValues?: boolean);
        public getValue(key: K): V[];
        public setValue(key: K, value: V): boolean;
        public remove(key: K, value?: V): boolean;
        public keys(): K[];
        public values(): V[];
        public containsKey(key: K): boolean;
        public clear(): void;
        public size(): number;
        public isEmpty(): boolean;
    }
    class Heap<T> {
        private data;
        private compare;
        constructor(compareFunction?: ICompareFunction<T>);
        private leftChildIndex(nodeIndex);
        private rightChildIndex(nodeIndex);
        private parentIndex(nodeIndex);
        private minIndex(leftChild, rightChild);
        private siftUp(index);
        private siftDown(nodeIndex);
        public peek(): T;
        public add(element: T): boolean;
        public removeRoot(): T;
        public contains(element: T): boolean;
        public size(): number;
        public isEmpty(): boolean;
        public clear(): void;
        public forEach(callback: (item: T) => boolean): void;
    }
    class Stack<T> {
        private list;
        constructor();
        public push(elem: T): boolean;
        public add(elem: T): boolean;
        public pop(): T;
        public peek(): T;
        public size(): number;
        public contains(elem: T, equalsFunction?: IEqualsFunction<T>): boolean;
        public isEmpty(): boolean;
        public clear(): void;
        public forEach(callback: ILoopFunction<T>): void;
    }
    class Queue<T> {
        private list;
        constructor();
        public enqueue(elem: T): boolean;
        public add(elem: T): boolean;
        public dequeue(): T;
        public peek(): T;
        public size(): number;
        public contains(elem: T, equalsFunction?: IEqualsFunction<T>): boolean;
        public isEmpty(): boolean;
        public clear(): void;
        public forEach(callback: ILoopFunction<T>): void;
    }
    class PriorityQueue<T> {
        private heap;
        constructor(compareFunction?: ICompareFunction<T>);
        public enqueue(element: T): boolean;
        public add(element: T): boolean;
        public dequeue(): T;
        public peek(): T;
        public contains(element: T): boolean;
        public isEmpty(): boolean;
        public size(): number;
        public clear(): void;
        public forEach(callback: ILoopFunction<T>): void;
    }
    class Set<T> {
        private dictionary;
        constructor(toStringFunction?: (item: T) => string);
        public contains(element: T): boolean;
        public add(element: T): boolean;
        public intersection(otherSet: Set<T>): void;
        public union(otherSet: Set<T>): void;
        public difference(otherSet: Set<T>): void;
        public isSubsetOf(otherSet: Set<T>): boolean;
        public remove(element: T): boolean;
        public forEach(callback: ILoopFunction<T>): void;
        public toArray(): T[];
        public isEmpty(): boolean;
        public size(): number;
        public clear(): void;
        public toString(): string;
    }
    class Bag<T> {
        private toStrF;
        private dictionary;
        private nElements;
        constructor(toStrFunction?: (item: T) => string);
        public add(element: T, nCopies?: number): boolean;
        public count(element: T): number;
        public contains(element: T): boolean;
        public remove(element: T, nCopies?: number): boolean;
        public toArray(): T[];
        public toSet(): Set<T>;
        public forEach(callback: ILoopFunction<T>): void;
        public size(): number;
        public isEmpty(): boolean;
        public clear(): void;
    }
    class BSTree<T> {
        private root;
        private compare;
        private nElements;
        constructor(compareFunction?: ICompareFunction<T>);
        public add(element: T): boolean;
        public clear(): void;
        public isEmpty(): boolean;
        public size(): number;
        public contains(element: T): boolean;
        public remove(element: T): boolean;
        public inorderTraversal(callback: ILoopFunction<T>): void;
        public preorderTraversal(callback: ILoopFunction<T>): void;
        public postorderTraversal(callback: ILoopFunction<T>): void;
        public levelTraversal(callback: ILoopFunction<T>): void;
        public minimum(): T;
        public maximum(): T;
        public forEach(callback: ILoopFunction<T>): void;
        public toArray(): T[];
        public height(): number;
        private searchNode(node, element);
        private transplant(n1, n2);
        private removeNode(node);
        private inorderTraversalAux(node, callback, signal);
        private levelTraversalAux(node, callback);
        private preorderTraversalAux(node, callback, signal);
        private postorderTraversalAux(node, callback, signal);
        private minimumAux(node);
        private maximumAux(node);
        private heightAux(node);
        private insertNode(node);
        private createNode(element);
    }
}
declare module Dimension {
    class Triggerable {
        public onCast: Function;
        public onDamage: Function;
        public onDamageDealt: Function;
        public onDeath: Function;
        public onStartOfTurn: Function;
        public onEndOfTurn: Function;
        public onHeal: Function;
        public onDraw: Function;
        public onAttack: Function;
        public onSecretRevealed: Function;
        public onSummon: Function;
        constructor();
        public getTrigger(e: MatchEvent): Function;
        public applyToAura(a: Aura): void;
    }
}
declare module Dimension {
    class Aura extends Triggerable {
        public owner: MatchObject;
        public expires: boolean;
        public stat: Stat;
        public amount: number;
        public dynamic: boolean;
        public calculation: Function;
        public onTrigger: Function;
        constructor(owner: MatchObject, stat: Stat, amount: number, expires: boolean);
        static createDynamic(owner: MatchObject, stat: Stat, calculation: Function, expires: boolean): Aura;
        static createTriggerable(owner: MatchObject, onTrigger: Function): Aura;
        public amountFor(c: any): number;
        public trigger(source: any): void;
    }
}
declare module Dimension {
    class MatchObject {
        public owner: Player;
        public controller: Player;
        public match: Match;
        private eventStack;
        constructor(match: Match);
        public getController(): Player;
        public runEvent(e: MatchEvent, source: any, other: any): void;
        public onEvent(e: MatchEvent, source: any, other: any): void;
        private handleRunEvent(eo);
        public auras: Collections.LinkedList<Aura>;
        public addAura(stat: Stat, amount: number, expires: boolean, global?: boolean): Aura;
        public addDynamicAura(stat: Stat, calculation: Function, expires: boolean, global?: boolean): Aura;
        public addAuraFromCard(card: Card): Aura;
        public removeAuras(): void;
        public getAuras(): Aura[];
        public aurasByStat(stat: Stat): Aura[];
        public sumAurasByStat(stat: Stat): number;
        private removeObject(object, from);
    }
}
declare module Dimension {
    class Character extends MatchObject {
        public name: string;
        public attack: number;
        public health: number;
        public maxHealth: number;
        public armor: number;
        public attackCount: number;
        public frozen: number;
        public windfury: boolean;
        public divineShield: boolean;
        public stealth: boolean;
        constructor(match: any);
        public getAttack(): number;
        public getHealth(): number;
        public isDamaged(): boolean;
        public combatDamage(damage: number, source: Character): boolean;
        public damage(damage: number, source: Character, isSpellDamage?: boolean): void;
        public destroy(): void;
        public heal(amount: number): void;
        public gain(attack: number, health: number): void;
        public freeze(): void;
        public freezeForTurns(turns: number): void;
        public isFrozen(): boolean;
        public unfreeze(): void;
    }
}
declare module Dimension {
    class Minion extends Character {
        public card: Card;
        public token: boolean;
        public sick: boolean;
        public charge: boolean;
        public taunt: boolean;
        public defender: boolean;
        public shroud: boolean;
        constructor(name: string, attack: number, health: number, card: Card, owner: Player);
        public onEvent(e: MatchEvent, source: any, other: any): void;
        public silence(): void;
        public unsummon(): void;
        public hasCharge(): boolean;
        public hasWindfury(): boolean;
        public isAdjacentTo(m: Minion): boolean;
        public forEachNeighbor(handler: Function): void;
        public transform(name: string): void;
    }
}
declare module Dimension {
    class Player extends Character {
        public deck: Deck;
        public library: Collections.LinkedList<Spell>;
        public hand: Collections.LinkedList<Spell>;
        public secrets: Collections.LinkedList<Aura>;
        public board: Minion[];
        public mana: number;
        public maxMana: number;
        public overload: number;
        public weapon: Weapon;
        public ability: Card;
        public abilityUsed: boolean;
        public opponent: Player;
        constructor(match: Match, deck: Deck);
        public toString(): string;
        public getAttack(): number;
        public getMana(): number;
        public getMaxMana(): number;
        public gainMana(amount: number): void;
        public gainManaCrystals(amount: number): void;
        public destroyManaCrystals(amount: number): void;
        public hasCardsLeft(): boolean;
        public handleOutOfCards(): void;
        public isHandFull(): boolean;
        public handleFullHand(): void;
        public isBoardFull(): boolean;
        public drawCard(): void;
        public drawCardNamed(name: string): void;
        public castSpell(spell: Spell): void;
        public castSpellBeforeMinion(spell: Spell, before: Minion): void;
        private handleCastMinion(spell, before);
        private handleCastWeapon(spell, before);
        private handleCastSpell(spell, before);
        public summonMinionNamed(name: string): void;
        public equipWeaponNamed(name: string): void;
        public hasTaunt(): boolean;
        public hasWeapon(): boolean;
        public discardRandomCount(count: number): void;
        public discardSpell(spell: Spell): void;
        public useAbility(): void;
        public addSecretAura(trigger: Function): Aura;
    }
}
declare module Dimension {
    enum CardRarity {
        BASIC = 0,
        COMMON = 1,
        RARE = 2,
        EPIC = 3,
        LEGENDARY = 4,
    }
    enum CardType {
        MINION = 0,
        SPELL = 1,
        WEAPON = 2,
        ABILITY = 3,
    }
    enum CardSubType {
        GENERAL = 0,
        BEAST = 1,
        DEMON = 2,
        DRAGON = 3,
        MURLOC = 4,
        PIRATE = 5,
        TOTEM = 6,
    }
    class Card extends Triggerable {
        public id: number;
        public type: CardType;
        public token: boolean;
        public name: string;
        public hero: string;
        public text: string;
        public subtype: CardSubType;
        public rarity: CardRarity;
        public cost: number;
        public overload: number;
        public attack: number;
        public health: number;
        public durability: number;
        public durabilityLoss: number;
        public charge: boolean;
        public taunt: boolean;
        public defender: boolean;
        public windfury: boolean;
        public divineShield: boolean;
        public stealth: boolean;
        public shroud: boolean;
        public costModifier: Function;
        static _cards: Collections.Dictionary<string, Card>;
        constructor();
        static create(configure: (card: Card) => void): Card;
        static get(name: string): Card;
    }
}
declare module Dimension {
    class Deck {
        public hero: string;
        public spells: Collections.LinkedList<Card>;
        static fromString(deckString: string): Deck;
        static fromDOM(domId: string): Deck;
    }
}
declare module Dimension {
    enum MatchState {
        CAST_SPELL = 0,
        ATTACK = 1,
        TARGET = 2,
        SUMMON = 3,
        CHOOSE_ONE = 4,
        MULLIGAN = 5,
    }
    enum MatchEvent {
        ATTACK = 0,
        DAMAGE = 1,
        DAMAGE_DEALT = 2,
        START_OF_TURN = 3,
        END_OF_TURN = 4,
        DEATH = 5,
        CAST = 6,
        HEAL = 7,
        DRAW = 8,
        SECRET_REVEALED = 9,
        SUMMON = 10,
    }
    enum TargetFilter {
        HERO = 0,
        MINION = 1,
        ENEMY_HERO = 2,
        ENEMY_MINION = 3,
        FRIENDLY_HERO = 4,
        FRIENDLY_MINION = 5,
        ENEMY = 6,
        FRIENDLY = 7,
        CHARACTER = 8,
        DAMAGED = 9,
    }
    interface ITargetFilter {
        (match: Match): boolean;
    }
    class Match {
        static MAXIMUM_BOARD_SIZE: number;
        static MAXIMUM_HAND_SIZE: number;
        public players: Player[];
        public currentPlayerIndex: number;
        public state: MatchState;
        public globalAuras: Collections.LinkedList<Aura>;
        public aura: Aura;
        public spellCounter: number;
        public turnCounter: number;
        public minionCounter: number;
        private targetFilters;
        constructor();
        public filter(self: any, filt: TargetFilter): boolean;
        public currentPlayer(): Player;
        public currentOpponent(): Player;
        public init(): void;
        public start(): void;
        public endTurn(): void;
        public combat(attacker: Character, defender: Character): void;
        public postDamage(): void;
        public aurasByStat(stat: Stat): Collections.LinkedList<Aura>;
        public sumAurasByStat(stat: Stat): number;
        public removeExpiredAuras(): void;
        public removeAura(aura: Aura): void;
        public invoke(handler: Function, self: any, other: any): any;
        public activeFilter: TargetFilter;
        public onTargetHandler: Function;
        public validTargetsWithFilter(filter: TargetFilter): Collections.LinkedList<Character>;
        public targetsCountWithFilter(filter: TargetFilter): number;
        public chooseTarget(filter: TargetFilter, handler: Function): void;
        public chooseOne(s1: string, h1: Function, s2: string, h2: Function): void;
        public hasCombo(): boolean;
        public forEachTargetWithFilter(filter: TargetFilter, handler: Function): void;
        public forNumberOfRandomTargetsWithFilter(count: number, filter: TargetFilter, handler: Function): void;
        public forEachTargetWithFilterExceptRandom(count: number, filter: TargetFilter, handler: Function): void;
        public forEachTarget(targets: Character[], handler: Function): void;
        private assignDamageForEach(list, damage, source);
        public damageForEachWithFilter(filter: TargetFilter, damage: number, source: Character): void;
        public spellDamageForEachWithFilter(filter: TargetFilter, damage: number, source: Character): void;
        public damageForNumberOfRandom(count: number, filter: TargetFilter, damage: number, source: Character): void;
        public spellDamageForNumberOfRandom(count: number, filter: TargetFilter, damage: number, source: Character): void;
        public matchLog: string[];
        public log(...parts: any[]): void;
    }
}
declare module Dimension {
    class Spell {
        public card: Card;
        public owner: Player;
        constructor(card: Card, owner: Player);
        public getCost(): number;
    }
}
declare module Dimension {
    enum Stat {
        NONE = 0,
        ATTACK = 1,
        HEALTH = 2,
        MANA = 3,
        TAUNT = 4,
        CHARGE = 5,
        WINDFURY = 6,
        DIVINE_SHIELD = 7,
        COST = 8,
        SPELL_POWER = 9,
    }
}
declare module Dimension {
    class Weapon extends MatchObject {
        public card: Card;
        public attack: number;
        public durability: number;
        public durabilityLoss: number;
        constructor(name: string, attack: number, durability: number, card: Card, owner: Player);
        public getAttack(): number;
        public decayAttack(amount: number): void;
        public decayDurability(amount: number): void;
        public gainDurability(amount: number): void;
        public destroy(): void;
    }
}
declare module Dimension {
}
