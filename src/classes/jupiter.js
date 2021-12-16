export default class Jupiter extends Phaser.Physics.Arcade.Group {
  constructor(physicsWorld, scene) {
    super(physicsWorld, scene);
  }

  newItem() {
    this.create(Phaser.Math.Between(0, this.scene.scale.width), 80, "jupiter")
      .setActive(true)
      .setVisible(true)
      .setGravityY(350)
      .setCollideWorldBounds(true)
      .setDepth(2)
      .setCircle(32)
      .setBounce(1, 1)
      .setVelocityX(Phaser.Math.Between(0, 1) ? 120 : -120).hitsToKill = 3;
  }
}
