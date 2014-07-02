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

    function deepCopy(src, _visited) {
        if (src == null || typeof (src) !== 'object') {
            return src;
        }

        if (_visited == undefined) {
            _visited = [];
        } else {
            var i, len = _visited.length;
            for (i = 0; i < len; i++) {
                if (src === _visited[i]) {
                    return src;
                }
            }
        }

        _visited.push(src);

        if (typeof src.clone == 'function') {
            return src.clone(true);
        }

        if (Object.prototype.toString.call(src) == '[object Array]') {
            ret = src.slice();
            var i = ret.length;
            while (i--) {
                ret[i] = deepCopy(ret[i], _visited);
            }
            return ret;
        }

        if (src instanceof Date) {
            return new Date(src.getTime());
        }

        if (src instanceof RegExp) {
            return new RegExp(src);
        }

        if (src.nodeType && typeof src.cloneNode == 'function') {
            return src.cloneNode(true);
        }

        var proto = (Object.getPrototypeOf ? Object.getPrototypeOf(src) : src.__proto__);
        if (!proto) {
            proto = src.constructor.prototype;
        }
        var ret = object_create(proto);

        for (var key in src) {
            ret[key] = Collections.deepCopy(src[key], _visited);
        }
        return ret;
    }
    Collections.deepCopy = deepCopy;

    var object_create = Object.create;
    if (typeof object_create !== 'function') {
        object_create = function (o) {
            function F() {
            }
            F.prototype = o;
            return new F();
        };
    }

    (function (arrays) {
        function indexOf(array, item, equalsFunction) {
            var equals = equalsFunction || Collections.defaultEquals;
            var length = array.length;
            for (var i = 0; i < length; i++) {
                if (equals(array[i], item)) {
                    return i;
                }
            }
            return -1;
        }
        arrays.indexOf = indexOf;

        function lastIndexOf(array, item, equalsFunction) {
            var equals = equalsFunction || Collections.defaultEquals;
            var length = array.length;
            for (var i = length - 1; i >= 0; i--) {
                if (equals(array[i], item)) {
                    return i;
                }
            }
            return -1;
        }
        arrays.lastIndexOf = lastIndexOf;

        function contains(array, item, equalsFunction) {
            return arrays.indexOf(array, item, equalsFunction) >= 0;
        }
        arrays.contains = contains;

        function remove(array, item, equalsFunction) {
            var index = arrays.indexOf(array, item, equalsFunction);
            if (index < 0) {
                return false;
            }
            array.splice(index, 1);
            return true;
        }
        arrays.remove = remove;

        function frequency(array, item, equalsFunction) {
            var equals = equalsFunction || Collections.defaultEquals;
            var length = array.length;
            var freq = 0;
            for (var i = 0; i < length; i++) {
                if (equals(array[i], item)) {
                    freq++;
                }
            }
            return freq;
        }
        arrays.frequency = frequency;

        function equals(array1, array2, equalsFunction) {
            var equals = equalsFunction || Collections.defaultEquals;

            if (array1.length !== array2.length) {
                return false;
            }
            var length = array1.length;
            for (var i = 0; i < length; i++) {
                if (!equals(array1[i], array2[i])) {
                    return false;
                }
            }
            return true;
        }
        arrays.equals = equals;

        function copy(array) {
            return array.concat();
        }
        arrays.copy = copy;

        function swap(array, i, j) {
            if (i < 0 || i >= array.length || j < 0 || j >= array.length) {
                return false;
            }
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
            return true;
        }
        arrays.swap = swap;

        function toString(array) {
            return '[' + array.toString() + ']';
        }
        arrays.toString = toString;

        function forEach(array, callback) {
            var lenght = array.length;
            for (var i = 0; i < lenght; i++) {
                if (callback(array[i]) === false) {
                    return;
                }
            }
        }
        arrays.forEach = forEach;
    })(Collections.arrays || (Collections.arrays = {}));
    var arrays = Collections.arrays;

    

    var LinkedList = (function () {
        function LinkedList() {
            this.firstNode = null;
            this.lastNode = null;
            this.nElements = 0;
        }
        LinkedList.prototype.add = function (item, index) {
            if (Collections.isUndefined(index)) {
                index = this.nElements;
            }
            if (index < 0 || index > this.nElements || Collections.isUndefined(item)) {
                return false;
            }
            var newNode = this.createNode(item);
            if (this.nElements === 0) {
                this.firstNode = newNode;
                this.lastNode = newNode;
            } else if (index === this.nElements) {
                this.lastNode.next = newNode;
                this.lastNode = newNode;
            } else if (index === 0) {
                newNode.next = this.firstNode;
                this.firstNode = newNode;
            } else {
                var prev = this.nodeAtIndex(index - 1);
                newNode.next = prev.next;
                prev.next = newNode;
            }
            this.nElements++;
            return true;
        };

        LinkedList.prototype.first = function () {
            if (this.firstNode !== null) {
                return this.firstNode.element;
            }
            return undefined;
        };

        LinkedList.prototype.last = function () {
            if (this.lastNode !== null) {
                return this.lastNode.element;
            }
            return undefined;
        };

        LinkedList.prototype.elementAtIndex = function (index) {
            var node = this.nodeAtIndex(index);
            if (node === null) {
                return undefined;
            }
            return node.element;
        };

        LinkedList.prototype.copyAtIndex = function (index) {
            var value = this.elementAtIndex(index);
            return Collections.deepCopy(value);
        };

        LinkedList.prototype.indexOf = function (item, equalsFunction) {
            var equalsF = equalsFunction || Collections.defaultEquals;
            if (Collections.isUndefined(item)) {
                return -1;
            }
            var currentNode = this.firstNode;
            var index = 0;
            while (currentNode !== null) {
                if (equalsF(currentNode.element, item)) {
                    return index;
                }
                index++;
                currentNode = currentNode.next;
            }
            return -1;
        };

        LinkedList.prototype.contains = function (item, equalsFunction) {
            return (this.indexOf(item, equalsFunction) >= 0);
        };

        LinkedList.prototype.remove = function (item, equalsFunction) {
            var equalsF = equalsFunction || Collections.defaultEquals;
            if (this.nElements < 1 || Collections.isUndefined(item)) {
                return false;
            }
            var previous = null;
            var currentNode = this.firstNode;

            while (currentNode !== null) {
                if (equalsF(currentNode.element, item)) {
                    if (currentNode === this.firstNode) {
                        this.firstNode = this.firstNode.next;
                        if (currentNode === this.lastNode) {
                            this.lastNode = null;
                        }
                    } else if (currentNode === this.lastNode) {
                        this.lastNode = previous;
                        previous.next = currentNode.next;
                        currentNode.next = null;
                    } else {
                        previous.next = currentNode.next;
                        currentNode.next = null;
                    }
                    this.nElements--;
                    return true;
                }
                previous = currentNode;
                currentNode = currentNode.next;
            }
            return false;
        };

        LinkedList.prototype.clear = function () {
            this.firstNode = null;
            this.lastNode = null;
            this.nElements = 0;
        };

        LinkedList.prototype.equals = function (other, equalsFunction) {
            var eqF = equalsFunction || Collections.defaultEquals;
            if (!(other instanceof Collections.LinkedList)) {
                return false;
            }
            if (this.size() !== other.size()) {
                return false;
            }
            return this.equalsAux(this.firstNode, other.firstNode, eqF);
        };

        LinkedList.prototype.equalsAux = function (n1, n2, eqF) {
            while (n1 !== null) {
                if (!eqF(n1.element, n2.element)) {
                    return false;
                }
                n1 = n1.next;
                n2 = n2.next;
            }
            return true;
        };

        LinkedList.prototype.removeElementAtIndex = function (index) {
            if (index < 0 || index >= this.nElements) {
                return undefined;
            }
            var element;
            if (this.nElements === 1) {
                element = this.firstNode.element;
                this.firstNode = null;
                this.lastNode = null;
            } else {
                var previous = this.nodeAtIndex(index - 1);
                if (previous === null) {
                    element = this.firstNode.element;
                    this.firstNode = this.firstNode.next;
                } else if (previous.next === this.lastNode) {
                    element = this.lastNode.element;
                    this.lastNode = previous;
                }
                if (previous !== null) {
                    element = previous.next.element;
                    previous.next = previous.next.next;
                }
            }
            this.nElements--;
            return element;
        };

        LinkedList.prototype.forEach = function (callback) {
            var currentNode = this.firstNode;
            while (currentNode !== null) {
                if (callback(currentNode.element) === false) {
                    break;
                }
                currentNode = currentNode.next;
            }
        };

        LinkedList.prototype.reverse = function () {
            var previous = null;
            var current = this.firstNode;
            var temp = null;
            while (current !== null) {
                temp = current.next;
                current.next = previous;
                previous = current;
                current = temp;
            }
            temp = this.firstNode;
            this.firstNode = this.lastNode;
            this.lastNode = temp;
        };

        LinkedList.prototype.toArray = function () {
            var array = [];
            var currentNode = this.firstNode;
            while (currentNode !== null) {
                array.push(currentNode.element);
                currentNode = currentNode.next;
            }
            return array;
        };

        LinkedList.prototype.size = function () {
            return this.nElements;
        };

        LinkedList.prototype.isEmpty = function () {
            return this.nElements <= 0;
        };

        LinkedList.prototype.toString = function () {
            return Collections.arrays.toString(this.toArray());
        };

        LinkedList.prototype.nodeAtIndex = function (index) {
            if (index < 0 || index >= this.nElements) {
                return null;
            }
            if (index === (this.nElements - 1)) {
                return this.lastNode;
            }
            var node = this.firstNode;
            for (var i = 0; i < index; i++) {
                node = node.next;
            }
            return node;
        };

        LinkedList.prototype.createNode = function (item) {
            return {
                element: item,
                next: null
            };
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

        Dictionary.prototype.copyValue = function (key) {
            var value = this.getValue(key);
            return Collections.deepCopy(value);
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

    var MultiDictionary = (function () {
        function MultiDictionary(toStrFunction, valuesEqualsFunction, allowDuplicateValues) {
            if (typeof allowDuplicateValues === "undefined") { allowDuplicateValues = false; }
            this.dict = new Dictionary(toStrFunction);
            this.equalsF = valuesEqualsFunction || Collections.defaultEquals;
            this.allowDuplicate = allowDuplicateValues;
        }
        MultiDictionary.prototype.getValue = function (key) {
            var values = this.dict.getValue(key);
            if (Collections.isUndefined(values)) {
                return [];
            }
            return Collections.arrays.copy(values);
        };

        MultiDictionary.prototype.setValue = function (key, value) {
            if (Collections.isUndefined(key) || Collections.isUndefined(value)) {
                return false;
            }
            if (!this.containsKey(key)) {
                this.dict.setValue(key, [value]);
                return true;
            }
            var array = this.dict.getValue(key);
            if (!this.allowDuplicate) {
                if (Collections.arrays.contains(array, value, this.equalsF)) {
                    return false;
                }
            }
            array.push(value);
            return true;
        };

        MultiDictionary.prototype.remove = function (key, value) {
            if (Collections.isUndefined(value)) {
                var v = this.dict.remove(key);
                return !Collections.isUndefined(v);
            }
            var array = this.dict.getValue(key);
            if (Collections.arrays.remove(array, value, this.equalsF)) {
                if (array.length === 0) {
                    this.dict.remove(key);
                }
                return true;
            }
            return false;
        };

        MultiDictionary.prototype.keys = function () {
            return this.dict.keys();
        };

        MultiDictionary.prototype.values = function () {
            var values = this.dict.values();
            var array = [];
            for (var i = 0; i < values.length; i++) {
                var v = values[i];
                for (var j = 0; j < v.length; j++) {
                    array.push(v[j]);
                }
            }
            return array;
        };

        MultiDictionary.prototype.containsKey = function (key) {
            return this.dict.containsKey(key);
        };

        MultiDictionary.prototype.clear = function () {
            this.dict.clear();
        };

        MultiDictionary.prototype.size = function () {
            return this.dict.size();
        };

        MultiDictionary.prototype.isEmpty = function () {
            return this.dict.isEmpty();
        };
        return MultiDictionary;
    })();
    Collections.MultiDictionary = MultiDictionary;

    var Heap = (function () {
        function Heap(compareFunction) {
            this.data = [];
            this.compare = compareFunction || Collections.defaultCompare;
        }
        Heap.prototype.leftChildIndex = function (nodeIndex) {
            return (2 * nodeIndex) + 1;
        };

        Heap.prototype.rightChildIndex = function (nodeIndex) {
            return (2 * nodeIndex) + 2;
        };

        Heap.prototype.parentIndex = function (nodeIndex) {
            return Math.floor((nodeIndex - 1) / 2);
        };

        Heap.prototype.minIndex = function (leftChild, rightChild) {
            if (rightChild >= this.data.length) {
                if (leftChild >= this.data.length) {
                    return -1;
                } else {
                    return leftChild;
                }
            } else {
                if (this.compare(this.data[leftChild], this.data[rightChild]) <= 0) {
                    return leftChild;
                } else {
                    return rightChild;
                }
            }
        };

        Heap.prototype.siftUp = function (index) {
            var parent = this.parentIndex(index);
            while (index > 0 && this.compare(this.data[parent], this.data[index]) > 0) {
                Collections.arrays.swap(this.data, parent, index);
                index = parent;
                parent = this.parentIndex(index);
            }
        };

        Heap.prototype.siftDown = function (nodeIndex) {
            var min = this.minIndex(this.leftChildIndex(nodeIndex), this.rightChildIndex(nodeIndex));

            while (min >= 0 && this.compare(this.data[nodeIndex], this.data[min]) > 0) {
                Collections.arrays.swap(this.data, min, nodeIndex);
                nodeIndex = min;
                min = this.minIndex(this.leftChildIndex(nodeIndex), this.rightChildIndex(nodeIndex));
            }
        };

        Heap.prototype.peek = function () {
            if (this.data.length > 0) {
                return this.data[0];
            } else {
                return undefined;
            }
        };

        Heap.prototype.add = function (element) {
            if (Collections.isUndefined(element)) {
                return undefined;
            }
            this.data.push(element);
            this.siftUp(this.data.length - 1);
            return true;
        };

        Heap.prototype.removeRoot = function () {
            if (this.data.length > 0) {
                var obj = this.data[0];
                this.data[0] = this.data[this.data.length - 1];
                this.data.splice(this.data.length - 1, 1);
                if (this.data.length > 0) {
                    this.siftDown(0);
                }
                return obj;
            }
            return undefined;
        };

        Heap.prototype.contains = function (element) {
            var equF = Collections.compareToEquals(this.compare);
            return Collections.arrays.contains(this.data, element, equF);
        };

        Heap.prototype.size = function () {
            return this.data.length;
        };

        Heap.prototype.isEmpty = function () {
            return this.data.length <= 0;
        };

        Heap.prototype.clear = function () {
            this.data.length = 0;
        };

        Heap.prototype.forEach = function (callback) {
            Collections.arrays.forEach(this.data, callback);
        };
        return Heap;
    })();
    Collections.Heap = Heap;

    var Stack = (function () {
        function Stack() {
            this.list = new LinkedList();
        }
        Stack.prototype.push = function (elem) {
            return this.list.add(elem, 0);
        };

        Stack.prototype.add = function (elem) {
            return this.list.add(elem, 0);
        };

        Stack.prototype.pop = function () {
            return this.list.removeElementAtIndex(0);
        };

        Stack.prototype.peek = function () {
            return this.list.first();
        };

        Stack.prototype.size = function () {
            return this.list.size();
        };

        Stack.prototype.contains = function (elem, equalsFunction) {
            return this.list.contains(elem, equalsFunction);
        };

        Stack.prototype.isEmpty = function () {
            return this.list.isEmpty();
        };

        Stack.prototype.clear = function () {
            this.list.clear();
        };

        Stack.prototype.forEach = function (callback) {
            this.list.forEach(callback);
        };
        return Stack;
    })();
    Collections.Stack = Stack;

    var Queue = (function () {
        function Queue() {
            this.list = new LinkedList();
        }
        Queue.prototype.enqueue = function (elem) {
            return this.list.add(elem);
        };

        Queue.prototype.add = function (elem) {
            return this.list.add(elem);
        };

        Queue.prototype.dequeue = function () {
            if (this.list.size() !== 0) {
                var el = this.list.first();
                this.list.removeElementAtIndex(0);
                return el;
            }
            return undefined;
        };

        Queue.prototype.peek = function () {
            if (this.list.size() !== 0) {
                return this.list.first();
            }
            return undefined;
        };

        Queue.prototype.size = function () {
            return this.list.size();
        };

        Queue.prototype.contains = function (elem, equalsFunction) {
            return this.list.contains(elem, equalsFunction);
        };

        Queue.prototype.isEmpty = function () {
            return this.list.size() <= 0;
        };

        Queue.prototype.clear = function () {
            this.list.clear();
        };

        Queue.prototype.forEach = function (callback) {
            this.list.forEach(callback);
        };
        return Queue;
    })();
    Collections.Queue = Queue;

    var PriorityQueue = (function () {
        function PriorityQueue(compareFunction) {
            this.heap = new Heap(Collections.reverseCompareFunction(compareFunction));
        }
        PriorityQueue.prototype.enqueue = function (element) {
            return this.heap.add(element);
        };

        PriorityQueue.prototype.add = function (element) {
            return this.heap.add(element);
        };

        PriorityQueue.prototype.dequeue = function () {
            if (this.heap.size() !== 0) {
                var el = this.heap.peek();
                this.heap.removeRoot();
                return el;
            }
            return undefined;
        };

        PriorityQueue.prototype.peek = function () {
            return this.heap.peek();
        };

        PriorityQueue.prototype.contains = function (element) {
            return this.heap.contains(element);
        };

        PriorityQueue.prototype.isEmpty = function () {
            return this.heap.isEmpty();
        };

        PriorityQueue.prototype.size = function () {
            return this.heap.size();
        };

        PriorityQueue.prototype.clear = function () {
            this.heap.clear();
        };

        PriorityQueue.prototype.forEach = function (callback) {
            this.heap.forEach(callback);
        };
        return PriorityQueue;
    })();
    Collections.PriorityQueue = PriorityQueue;

    var Set = (function () {
        function Set(toStringFunction) {
            this.dictionary = new Dictionary(toStringFunction);
        }
        Set.prototype.contains = function (element) {
            return this.dictionary.containsKey(element);
        };

        Set.prototype.add = function (element) {
            if (this.contains(element) || Collections.isUndefined(element)) {
                return false;
            } else {
                this.dictionary.setValue(element, element);
                return true;
            }
        };

        Set.prototype.intersection = function (otherSet) {
            var set = this;
            this.forEach(function (element) {
                if (!otherSet.contains(element)) {
                    set.remove(element);
                }
                return true;
            });
        };

        Set.prototype.union = function (otherSet) {
            var set = this;
            otherSet.forEach(function (element) {
                set.add(element);
                return true;
            });
        };

        Set.prototype.difference = function (otherSet) {
            var set = this;
            otherSet.forEach(function (element) {
                set.remove(element);
                return true;
            });
        };

        Set.prototype.isSubsetOf = function (otherSet) {
            if (this.size() > otherSet.size()) {
                return false;
            }

            var isSub = true;
            this.forEach(function (element) {
                if (!otherSet.contains(element)) {
                    isSub = false;
                    return false;
                }
                return true;
            });
            return isSub;
        };

        Set.prototype.remove = function (element) {
            if (!this.contains(element)) {
                return false;
            } else {
                this.dictionary.remove(element);
                return true;
            }
        };

        Set.prototype.forEach = function (callback) {
            this.dictionary.forEach(function (k, v) {
                return callback(v);
            });
        };

        Set.prototype.toArray = function () {
            return this.dictionary.values();
        };

        Set.prototype.isEmpty = function () {
            return this.dictionary.isEmpty();
        };

        Set.prototype.size = function () {
            return this.dictionary.size();
        };

        Set.prototype.clear = function () {
            this.dictionary.clear();
        };

        Set.prototype.toString = function () {
            return Collections.arrays.toString(this.toArray());
        };
        return Set;
    })();
    Collections.Set = Set;

    var Bag = (function () {
        function Bag(toStrFunction) {
            this.toStrF = toStrFunction || Collections.defaultToString;
            this.dictionary = new Dictionary(this.toStrF);
            this.nElements = 0;
        }
        Bag.prototype.add = function (element, nCopies) {
            if (typeof nCopies === "undefined") { nCopies = 1; }
            if (Collections.isUndefined(element) || nCopies <= 0) {
                return false;
            }

            if (!this.contains(element)) {
                var node = {
                    value: element,
                    copies: nCopies
                };
                this.dictionary.setValue(element, node);
            } else {
                this.dictionary.getValue(element).copies += nCopies;
            }
            this.nElements += nCopies;
            return true;
        };

        Bag.prototype.count = function (element) {
            if (!this.contains(element)) {
                return 0;
            } else {
                return this.dictionary.getValue(element).copies;
            }
        };

        Bag.prototype.contains = function (element) {
            return this.dictionary.containsKey(element);
        };

        Bag.prototype.remove = function (element, nCopies) {
            if (typeof nCopies === "undefined") { nCopies = 1; }
            if (Collections.isUndefined(element) || nCopies <= 0) {
                return false;
            }

            if (!this.contains(element)) {
                return false;
            } else {
                var node = this.dictionary.getValue(element);
                if (nCopies > node.copies) {
                    this.nElements -= node.copies;
                } else {
                    this.nElements -= nCopies;
                }
                node.copies -= nCopies;
                if (node.copies <= 0) {
                    this.dictionary.remove(element);
                }
                return true;
            }
        };

        Bag.prototype.toArray = function () {
            var a = [];
            var values = this.dictionary.values();
            var vl = values.length;
            for (var i = 0; i < vl; i++) {
                var node = values[i];
                var element = node.value;
                var copies = node.copies;
                for (var j = 0; j < copies; j++) {
                    a.push(element);
                }
            }
            return a;
        };

        Bag.prototype.toSet = function () {
            var toret = new Set(this.toStrF);
            var elements = this.dictionary.values();
            var l = elements.length;
            for (var i = 0; i < l; i++) {
                var value = elements[i].value;
                toret.add(value);
            }
            return toret;
        };

        Bag.prototype.forEach = function (callback) {
            this.dictionary.forEach(function (k, v) {
                var value = v.value;
                var copies = v.copies;
                for (var i = 0; i < copies; i++) {
                    if (callback(value) === false) {
                        return false;
                    }
                }
                return true;
            });
        };

        Bag.prototype.size = function () {
            return this.nElements;
        };

        Bag.prototype.isEmpty = function () {
            return this.nElements === 0;
        };

        Bag.prototype.clear = function () {
            this.nElements = 0;
            this.dictionary.clear();
        };
        return Bag;
    })();
    Collections.Bag = Bag;

    
    var BSTree = (function () {
        function BSTree(compareFunction) {
            this.root = null;
            this.compare = compareFunction || Collections.defaultCompare;
            this.nElements = 0;
        }
        BSTree.prototype.add = function (element) {
            if (Collections.isUndefined(element)) {
                return false;
            }

            if (this.insertNode(this.createNode(element)) !== null) {
                this.nElements++;
                return true;
            }
            return false;
        };

        BSTree.prototype.clear = function () {
            this.root = null;
            this.nElements = 0;
        };

        BSTree.prototype.isEmpty = function () {
            return this.nElements === 0;
        };

        BSTree.prototype.size = function () {
            return this.nElements;
        };

        BSTree.prototype.contains = function (element) {
            if (Collections.isUndefined(element)) {
                return false;
            }
            return this.searchNode(this.root, element) !== null;
        };

        BSTree.prototype.remove = function (element) {
            var node = this.searchNode(this.root, element);
            if (node === null) {
                return false;
            }
            this.removeNode(node);
            this.nElements--;
            return true;
        };

        BSTree.prototype.inorderTraversal = function (callback) {
            this.inorderTraversalAux(this.root, callback, {
                stop: false
            });
        };

        BSTree.prototype.preorderTraversal = function (callback) {
            this.preorderTraversalAux(this.root, callback, {
                stop: false
            });
        };

        BSTree.prototype.postorderTraversal = function (callback) {
            this.postorderTraversalAux(this.root, callback, {
                stop: false
            });
        };

        BSTree.prototype.levelTraversal = function (callback) {
            this.levelTraversalAux(this.root, callback);
        };

        BSTree.prototype.minimum = function () {
            if (this.isEmpty()) {
                return undefined;
            }
            return this.minimumAux(this.root).element;
        };

        BSTree.prototype.maximum = function () {
            if (this.isEmpty()) {
                return undefined;
            }
            return this.maximumAux(this.root).element;
        };

        BSTree.prototype.forEach = function (callback) {
            this.inorderTraversal(callback);
        };

        BSTree.prototype.toArray = function () {
            var array = [];
            this.inorderTraversal(function (element) {
                array.push(element);
                return true;
            });
            return array;
        };

        BSTree.prototype.height = function () {
            return this.heightAux(this.root);
        };

        BSTree.prototype.searchNode = function (node, element) {
            var cmp = null;
            while (node !== null && cmp !== 0) {
                cmp = this.compare(element, node.element);
                if (cmp < 0) {
                    node = node.leftCh;
                } else if (cmp > 0) {
                    node = node.rightCh;
                }
            }
            return node;
        };

        BSTree.prototype.transplant = function (n1, n2) {
            if (n1.parent === null) {
                this.root = n2;
            } else if (n1 === n1.parent.leftCh) {
                n1.parent.leftCh = n2;
            } else {
                n1.parent.rightCh = n2;
            }
            if (n2 !== null) {
                n2.parent = n1.parent;
            }
        };

        BSTree.prototype.removeNode = function (node) {
            if (node.leftCh === null) {
                this.transplant(node, node.rightCh);
            } else if (node.rightCh === null) {
                this.transplant(node, node.leftCh);
            } else {
                var y = this.minimumAux(node.rightCh);
                if (y.parent !== node) {
                    this.transplant(y, y.rightCh);
                    y.rightCh = node.rightCh;
                    y.rightCh.parent = y;
                }
                this.transplant(node, y);
                y.leftCh = node.leftCh;
                y.leftCh.parent = y;
            }
        };

        BSTree.prototype.inorderTraversalAux = function (node, callback, signal) {
            if (node === null || signal.stop) {
                return;
            }
            this.inorderTraversalAux(node.leftCh, callback, signal);
            if (signal.stop) {
                return;
            }
            signal.stop = callback(node.element) === false;
            if (signal.stop) {
                return;
            }
            this.inorderTraversalAux(node.rightCh, callback, signal);
        };

        BSTree.prototype.levelTraversalAux = function (node, callback) {
            var queue = new Queue();
            if (node !== null) {
                queue.enqueue(node);
            }
            while (!queue.isEmpty()) {
                node = queue.dequeue();
                if (callback(node.element) === false) {
                    return;
                }
                if (node.leftCh !== null) {
                    queue.enqueue(node.leftCh);
                }
                if (node.rightCh !== null) {
                    queue.enqueue(node.rightCh);
                }
            }
        };

        BSTree.prototype.preorderTraversalAux = function (node, callback, signal) {
            if (node === null || signal.stop) {
                return;
            }
            signal.stop = callback(node.element) === false;
            if (signal.stop) {
                return;
            }
            this.preorderTraversalAux(node.leftCh, callback, signal);
            if (signal.stop) {
                return;
            }
            this.preorderTraversalAux(node.rightCh, callback, signal);
        };

        BSTree.prototype.postorderTraversalAux = function (node, callback, signal) {
            if (node === null || signal.stop) {
                return;
            }
            this.postorderTraversalAux(node.leftCh, callback, signal);
            if (signal.stop) {
                return;
            }
            this.postorderTraversalAux(node.rightCh, callback, signal);
            if (signal.stop) {
                return;
            }
            signal.stop = callback(node.element) === false;
        };

        BSTree.prototype.minimumAux = function (node) {
            while (node.leftCh !== null) {
                node = node.leftCh;
            }
            return node;
        };

        BSTree.prototype.maximumAux = function (node) {
            while (node.rightCh !== null) {
                node = node.rightCh;
            }
            return node;
        };

        BSTree.prototype.heightAux = function (node) {
            if (node === null) {
                return -1;
            }
            return Math.max(this.heightAux(node.leftCh), this.heightAux(node.rightCh)) + 1;
        };

        BSTree.prototype.insertNode = function (node) {
            var parent = null;
            var position = this.root;
            var cmp = null;
            while (position !== null) {
                cmp = this.compare(node.element, position.element);
                if (cmp === 0) {
                    return null;
                } else if (cmp < 0) {
                    parent = position;
                    position = position.leftCh;
                } else {
                    parent = position;
                    position = position.rightCh;
                }
            }
            node.parent = parent;
            if (parent === null) {
                this.root = node;
            } else if (this.compare(node.element, parent.element) < 0) {
                parent.leftCh = node;
            } else {
                parent.rightCh = node;
            }
            return node;
        };

        BSTree.prototype.createNode = function (element) {
            return {
                element: element,
                leftCh: null,
                rightCh: null,
                parent: null
            };
        };
        return BSTree;
    })();
    Collections.BSTree = BSTree;
})(Collections || (Collections = {}));
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
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
                return this.owner.match.invoke(this.calculation, c, null);
        };

        Aura.prototype.trigger = function (source) {
            this.owner.match.removeAura(this);
            this.owner.secrets.remove(this);

            this.owner.onEvent(9 /* SECRET_REVEALED */, this, source);
            this.owner.match.invoke(this.onTrigger, this.owner, source);
        };
        return Aura;
    })(Dimension.Triggerable);
    Dimension.Aura = Aura;
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

    var MatchObject = (function () {
        function MatchObject(match) {
            this.eventStack = [];
            this.auras = new Collections.LinkedList();
            this.match = match;
        }
        MatchObject.prototype.getController = function () {
            return (this.controller == null) ? this.owner : this.controller;
        };

        MatchObject.prototype.runEvent = function (e, source, other) {
            var auras = this.getAuras();
            for (var i = 0, l = auras.length; i < l; i++) {
                this.match.aura = auras[i];
                this.match.invoke(auras[i].getTrigger(e), source, other);
            }
        };

        MatchObject.prototype.onEvent = function (e, source, other) {
            this.eventStack.push(new EventObject(e, source, other));

            if (this.eventStack.length > 1)
                return;

            while (this.eventStack.length > 0) {
                var eo = this.eventStack.shift();
                this.handleRunEvent(eo);
            }
        };

        MatchObject.prototype.handleRunEvent = function (eo) {
            this.runEvent(eo.event, eo.source, eo.other);
            this.removeObject(eo, this.eventStack);
        };

        MatchObject.prototype.addAura = function (stat, amount, expires, global) {
            if (typeof global === "undefined") { global = false; }
            var aura = new Dimension.Aura(this, stat, amount, expires);

            if (global)
                this.match.globalAuras.add(aura);
            else
                this.auras.add(aura);

            return aura;
        };

        MatchObject.prototype.addDynamicAura = function (stat, calculation, expires, global) {
            if (typeof global === "undefined") { global = false; }
            var aura = Dimension.Aura.createDynamic(this, stat, calculation, expires);

            if (global)
                this.match.globalAuras.add(aura);
            else
                this.auras.add(aura);

            return aura;
        };

        MatchObject.prototype.addAuraFromCard = function (card) {
            var aura = new Dimension.Aura(this, 0 /* NONE */, 0, false);
            card.applyToAura(aura);
            this.auras.add(aura);

            return aura;
        };

        MatchObject.prototype.removeAuras = function () {
            this.auras.clear();
            var ggAuras = this.match.globalAuras;

            for (var i = 0, l = ggAuras.size(); i < l; i++) {
                if (ggAuras[i].owner == this) {
                    this.removeObject(ggAuras[i], this.match.globalAuras);
                }
            }
        };

        MatchObject.prototype.getAuras = function () {
            var auras = [];

            auras = auras.concat(this.auras.toArray());
            auras = auras.concat(this.getController().secrets.toArray());
            auras = auras.concat(this.getController().opponent.secrets.toArray());
            auras = auras.concat(this.match.globalAuras.toArray());

            return auras;
        };

        MatchObject.prototype.aurasByStat = function (stat) {
            var list = [];
            var auras = this.getAuras();

            for (var i = 0, l = auras.length; i < l; i++) {
                if (auras[i].stat == stat) {
                    list.push(auras[i]);
                }
            }

            return list;
        };

        MatchObject.prototype.sumAurasByStat = function (stat) {
            var sum = 0;
            return sum;
        };

        MatchObject.prototype.removeObject = function (object, from) {
            var index = from.indexOf(object, 0);
            if (index != undefined) {
                from.splice(index, 1);
            }
        };
        return MatchObject;
    })();
    Dimension.MatchObject = MatchObject;
})(Dimension || (Dimension = {}));
var Dimension;
(function (Dimension) {
    var Character = (function (_super) {
        __extends(Character, _super);
        function Character(match) {
            _super.call(this, match);
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
                this.match.log(this.name + " loses divine shield.");
                this.divineShield = false;
                return false;
            } else {
                this.match.log(source.name + " deals " + damage + "damage to " + this.name);
            }

            var migitation = Math.min(damage, this.armor);
            this.armor -= migitation;
            damage -= migitation;
            this.health -= damage;

            return (damage > 0);
        };

        Character.prototype.damage = function (damage, source, isSpellDamage) {
            if (typeof isSpellDamage === "undefined") { isSpellDamage = false; }
            if (isSpellDamage)
                damage += source.owner.sumAurasByStat(9 /* SPELL_POWER */);

            if (damage < 0)
                return;

            var inflicted = this.combatDamage(damage, source);
            if (!inflicted) {
                return;
            }

            this.onEvent(1 /* DAMAGE */, this, source);
            this.match.postDamage();
        };

        Character.prototype.destroy = function () {
            this.health = -1000;
            this.match.postDamage();
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

            this.match.log(this.name, "gains", "+" + attack + "a/+", health + "h");

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
    })(Dimension.MatchObject);
    Dimension.Character = Character;
})(Dimension || (Dimension = {}));
var Dimension;
(function (Dimension) {
    var Minion = (function (_super) {
        __extends(Minion, _super);
        function Minion(name, attack, health, card, owner) {
            _super.call(this, owner.match);
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
            this.match.log(this.name, "silenced");

            this.taunt = false;
            this.charge = false;
            this.windfury = false;
            this.divineShield = false;
            this.stealth = false;
            this.shroud = false;

            this.removeAuras();
        };

        Minion.prototype.unsummon = function () {
            var index = this.controller.board.indexOf(this);
            this.controller.board.splice(index, 1);
            this.removeAuras();

            if (!this.token) {
                this.match.log(this.name, "returned to", this.owner.name, "'s hand");
                this.owner.hand.add(new Dimension.Spell(this.card, this.owner));
            }
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
                this.match.invoke(handler, this.controller.board[right], null);

            var left = index - 1;
            if (left >= 0)
                this.match.invoke(handler, this.controller.board[left], null);
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
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(match, deck) {
            _super.call(this, match);
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

            for (var i = 0, l = deck.spells.size(); i < l; i++) {
                this.library.add(new Dimension.Spell(deck.spells.copyAtIndex(i), this));
            }
        }
        Player.prototype.toString = function () {
            return this.name;
        };

        Player.prototype.getAttack = function () {
            return _super.prototype.getAttack.call(this) + ((this.weapon != null) ? this.weapon.getAttack() : 0);
        };

        Player.prototype.getMana = function () {
            return Math.max(0, Math.min(this.getMaxMana(), this.mana + this.sumAurasByStat(3 /* MANA */)));
        };

        Player.prototype.getMaxMana = function () {
            return Math.max(0, Math.min(10, this.maxMana + this.sumAurasByStat(3 /* MANA */)));
        };

        Player.prototype.gainMana = function (amount) {
            this.mana = Math.max(this.maxMana, this.mana + amount);
        };

        Player.prototype.gainManaCrystals = function (amount) {
            this.maxMana = Math.max(10, this.maxMana + amount);
        };

        Player.prototype.destroyManaCrystals = function (amount) {
            this.maxMana = Math.max(0, this.maxMana - amount);
            if (this.mana > this.maxMana)
                this.mana = this.maxMana;
        };

        Player.prototype.hasCardsLeft = function () {
            return (this.library.size() > 0);
        };
        Player.prototype.handleOutOfCards = function () {
        };

        Player.prototype.isHandFull = function () {
            return (this.hand.size() >= Dimension.Match.MAXIMUM_HAND_SIZE);
        };
        Player.prototype.handleFullHand = function () {
        };

        Player.prototype.isBoardFull = function () {
            return (this.board.length >= Dimension.Match.MAXIMUM_BOARD_SIZE);
        };

        Player.prototype.drawCard = function () {
            if (!this.hasCardsLeft()) {
                this.handleOutOfCards();
                return;
            }

            if (this.isHandFull()) {
                this.handleFullHand();
                return;
            }

            this.match.log(this.owner.name, "draws a card");
            var spell = this.library.removeElementAtIndex(0);
            this.hand.add(spell);
            this.onEvent(8 /* DRAW */, spell, null);
        };

        Player.prototype.drawCardNamed = function (name) {
            if (!this.hasCardsLeft()) {
                this.handleOutOfCards();
                return;
            }

            if (this.isHandFull()) {
                this.handleFullHand();
                return;
            }

            var card = Dimension.Card.get(name);
            if (card != null) {
                this.hand.add(new Dimension.Spell(card, this));
            }
        };

        Player.prototype.castSpell = function (spell) {
            this.castSpellBeforeMinion(spell, null);
        };

        Player.prototype.castSpellBeforeMinion = function (spell, before) {
            this.match.log(this.name, "casts", spell.card.name);

            this.mana -= spell.getCost();
            this.overload += spell.card.overload;
            this.hand.remove(spell);

            this.match.spellCounter++;

            if (spell.card.type == 0 /* MINION */) {
                this.handleCastMinion(spell, before);
            } else if (spell.card.type == 2 /* WEAPON */) {
                this.handleCastWeapon(spell, before);
            } else {
                this.handleCastSpell(spell, before);
            }
        };

        Player.prototype.handleCastMinion = function (spell, before) {
            if (this.isBoardFull()) {
                return;
            }

            var minion = new Dimension.Minion(spell.card.name, spell.card.attack, spell.card.health, spell.card, this);

            var beforeIndex = this.board.indexOf(before);
            if (beforeIndex >= 0) {
                this.board.splice(beforeIndex, 0, minion);
            } else {
                this.board.push(minion);
            }

            minion.onEvent(6 /* CAST */, minion, null);
            minion.onEvent(10 /* SUMMON */, minion, null);

            this.match.minionCounter++;
        };

        Player.prototype.handleCastWeapon = function (spell, before) {
            this.weapon = new Dimension.Weapon(spell.card.name, spell.card.attack, spell.card.durability, spell.card, this);
            this.onEvent(6 /* CAST */, spell, null);
            this.match.invoke(spell.card.onCast, this.weapon, null);
        };

        Player.prototype.handleCastSpell = function (spell, before) {
            this.onEvent(6 /* CAST */, spell, null);
            this.match.invoke(spell.card.onCast, spell, null);
        };

        Player.prototype.summonMinionNamed = function (name) {
            if (this.isBoardFull()) {
                console.log("Shouldn't be here.");
                return;
            }

            var card = Dimension.Card.get(name);
            var minion = new Dimension.Minion(card.name, card.attack, card.health, card, this);
            this.board.push(minion);
            this.match.invoke(card.onCast, minion, null);
            minion.onEvent(10 /* SUMMON */, minion, null);
        };

        Player.prototype.equipWeaponNamed = function (name) {
            var card = Dimension.Card.get(name);
            this.weapon = new Dimension.Weapon(card.name, card.attack, card.durability, card, this);
        };

        Player.prototype.hasTaunt = function () {
            var hasTaunt = false;

            _.each(this.board, function (minion) {
                if (minion.taunt && !minion.stealth)
                    hasTaunt = true;
            });

            return hasTaunt;
        };

        Player.prototype.hasWeapon = function () {
            return (this.weapon != null && this.weapon.durability > 0);
        };

        Player.prototype.discardRandomCount = function (count) {
            var _this = this;
            _.times(count, function () {
                if (_this.hand.size() > 0)
                    var desiredIndex = Math.floor(Math.random() * _this.hand.size());
                _this.discardSpell(_this.hand[desiredIndex]);
            });
        };

        Player.prototype.discardSpell = function (spell) {
            this.hand.remove(spell);
        };

        Player.prototype.useAbility = function () {
            this.match.log(this.name, "uses their hero ability");
            this.mana -= this.ability.cost;
            this.abilityUsed = true;
            this.match.invoke(this.ability.onCast, this, null);
        };

        Player.prototype.addSecretAura = function (trigger) {
            var aura = Dimension.Aura.createTriggerable(this, trigger);
            this.secrets.add(aura);
            return aura;
        };
        return Player;
    })(Dimension.Character);
    Dimension.Player = Player;
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

    (function (CardType) {
        CardType[CardType["MINION"] = 0] = "MINION";

        CardType[CardType["SPELL"] = 1] = "SPELL";

        CardType[CardType["WEAPON"] = 2] = "WEAPON";

        CardType[CardType["ABILITY"] = 3] = "ABILITY";
    })(Dimension.CardType || (Dimension.CardType = {}));
    var CardType = Dimension.CardType;

    (function (CardSubType) {
        CardSubType[CardSubType["GENERAL"] = 0] = "GENERAL";
        CardSubType[CardSubType["BEAST"] = 1] = "BEAST";
        CardSubType[CardSubType["DEMON"] = 2] = "DEMON";
        CardSubType[CardSubType["DRAGON"] = 3] = "DRAGON";
        CardSubType[CardSubType["MURLOC"] = 4] = "MURLOC";
        CardSubType[CardSubType["PIRATE"] = 5] = "PIRATE";
        CardSubType[CardSubType["TOTEM"] = 6] = "TOTEM";
    })(Dimension.CardSubType || (Dimension.CardSubType = {}));
    var CardSubType = Dimension.CardSubType;

    var Card = (function (_super) {
        __extends(Card, _super);
        function Card() {
            _super.call(this);
            this.overload = 0;
            this.durabilityLoss = 1;
        }
        Card.create = function (configure) {
            var card = new Card();
            configure(card);
            Card._cards.setValue(card.name, card);
            return Card.get(card.name);
        };

        Card.get = function (name) {
            return Card._cards.copyValue(name);
        };
        Card._cards = new Collections.Dictionary();
        return Card;
    })(Dimension.Triggerable);
    Dimension.Card = Card;
})(Dimension || (Dimension = {}));
var Dimension;
(function (Dimension) {
    var Deck = (function () {
        function Deck() {
            this.spells = new Collections.LinkedList();
        }
        Deck.fromString = function (deckString) {
            var deck = new Deck();

            var lines = deckString.trim().split("\n");
            deck.hero = lines.shift().trim();

            var line;
            for (var i = 0, l = lines.length; i < l; i++) {
                line = lines[i];
                var data = line.split("x ");

                var spell = Dimension.Card.get(data[1].trim());
                if (spell != null) {
                    _.times(~~data[0].trim(), function () {
                        deck.spells.add(Dimension.Card.get(data[1].trim()));
                    });
                }
            }

            return deck;
        };

        Deck.fromDOM = function (domId) {
            var str = document.getElementById(domId).textContent;
            return Deck.fromString(str);
        };
        return Deck;
    })();
    Dimension.Deck = Deck;
})(Dimension || (Dimension = {}));
var Dimension;
(function (Dimension) {
    "use strict";

    (function (MatchState) {
        MatchState[MatchState["CAST_SPELL"] = 0] = "CAST_SPELL";

        MatchState[MatchState["ATTACK"] = 1] = "ATTACK";

        MatchState[MatchState["TARGET"] = 2] = "TARGET";

        MatchState[MatchState["SUMMON"] = 3] = "SUMMON";

        MatchState[MatchState["CHOOSE_ONE"] = 4] = "CHOOSE_ONE";

        MatchState[MatchState["MULLIGAN"] = 5] = "MULLIGAN";
    })(Dimension.MatchState || (Dimension.MatchState = {}));
    var MatchState = Dimension.MatchState;

    (function (MatchEvent) {
        MatchEvent[MatchEvent["ATTACK"] = 0] = "ATTACK";

        MatchEvent[MatchEvent["DAMAGE"] = 1] = "DAMAGE";

        MatchEvent[MatchEvent["DAMAGE_DEALT"] = 2] = "DAMAGE_DEALT";

        MatchEvent[MatchEvent["START_OF_TURN"] = 3] = "START_OF_TURN";

        MatchEvent[MatchEvent["END_OF_TURN"] = 4] = "END_OF_TURN";

        MatchEvent[MatchEvent["DEATH"] = 5] = "DEATH";

        MatchEvent[MatchEvent["CAST"] = 6] = "CAST";

        MatchEvent[MatchEvent["HEAL"] = 7] = "HEAL";

        MatchEvent[MatchEvent["DRAW"] = 8] = "DRAW";

        MatchEvent[MatchEvent["SECRET_REVEALED"] = 9] = "SECRET_REVEALED";

        MatchEvent[MatchEvent["SUMMON"] = 10] = "SUMMON";
    })(Dimension.MatchEvent || (Dimension.MatchEvent = {}));
    var MatchEvent = Dimension.MatchEvent;

    (function (TargetFilter) {
        TargetFilter[TargetFilter["HERO"] = 0] = "HERO";

        TargetFilter[TargetFilter["MINION"] = 1] = "MINION";

        TargetFilter[TargetFilter["ENEMY_HERO"] = 2] = "ENEMY_HERO";

        TargetFilter[TargetFilter["ENEMY_MINION"] = 3] = "ENEMY_MINION";

        TargetFilter[TargetFilter["FRIENDLY_HERO"] = 4] = "FRIENDLY_HERO";

        TargetFilter[TargetFilter["FRIENDLY_MINION"] = 5] = "FRIENDLY_MINION";

        TargetFilter[TargetFilter["ENEMY"] = 6] = "ENEMY";

        TargetFilter[TargetFilter["FRIENDLY"] = 7] = "FRIENDLY";

        TargetFilter[TargetFilter["CHARACTER"] = 8] = "CHARACTER";

        TargetFilter[TargetFilter["DAMAGED"] = 9] = "DAMAGED";
    })(Dimension.TargetFilter || (Dimension.TargetFilter = {}));
    var TargetFilter = Dimension.TargetFilter;

    

    var Match = (function () {
        function Match() {
            this.players = new Array();
            this.currentPlayerIndex = 0;
            this.state = 5 /* MULLIGAN */;
            this.globalAuras = new Collections.LinkedList();
            this.spellCounter = 0;
            this.turnCounter = 0;
            this.minionCounter = 0;
            this.matchLog = [];
            var self = this;

            this.targetFilters = {};
            this.targetFilters[0 /* HERO */] = function (match) {
                return (this instanceof Dimension.Player);
            };
            this.targetFilters[1 /* MINION */] = function (match) {
                return (this instanceof Dimension.Minion);
            };
            this.targetFilters[2 /* ENEMY_HERO */] = function (match) {
                return (this instanceof Dimension.Player) && (this != match.currentPlayer());
            };
            this.targetFilters[3 /* ENEMY_MINION */] = function (match) {
                return (this instanceof Dimension.Minion) && (this.controller != match.currentPlayer());
            };
            this.targetFilters[4 /* FRIENDLY_HERO */] = function (match) {
                return (this instanceof Dimension.Player) && (this.controller == match.currentPlayer());
            };
            this.targetFilters[5 /* FRIENDLY_MINION */] = function (match) {
                return (this instanceof Dimension.Minion) && (this.controller == match.currentPlayer());
            };
            this.targetFilters[8 /* CHARACTER */] = function (match) {
                return (self.filter(this, 0 /* HERO */) || self.filter(this, 1 /* MINION */));
            };
            this.targetFilters[9 /* DAMAGED */] = function (match) {
                return this.isDamaged();
            };
        }
        Match.prototype.filter = function (self, filt) {
            return this.targetFilters[filt].call(self, this);
        };

        Match.prototype.currentPlayer = function () {
            return this.players[this.currentPlayerIndex];
        };

        Match.prototype.currentOpponent = function () {
            return this.players[(this.currentPlayerIndex + 1 % this.players.length)];
        };

        Match.prototype.init = function () {
            this.state = 5 /* MULLIGAN */;
            this.currentPlayerIndex = 0;

            this.currentPlayer().opponent = this.currentOpponent();
            this.currentOpponent().opponent = this.currentPlayer();

            for (var pi = 0, pc = this.players.length; pi < pc; pi++) {
                var player = this.players[pi];
                while (player.hand.size() < 3) {
                    player.drawCard();
                }
            }
            this.currentOpponent().drawCard();
        };

        Match.prototype.start = function () {
            this.state = 0 /* CAST_SPELL */;

            this.currentPlayer().mana = 1;
            this.currentPlayer().maxMana = 1;

            for (var pi = 0, pc = this.players.length; pi < pc; pi++) {
                var player = this.players[pi];
                while (player.hand.size() < 4) {
                    player.drawCard();
                }
            }
        };

        Match.prototype.endTurn = function () {
            this.log(this.currentPlayer().name + "'s turn ends");

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

            this.log(this.currentPlayer().name + "'s turn starts");
        };

        Match.prototype.combat = function (attacker, defender) {
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

        Match.prototype.postDamage = function () {
            _.each(this.players, function (player) {
                _.each(player.board, function (minion) {
                    if (minion.getHealth() <= 0) {
                        var idx = minion.controller.board.indexOf(minion);
                        minion.controller.board.splice(idx, 1);
                        minion.onEvent(5 /* DEATH */, minion, null);
                    }
                });
            });
        };

        Match.prototype.aurasByStat = function (stat) {
            var list = new Collections.LinkedList();

            for (var ai = 0, ac = this.globalAuras.size(); ai < ac; ai++) {
                var aura = this.globalAuras[ai];
                if (aura.stat == stat) {
                    list.add(aura);
                }
            }

            return list;
        };

        Match.prototype.sumAurasByStat = function (stat) {
            var sum = 0;
            var auras = this.aurasByStat(stat);

            for (var ai = 0, ac = auras.size(); ai < ac; ai++) {
                sum += auras[ai].amountFor(this);
            }

            return sum;
        };

        Match.prototype.removeExpiredAuras = function () {
            var chars = new Collections.LinkedList();
            for (var pi = 0, pc = this.players.length; pi < pc; pi++) {
                var player = this.players[pi];
                chars.add(player);
                for (var mi = 0, mc = player.board.length; mi < mc; mi++) {
                    chars.add(player.board[mi]);
                }
            }

            for (var ci = 0, cc = chars.size(); ci < cc; ci++) {
                var c = chars.elementAtIndex(ci);

                if (c.controller == this.currentPlayer()) {
                    c.unfreeze();
                }

                c.onEvent(4 /* END_OF_TURN */, c, null);

                var removeExpiredFrom = function (list) {
                    list.forEach(function (aura) {
                        if (aura.expires)
                            list.remove(aura);
                        return true;
                    });
                };

                removeExpiredFrom(this.globalAuras);

                removeExpiredFrom(c.auras);

                if (c instanceof Dimension.Player) {
                    var player = c;
                    if (player.hasWeapon()) {
                        removeExpiredFrom(player.weapon.auras);
                    }
                }
            }
        };

        Match.prototype.removeAura = function (aura) {
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

        Match.prototype.invoke = function (handler, self, other) {
            if (handler != null) {
                return handler.apply(this, [self, other]);
            }
            return null;
        };

        Match.prototype.validTargetsWithFilter = function (filter) {
            var _this = this;
            var targets = new Collections.LinkedList();

            _.each(this.players, function (player) {
                if (_this.filter(player, filter) == true) {
                    targets.add(player);
                }

                _.each(player.board, function (minion) {
                    if (!minion.shroud && (_this.filter(minion, filter) == true)) {
                        targets.add(minion);
                    }
                });
            });

            return targets;
        };

        Match.prototype.targetsCountWithFilter = function (filter) {
            return this.validTargetsWithFilter(filter).size();
        };

        Match.prototype.chooseTarget = function (filter, handler) {
            if (this.targetsCountWithFilter(filter) == 0)
                return;

            this.activeFilter = filter;
            this.onTargetHandler = handler;
            this.state = 2 /* TARGET */;
        };

        Match.prototype.chooseOne = function (s1, h1, s2, h2) {
        };

        Match.prototype.hasCombo = function () {
            return this.spellCounter >= 1;
        };

        Match.prototype.forEachTargetWithFilter = function (filter, handler) {
            var targets = this.validTargetsWithFilter(filter);
            var targetsArr = targets.toArray();
            this.forEachTarget(targetsArr, handler);
        };

        Match.prototype.forNumberOfRandomTargetsWithFilter = function (count, filter, handler) {
            var targets = this.validTargetsWithFilter(filter);
            var targetsArr = targets.toArray();
            this.forEachTarget(_.sample(targetsArr, count), handler);
        };

        Match.prototype.forEachTargetWithFilterExceptRandom = function (count, filter, handler) {
            var targets = this.validTargetsWithFilter(filter);
            var targetsArr = targets.toArray();
            this.forEachTarget(_.sample(targetsArr, targets.size() - count), handler);
        };

        Match.prototype.forEachTarget = function (targets, handler) {
            var _this = this;
            _.each(targets, function (char) {
                if (char.getHealth() > 0) {
                    _this.invoke(handler, char, null);
                }
            });
        };

        Match.prototype.assignDamageForEach = function (list, damage, source) {
            _.each(list, function (character) {
                character.combatDamage(damage, source);
                character.onEvent(1 /* DAMAGE */, character, source);
            });
            this.postDamage();
        };

        Match.prototype.damageForEachWithFilter = function (filter, damage, source) {
            var targets = this.validTargetsWithFilter(filter);
            var targetsArr = targets.toArray();
            this.assignDamageForEach(targetsArr, damage, source);
        };

        Match.prototype.spellDamageForEachWithFilter = function (filter, damage, source) {
            damage += source.owner.sumAurasByStat(9 /* SPELL_POWER */);
            var targets = this.validTargetsWithFilter(filter);
            var targetsArr = targets.toArray();
            this.assignDamageForEach(targetsArr, damage, source);
        };

        Match.prototype.damageForNumberOfRandom = function (count, filter, damage, source) {
            var targets = this.validTargetsWithFilter(filter);
            var targetsArr = targets.toArray();
            this.assignDamageForEach(_.sample(targetsArr, count), damage, source);
        };

        Match.prototype.spellDamageForNumberOfRandom = function (count, filter, damage, source) {
            damage += source.owner.sumAurasByStat(9 /* SPELL_POWER */);
            var targets = this.validTargetsWithFilter(filter);
            var targetsArr = targets.toArray();
            this.assignDamageForEach(_.sample(targetsArr, count), damage, source);
        };

        Match.prototype.log = function () {
            var parts = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                parts[_i] = arguments[_i + 0];
            }
            var msg = parts.join(" ");
            this.matchLog.push(_.clone(msg));
            console.log(msg);
        };
        Match.MAXIMUM_BOARD_SIZE = 7;

        Match.MAXIMUM_HAND_SIZE = 10;
        return Match;
    })();
    Dimension.Match = Match;
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
        function Weapon(name, attack, durability, card, owner) {
            _super.call(this, owner.match);
            this.durabilityLoss = 1;
            this.card = card;
            this.owner = this.controller = owner;
            this.attack = attack;
            this.durability = durability;
            this.durabilityLoss = card.durabilityLoss;
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
    })(Dimension.MatchObject);
    Dimension.Weapon = Weapon;
})(Dimension || (Dimension = {}));
var Dimension;
(function (Dimension) {
    Dimension.Card.create(function (card) {
        card.type = 0 /* MINION */;
        card.id = 107;
        card.name = "Abomination";
        card.cost = 5;
        card.text = "Taunt. Deathrattle: Deal 2 damage to ALL characters.";
        card.rarity = 2 /* RARE */;

        card.attack = 4;
        card.health = 4;
        card.taunt = true;

        card.onDeath = function (match) {
            match.damageForEachWithFilter(8 /* CHARACTER */, 2, null);
        };
    });
})(Dimension || (Dimension = {}));
//# sourceMappingURL=dim.js.map
