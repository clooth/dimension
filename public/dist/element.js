var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Element;
(function (Element) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
        }
        Boot.prototype.preload = function () {
            // Preload images
        };

        Boot.prototype.create = function () {
            this.input.maxPointers = 1;
            this.stage.disableVisibilityChange = true;

            if (this.game.device.desktop) {
                this.stage.scale.pageAlignHorizontally = true;
            } else {
                // Mobile
            }

            this.game.state.start('Preloader', true, false);
        };
        return Boot;
    })(Phaser.State);
    Element.Boot = Boot;
})(Element || (Element = {}));
var Element;
(function (Element) {
    var Preloader = (function (_super) {
        __extends(Preloader, _super);
        function Preloader() {
            _super.apply(this, arguments);
        }
        Preloader.prototype.preload = function () {
            // Preload images
            // this.preloadBar = this.add.sprite(200, 250, 'preloadBar');
            // this.load.setPreloadSprite(this.preloadBar);
        };

        Preloader.prototype.create = function () {
            var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
            tween.onComplete.add(this.startMainMenu, this);
        };

        Preloader.prototype.startMainMenu = function () {
            this.game.state.start('MainMenu', true, false);
        };
        return Preloader;
    })(Phaser.State);
    Element.Preloader = Preloader;
})(Element || (Element = {}));
var Element;
(function (Element) {
    var MainMenu = (function (_super) {
        __extends(MainMenu, _super);
        function MainMenu() {
            _super.apply(this, arguments);
        }
        // background: Phaser.Sprite;
        // logo: Phaser.Sprite;
        MainMenu.prototype.create = function () {
            // Bind events and setup sprites
            this.input.onDown.addOnce(this.startMatch, this);
        };

        MainMenu.prototype.startMatch = function () {
            this.game.state.start('Match', true, false);
        };
        return MainMenu;
    })(Phaser.State);
    Element.MainMenu = MainMenu;
})(Element || (Element = {}));
var Element;
(function (Element) {
    var Match = (function (_super) {
        __extends(Match, _super);
        function Match() {
            _super.apply(this, arguments);
        }
        Match.prototype.create = function () {
            this.game = new Dimension.Game();
        };
        return Match;
    })(Phaser.State);
    Element.Match = Match;
})(Element || (Element = {}));
/// <reference path="Boot.ts" />
/// <reference path="Preloader.ts" />
/// <reference path="MainMenu.ts" />
/// <reference path="Match.ts" />
var Element;
(function (Element) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this, 800, 600, Phaser.AUTO, 'content', null);

            this.state.add('Boot', Element.Boot, false);
            this.state.add('Preloader', Element.Preloader, false);
            this.state.add('MainMenu', Element.MainMenu, false);
            this.state.add('Match', Element.Match, false);

            this.state.start('Boot');
        }
        return Game;
    })(Phaser.Game);
    Element.Game = Game;
})(Element || (Element = {}));
/// <reference path="../lib/phaser.d.ts" />
/// <reference path="../../lib/dim.d.ts" />
/// <reference path="Game.ts" />
