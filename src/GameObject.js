/// <reference path="GameEvent.ts" />
/// <reference path="Game.ts" />
/// <reference path="Player.ts" />
/// <reference path="Aura.ts" />
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

        /**
        * Push a GameEvent onto this object's event stack
        * @param e      The event to run
        * @param source The event's source object
        * @param other  The event's target object
        */
        GameObject.prototype.onEvent = function (e, source, other) {
            this.eventStack.push(new EventObject(e, source, other));

            if (this.eventStack.length > 1)
                return;

            while (this.eventStack.length > 0) {
                var eo = this.eventStack.shift();
                this.handleRunEvent(eo);
            }
        };

        /**
        * Handler for running an event from the event stack.
        * Also removes the event ran.
        * @param eo The EventObject to run
        */
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
//# sourceMappingURL=GameObject.js.map
