class Intro extends Phaser.Scene {
  constructor() {
    super("Intro");
  }

  init() {}

  preload() {}

  create() {
    this.introText = this.add.text(280, 160, "PRESIONA ESPACIO PARA EMPEZAR", {
      fontStyle: "strong",
      font: "20px Cascadia Code",
      fill: "#1C5480",
    });

    // CREATE KEYBOARD CURSOS
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update(time, delta) {
    if (this.input.keyboard.checkDown(this.cursors.space, 250)) {
      this.scene.start("Firstscene");
    }
  }
}

export default Intro;
