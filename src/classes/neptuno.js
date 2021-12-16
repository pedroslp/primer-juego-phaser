export default class Neptuno extends Phaser.Physics.Arcade.Group {
  constructor(physicsWorld, scene) {
    super(physicsWorld, scene);
  }

  newItem() {
    this.create(Phaser.Math.Between(0, this.scene.scale.width), 20, "neptuno")
      .setActive(true)
      .setVisible(true)
      .setGravityY(300)
      .setCollideWorldBounds(true)
      .setDepth(2)
      .setCircle(32)
      .setBounce(1, 1)
      .setVelocityX(Phaser.Math.Between(0, 1) ? 100 : -100).hitsToKill = 1;
  }
}
