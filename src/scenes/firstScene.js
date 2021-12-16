import Sol from "../classes/sol.js";
import Jupiter from "../classes/jupiter.js";
import Player from "../classes/player.js";
import Bullet from "../classes/bullet.js";
import Powerup from "../classes/powerup.js";
import Neptuno from "../classes/neptuno.js";

class Firstscene extends Phaser.Scene {
  constructor() {
    super("Firstscene");
  }

  init() {
    this.respawn = 0;
    this.respawnInterval = 3000;
    this.scoreText = "";
    this.score = 0;
    this.lifesCounter = 3;
    this.lifesText = "";
    this.newLife = 250;
    this.enemiesGlobalCounter = 0;
    this.invincible = false;
    this.ammo = 30;
    this.ammoText = "";
    this.powerupCounter = 0;
  }

  preload() {
    this.load.path = "./assets/";

    // LOAD IMAGES AND SPRITES
    this.load
      .image("background", "backgrounds/background.jpeg")
      .image("jupiter", "sprites/jupiter.png")
      .image("sol", "sprites/sol.png")
      .image("bullet", "sprites/bullet.png")
      .image("life", "sprites/life.png")
      .image("powerup", "sprites/powerup.png")
      .image("reload", "sprites/reload.png")
      .image("gun", "sprites/gun.png")
      .image("neptuno", "sprites/neptuno.png")
      .spritesheet("playersprite", "sprites/playersprite.png", {
        frameWidth: 50,
        frameHeight: 66,
      });

    // LOAD AUDIOS
    this.load
      .audio("pop", ["sounds/pop.mp3"])
      .audio("shot", ["sounds/shot.wav"])
      .audio("killed", ["sounds/killed.wav"])
      .audio("recharge", ["sounds/recharge.wav"])
      .audio("rebound", ["sounds/rebound.wav"])
      .audio("rebound_sol", ["sounds/rebound_sol.mp3"])
      .audio("rebound_jupiter", ["sounds/rebound_jupiter.mp3"]);
  }

  create() {
    // TEXTS
    this.scoreText = this.add.text(
      this.sys.game.canvas.width / 2 - 50,
      0,
      "SCORE: " + this.score,
      { fontStyle: "strong", font: "20px Cascadia Code", fill: "#5D1871" }
    );
    this.scoreText.setDepth(1);
    this.lifesText = this.add.text(20, 12, "x " + this.lifesCounter, {
      fontStyle: "strong",
      align: "right",
      font: "20px Cascadia Code",
      fill: "beige",
    });
    this.lifesText.setDepth(1);
    this.ammoText = this.add.text(
      this.sys.game.canvas.width - 120,
      10,
      "AMMO: " + this.ammo,
      {
        fontStyle: "strong",
        align: "right",
        font: "20px Cascadia Code",
        fill: "#5D1871",
      }
    );
    this.ammoText.setDepth(1);

    // CREATE AUDIOS
    this.popSound = this.sound.add("pop");
    this.shotSound = this.sound.add("shot");
    this.killedSound = this.sound.add("killed");
    this.rechargeSound = this.sound.add("recharge");
    this.reboundSound = this.sound.add("rebound");
    this.rebound_sol = this.sound.add("rebound_sol");
    this.rebound_jupiter = this.sound.add("rebound_jupiter");

    // CREATE KEYBOARD CURSOS
    this.cursors = this.input.keyboard.createCursorKeys();

    // CREATE SPRITES
    this.background = this.add.image(
      this.sys.game.canvas.width / 2,
      this.sys.game.canvas.height / 2,
      "background"
    );
    this.lifeSprite = this.add.image(37, 53, "life").setDepth(1);
    this.gunImage = this.physics.add
      .image(40, this.sys.game.canvas.height - 30, "gun")
      .setActive(true)
      .setDepth(1)
      .setVisible(false);
    this.reloadImage = this.add.image(
      50,
      this.sys.game.canvas.height - 80,
      "reload"
    );
    this.reloadImage.setVisible(false);

    // PLAYER
    this.player = new Player(
      this,
      this.sys.game.canvas.width / 2,
      this.sys.game.canvas.height,
      "playersprite"
    );

    // GROUPS
    this.neptunoGroup = new Neptuno(this.physics.world, this);
    this.jupiterGroup = new Jupiter(this.physics.world, this);
    this.solGroup = new Sol(this.physics.world, this);
    this.bulletsGroup = new Bullet(this.physics.world, this);
    this.powerupGroup = new Powerup(this.physics.world, this);

    // ADD COLIDERS BETWEEN SPRITES
    this.physics.add.overlap(
      this.player,
      [this.neptunoGroup, this.jupiterGroup, this.solGroup, this.powerupGroup],
      this.hitPlayer,
      null,
      this
    );
    this.physics.add.collider(
      this.bulletsGroup,
      [this.neptunoGroup, this.jupiterGroup, this.solGroup],
      this.hitEnemies,
      null,
      this
    );
    this.physics.add.collider(
      this.bulletsGroup,
      this.powerupGroup,
      this.hitPowerup,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.gunImage,
      this.reloadAmmo,
      null,
      this
    );
  }

  update(time) {
    //  ENEMIES RESPAWN CONTROL AFTER GAME OVER
    if (time > this.respawnInterval && this.respawn == 0) {
      this.respawn = Math.trunc(time);
    }

    if (time > this.respawn) {
      // POWERUP
      if (
        this.enemiesGlobalCounter % 15 == 0 &&
        this.enemiesGlobalCounter != 0
      ) {
        this.powerupGroup.newItem();
      }

      if (
        this.enemiesGlobalCounter % 5 == 0 &&
        this.enemiesGlobalCounter != 0
      ) {
        if (this.respawnInterval > 600) {
          this.respawnInterval -= 100;
        }

        this.addEnemy(0);
      } else {
        this.addEnemy(2);
      }

      if (
        this.enemiesGlobalCounter % 7 == 0 &&
        this.enemiesGlobalCounter != 0
      ) {
        if (this.respawnInterval > 600) {
          this.respawnInterval -= 100;
        }

        this.addEnemy(1);
      }
      this.respawn += this.respawnInterval;
    }

    // INPUT CONTROL
    if (this.input.keyboard.checkDown(this.cursors.space, 250)) {
      this.player.setVelocity(0, 0).anims.play("turn");
      this.fire();
    } else if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160).anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160).anims.play("right", true);
    } else {
      this.player.setVelocityX(0).anims.play("turn");
    }
  }

  // RELOAD AMMO
  reloadAmmo() {
    if (this.ammo === 0) {
      this.ammo = 30;
      this.rechargeSound.play();
      var randomX = Phaser.Math.Between(40, this.sys.game.canvas.width - 50);
      this.reloadImage.setX(randomX).setActive(false).setVisible(false);
      this.gunImage.setX(randomX).setActive(false).setVisible(false);
      this.ammoText.setText("AMMO: " + this.ammo);
    }
  }

  // HIT PLAYER
  hitPlayer(player, enemy) {
    if (!this.invincible) {
      this.invincible = true;
      this.killedSound.play();
      this.lifesCounter--;
      this.lifesText.setText("X " + this.lifesCounter);
      enemy.destroy();
      player.setTint(0xe74c3c);
      this.time.addEvent({
        delay: 450,
        callback: () => {
          this.invincible = false;
          player.clearTint();
        },
      });

      if (this.lifesCounter == 0) {
        this.neptunoGroup.clear(true, true);
        this.jupiterGroup.clear(true, true);
        this.solGroup.clear(true, true);
        this.bulletsGroup.clear(true, true);
        // this.scene.restart();
        this.scene.start("Intro");
      }
    }
  }

  // HIT ENEMIES
  hitEnemies(bullet, enemy) {
    bullet.setVisible(false);
    bullet.setActive(false);
    bullet.destroy();

    enemy.hitsToKill--;

    if (enemy.hitsToKill == 0) {
      enemy.destroy();
      this.popSound.play();
      this.score += 10;
      this.scoreText.setText("SCORE: " + this.score);

      if (this.score % this.newLife == 0) {
        this.lifesCounter++;
        this.lifesText.setText("X " + this.lifesCounter);
      }
    }
  }

  // HIT POWERUP
  hitPowerup(bullet, bubble) {
    this.hitEnemies(bullet, bubble);
    this.powerupCounter = 10;
  }

  // ADD ENEMIES
  addEnemy(type) {
    this.enemiesGlobalCounter++;

    switch (type) {
      case 0:
        this.rebound_jupiter.play();
        this.jupiterGroup.newItem();
        break;
      case 1:
        this.rebound_sol.play();
        this.solGroup.newItem();
      default:
        this.reboundSound.play();
        this.neptunoGroup.newItem();
    }
  }

  // FIRE
  fire() {
    if (this.ammo >= 1 && this.powerupCounter === 0) {
      this.bulletsGroup.newItem();
      this.shotSound.play();
      this.ammo--;
      this.ammoText.setText("AMMO: " + this.ammo);
    }

    if (this.ammo == 0 && this.powerupCounter === 0) {
      this.reloadImage.setVisible(true).setActive(true);
      this.gunImage.setVisible(true).setActive(true);
    }

    if (this.powerupCounter > 0) {
      this.bulletsGroup.newDoubleItem();
      this.shotSound.play();
      this.powerupCounter--;
    }
  }
}

export default Firstscene;
