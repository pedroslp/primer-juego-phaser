import Firstscene from "./scenes/firstScene.js";
import Intro from "./scenes/intro.js";

const config = {
  pixelArt: true,

  type: Phaser.AUTO,
  backgroundColor: "#D6EAF8",
  scale: {
    width: 900,
    height: 360,
    parent: "container",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
  },

  banner: {
    hidePhaser: true,
    text: "#000000",
    background: ["red", "yellow", "red", "transparent"],
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },

  scene: [Intro, Firstscene],
};

const game = new Phaser.Game(config);
