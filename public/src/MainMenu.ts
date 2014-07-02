module Element {

  export class MainMenu extends Phaser.State {
    // background: Phaser.Sprite;
    // logo: Phaser.Sprite;

    create(): void {
      // Bind events and setup sprites
      this.input.onDown.addOnce(this.startMatch, this);
    }

    startMatch(): void {
      this.game.state.start('Match', true, false)
    }
  }
}