module Collections {

  /**
   * Function signature for comparing
   * <0 means a is smaller
   * = 0 means they are equal
   * >0 means a is larger
   */
  export interface ICompareFunction<T>{
    (a: T, b: T): number;
  }

  /**
   * Function signature for checking equality
   */
  export interface IEqualsFunction<T>{
    (a: T, b: T): boolean;
  }

  /**
   * Function signature for Iterations. Return false to break from loop
   */
  export interface ILoopFunction<T>{
    (a: T): boolean;
  }

  /**
   * Default function to compare element order.
   * @function
   */
  export function defaultCompare<T>(a: T, b: T): number {
    if (a < b) {
      return -1;
    } else if (a === b) {
      return 0;
    } else {
      return 1;
    }
  }

  /**
   * Default function to test equality.
   * @function
   */
  export function defaultEquals<T>(a: T, b: T): boolean {
    return a === b;
  }

  /**
   * Default function to convert an object to a string.
   * @function
   */
  export function defaultToString(item: any): string {
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

  /**
   * Joins all the properies of the object using the provided join string
   */
  export function makeString<T>(item: T, join: string = ","): string {
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

  /**
   * Checks if the given argument is a function.
   * @function
   */
  export function isFunction(func: any): boolean {
    return (typeof func) === 'function';
  }

  /**
   * Checks if the given argument is undefined.
   * @function
   */
  export function isUndefined(obj: any): boolean {
    return (typeof obj) === 'undefined';
  }

  /**
   * Checks if the given argument is a string.
   * @function
   */
  export function isString(obj: any): boolean {
    return Object.prototype.toString.call(obj) === '[object String]';
  }

  /**
   * Reverses a compare function.
   * @function
   */
  export function reverseCompareFunction<T>(compareFunction: ICompareFunction<T>): ICompareFunction<T> {
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
      return function (d: T, v: T) {
        return compareFunction(d, v) * -1;
      };
    }
  }

  /**
   * Returns an equal function given a compare function.
   * @function
   */
  export function compareToEquals<T>(compareFunction: ICompareFunction<T>): IEqualsFunction<T> {
    return function (a: T, b: T) {
      return compareFunction(a, b) === 0;
    };
  }

  export interface ICollection <T> {
    count: number;

    add(item: T);
    clear();
    contains(item: T) : boolean;
    remove(item: T): boolean;
  }

  export class LinkedListNode<T> {
    constructor(value: T) {
      this.value = value;
      this.next = null;
      this.previous = null;
    }

    value: T;
    next: LinkedListNode<T>;
    previous: LinkedListNode<T>;
  }

  export class LinkedList<T> implements ICollection<T> {
    private firstNode: LinkedListNode<T>;
    private lastNode: LinkedListNode<T>;

    count: number;

    constructor() {
      this.firstNode = null;
      this.lastNode = null;
      this.count = 0;
    }

    add(item: T) {
      var newNode = new LinkedListNode<T>(item);

      if (this.firstNode == null) {
        this.firstNode = newNode;
        this.lastNode = newNode;
      }
      else {
        this.lastNode.next = newNode;
        newNode.previous = this.lastNode;
        this.lastNode = newNode;
      }

      this.count++;
    }

    clear() {
      this.firstNode = null;
      this.lastNode = null;
      this.count = 0;
    }

    contains(item: T): boolean {
      return this.getNode(this.firstNode, item) != null
    }

    remove(item: T): boolean {
      var nodeToRemove = this.getNode(this.firstNode, item);

      if (nodeToRemove == null) {
        return false;
      }

      if (nodeToRemove.previous != null) {
        nodeToRemove.previous.next = nodeToRemove.next;
      }

      if (nodeToRemove.next != null) {
        nodeToRemove.next.previous = nodeToRemove.previous;
      }
      else {
        this.lastNode = nodeToRemove.previous;
      }

      if (nodeToRemove.previous == null && nodeToRemove.next == null) {
        this.firstNode = null;
      }

      this.count--;

      return true;
    }

    private getNode(node: LinkedListNode<T>, findValue: T): LinkedListNode<T> {
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
    }


  }


  /**
   * Dictionaries
   */
  interface IDictionaryPair<K, V>{
    key: K;
    value: V;
  }

  export class Dictionary<K, V>{

    /**
     * Object holding the key-value pairs.
     * @type {Object}
     * @private
     */
    private table: { [key: string]: IDictionaryPair<K, V> };
    //: [key: K] will not work since indices can only by strings in javascript and typescript enforces this.

    /**
     * Number of elements in the list.
     * @type {number}
     * @private
     */
    private nElements: number;

    /**
     * Function used to convert keys to strings.
     * @type {function(Object):string}
     * @private
     */
    private toStr: (key: K) => string;


    /**
     * Creates an empty dictionary.
     * @class <p>Dictionaries map keys to values; each key can map to at most one value.
     * This implementation accepts any kind of objects as keys.</p>
     *
     * <p>If the keys are custom objects a function which converts keys to unique
     * strings must be provided. Example:</p>
     * <pre>
     * function petToString(pet) {
         *  return pet.name;
         * }
     * </pre>
     * @constructor
     * @param {function(Object):string=} toStrFunction optional function used
     * to convert keys to strings. If the keys aren't strings or if toString()
     * is not appropriate, a custom function which receives a key and returns a
     * unique string must be provided.
     */
    constructor(toStrFunction?: (key: K) => string) {
      this.table = {};
      this.nElements = 0;
      this.toStr = toStrFunction || Collections.defaultToString;
    }


    /**
     * Returns the value to which this dictionary maps the specified key.
     * Returns undefined if this dictionary contains no mapping for this key.
     * @param {Object} key key whose associated value is to be returned.
     * @return {*} the value to which this dictionary maps the specified key or
     * undefined if the map contains no mapping for this key.
     */
    getValue(key: K): V {
      var pair: IDictionaryPair<K, V> = this.table[this.toStr(key)];
      if (Collections.isUndefined(pair)) {
        return undefined;
      }
      return pair.value;
    }


    /**
     * Associates the specified value with the specified key in this dictionary.
     * If the dictionary previously contained a mapping for this key, the old
     * value is replaced by the specified value.
     * @param {Object} key key with which the specified value is to be
     * associated.
     * @param {Object} value value to be associated with the specified key.
     * @return {*} previous value associated with the specified key, or undefined if
     * there was no mapping for the key or if the key/value are undefined.
     */
    setValue(key: K, value: V): V {

      if (Collections.isUndefined(key) || Collections.isUndefined(value)) {
        return undefined;
      }

      var ret: V;
      var k = this.toStr(key);
      var previousElement: IDictionaryPair<K, V> = this.table[k];
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
    }

    /**
     * Removes the mapping for this key from this dictionary if it is present.
     * @param {Object} key key whose mapping is to be removed from the
     * dictionary.
     * @return {*} previous value associated with specified key, or undefined if
     * there was no mapping for key.
     */
    remove(key: K): V {
      var k = this.toStr(key);
      var previousElement: IDictionaryPair<K, V> = this.table[k];
      if (!Collections.isUndefined(previousElement)) {
        delete this.table[k];
        this.nElements--;
        return previousElement.value;
      }
      return undefined;
    }

    /**
     * Returns an array containing all of the keys in this dictionary.
     * @return {Array} an array containing all of the keys in this dictionary.
     */
    keys(): K[] {
      var array: K[] = [];
      for (var name in this.table) {
        if (this.table.hasOwnProperty(name)) {
          var pair: IDictionaryPair<K, V> = this.table[name];
          array.push(pair.key);
        }
      }
      return array;
    }

    /**
     * Returns an array containing all of the values in this dictionary.
     * @return {Array} an array containing all of the values in this dictionary.
     */
    values(): V[] {
      var array: V[] = [];
      for (var name in this.table) {
        if (this.table.hasOwnProperty(name)) {
          var pair: IDictionaryPair<K, V> = this.table[name];
          array.push(pair.value);
        }
      }
      return array;
    }

    /**
     * Executes the provided function once for each key-value pair
     * present in this dictionary.
     * @param {function(Object,Object):*} callback function to execute, it is
     * invoked with two arguments: key and value. To break the iteration you can
     * optionally return false.
     */
    forEach(callback: (key: K, value: V) => any): void {
      for (var name in this.table) {
        if (this.table.hasOwnProperty(name)) {
          var pair: IDictionaryPair<K, V> = this.table[name];
          var ret = callback(pair.key, pair.value);
          if (ret === false) {
            return;
          }
        }
      }
    }

    /**
     * Returns true if this dictionary contains a mapping for the specified key.
     * @param {Object} key key whose presence in this dictionary is to be
     * tested.
     * @return {boolean} true if this dictionary contains a mapping for the
     * specified key.
     */
    containsKey(key: K): boolean {
      return !Collections.isUndefined(this.getValue(key));
    }

    /**
     * Removes all mappings from this dictionary.
     * @this {collections.Dictionary}
     */
    clear() {

      this.table = {};
      this.nElements = 0;
    }

    /**
     * Returns the number of keys in this dictionary.
     * @return {number} the number of key-value mappings in this dictionary.
     */
    size(): number {
      return this.nElements;
    }

    /**
     * Returns true if this dictionary contains no mappings.
     * @return {boolean} true if this dictionary contains no mappings.
     */
    isEmpty(): boolean {
      return this.nElements <= 0;
    }

    toString(): string {
      var toret = "{";
      this.forEach((k, v) => {
        toret = toret + "\n\t" + k.toString() + " : " + v.toString();
      });
      return toret + "\n}";
    }
  } // End of dictionary

}