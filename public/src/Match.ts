module Element {

  export class Match extends Phaser.State {

    match: Dimension.Game;

    create() {
      this.game = new Dimension.Game();
    }

  }

}