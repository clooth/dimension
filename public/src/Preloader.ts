module Element {

  export class Preloader extends Phaser.State {

    preload() {
      // Preload images
      // this.preloadBar = this.add.sprite(200, 250, 'preloadBar');
      // this.load.setPreloadSprite(this.preloadBar);
    }

    create() {
      var tween = this.add.tween(this.preloadBar).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true);
      tween.onComplete.add(this.startMainMenu, this);
    }

    startMainMenu() {
      this.game.state.start('MainMenu', true, false);
    }

  }
}