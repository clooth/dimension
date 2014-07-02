/// <reference path="Boot.ts" />
/// <reference path="Preloader.ts" />
/// <reference path="MainMenu.ts" />
/// <reference path="Match.ts" />

module Element {

  export class Game extends Phaser.Game {

    constructor() {
      super(800, 600, Phaser.AUTO, 'content', null);

      this.state.add('Boot', Boot, false);
      this.state.add('Preloader', Preloader, false);
      this.state.add('MainMenu', MainMenu, false);
      this.state.add('Match', Match, false);

      this.state.start('Boot');
    }

  }

}