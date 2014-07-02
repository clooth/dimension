module Element {

  export class Boot extends Phaser.State {

    preload() {
      // Preload images
    }

    create() {
      this.input.maxPointers = 1;
      this.stage.disableVisibilityChange = true;

      if (this.game.device.desktop) {
        this.stage.scale.pageAlignHorizontally = true;
      }
      else {
        // Mobile
      }

      this.game.state.start('Preloader', true, false);
    }

  }
}