import Enemy from './enemy.js';
import Player from './player.js';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');

    this.maxEnemies = 10;
  }

  preload() {
    this.load.spritesheet('player', 'assets/player.png', {
      frameWidth: 128,
      frameHeight: 128
    });

    this.load.spritesheet('enemy1', 'assets/enemy.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('enemy2', 'assets/enemy2.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('enemy3', 'assets/enemy3.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('enemy4', 'assets/enemy4.png', { frameWidth: 128, frameHeight: 128 });
    this.load.image('bullet', 'assets/bullet.png');

    // sounds

    this.load.audio('shoot', 'assets/sfx/shoot.mp3');
    this.load.audio('Z_hit', 'assets/sfx/hurt_z.wav');
    this.load.audio('hurt', 'assets/sfx/blood_pop.wav');
    this.load.audio('zombie_growl_1', 'assets/sfx/z_g_1.wav');
    this.load.audio('zombie_growl_2', 'assets/sfx/z_g_2.wav');
    this.load.audio('zombie_growl_3', 'assets/sfx/z_g_3.wav');
    this.load.audio('zombie_growl_4', 'assets/sfx/z_g_4.wav');
    this.load.audio('zombie_growl_5', 'assets/sfx/z_g_5.wav');
    this.load.audio('background_music', 'assets/sfx/bg.wav');
    this.load.audio('bullet_hit', 'assets/sfx/hurt_by_bullet.mp3');
    this.load.audio('dead_zombie', 'assets/sfx/dead_z.mp3');
  }

  create() {
    const playerAnims = {
      idle: { start: 0, end: 6, frameRate: 6, repeat: -1 },     // idle: slower breathing motion
      run: { start: 7, end: 14, frameRate: 14, repeat: -1 },   // run: fast and responsive
      attack: { start: 19, end: 22, frameRate: 16, repeat: 0 },   // attack: snappy
      hurt: { start: 23, end: 25, frameRate: 10, repeat: 0 },   // hurt: visible but short
      death: { start: 26, end: 29, frameRate: 6, repeat: 0 }     // death: dramatic, slower
    };
    const enemy1Anims = {
      idle: { start: 0, end: 5, frameRate: 4, repeat: -1 },      // idle: zombie-like slow
      move: { start: 6, end: 15, frameRate: 10, repeat: -1 },    // move: shuffle walk
      attack: { start: 16, end: 20, frameRate: 12, repeat: 0 },    // attack: a bit aggressive
      hurt: { start: 21, end: 24, frameRate: 10, repeat: 0 },    // hurt: quick
      death: { start: 25, end: 29, frameRate: 6, repeat: 0 }      // death: slow fall
    };

    const enemy2Anims = {
      idle: { start: 0, end: 5, frameRate: 3, repeat: -1 },  // very slow idle
      move: { start: 6, end: 15, frameRate: 6, repeat: -1 },  // slow shuffle
      attack: { start: 16, end: 20, frameRate: 10, repeat: 0 },  // normal attack
      hurt: { start: 21, end: 24, frameRate: 14, repeat: 0 },  // faster hurt feedback
      death: { start: 25, end: 29, frameRate: 5, repeat: 0 }   // slow death fall
    };

    const enemy3Anims = {
      idle: { start: 0, end: 5, frameRate: 3, repeat: -1 },  // idle same as above
      move: { start: 6, end: 15, frameRate: 8, repeat: -1 },  // medium-fast shuffle
      attack: { start: 16, end: 19, frameRate: 12, repeat: 0 },  // aggressive hit
      hurt: { start: 20, end: 23, frameRate: 14, repeat: 0 },  // fast reaction
      death: { start: 23, end: 28, frameRate: 5, repeat: 0 }   // dramatic collapse
    };

    const enemy4Anims = {
      idle: { start: 0, end: 6, frameRate: 4, repeat: -1 },  // slightly more active
      move: { start: 7, end: 18, frameRate: 9, repeat: -1 },  // smooth lurching
      attack: { start: 19, end: 20, frameRate: 8, repeat: 0 },  // short animation, reduce rate
      hurt: { start: 21, end: 30, frameRate: 12, repeat: 0 },  // long sequence, decent speed
      death: { start: 29, end: 33, frameRate: 5, repeat: 0 }   // drawn-out death
    };

    this.bulletsGroup = this.physics.add.group({
      classType: Phaser.Physics.Arcade.Image,
      maxSize: 20,
      runChildUpdate: false
    });

    this.player = new Player(this, 400, 300, 'player', playerAnims);

    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true,
    });
    const e1 = new Enemy(this, 600, 300, 'enemy1', enemy1Anims, 5);
    const e2 = new Enemy(this, 700, 100, 'enemy2', enemy2Anims, 7);
    const e3 = new Enemy(this, 100, 700, 'enemy3', enemy3Anims, 10);
    const e4 = new Enemy(this, 600, 600, 'enemy4', enemy4Anims, 15);
    this.enemies.add(e1, true);
    this.enemies.add(e2, true);
    this.enemies.add(e3, true);
    this.enemies.add(e4, true);


    // Sound effects
    this.sfx = {
      shoot: this.sound.add('shoot', { volume: 0.6 }),
      zombieHit: this.sound.add('bullet_hit', { volume: 0.6 }),
      zombieDead: this.sound.add('dead_zombie', { volume: 0.6 }),
      // zombieHit: this.sound.add('Z_hit', { volume: 0.6 }),
      playerHurt: this.sound.add('hurt', { volume: 0.9 }),
      // playerHurt: this.sound.add('hurt', { volume: 0.9 }),
      zombieGrowls: [
        this.sound.add('zombie_growl_1', { volume: 0.3 }),
        this.sound.add('zombie_growl_2', { volume: 0.3 }),
        this.sound.add('zombie_growl_3', { volume: 0.3 }),
        this.sound.add('zombie_growl_4', { volume: 0.3 }),
        this.sound.add('zombie_growl_5', { volume: 0.3 }),
      ],
      music: this.sound.add('background_music', { loop: true, volume: 0.9 })
    };

    // Start background music
    this.sfx.music.play();

    const enemyTypes = [
      { class: Enemy, key: 'enemy1', anims: enemy1Anims, health: 5, weight: 4 },
      { class: Enemy, key: 'enemy2', anims: enemy2Anims, health: 7, weight: 3 },
      { class: Enemy, key: 'enemy3', anims: enemy3Anims, health: 10, weight: 2 },
      { class: Enemy, key: 'enemy4', anims: enemy4Anims, health: 15, weight: 1 },
    ];
    this.createHealthBar();

    function getRandomEnemyType() {
      const pool = [];

      enemyTypes.forEach(type => {
        for (let i = 0; i < type.weight; i++) {
          pool.push(type);
        }
      });

      const randIndex = Phaser.Math.Between(0, pool.length - 1);
      return pool[randIndex];
    }
    function spawnEnemy(scene, x, y) {
      if (scene.enemies.countActive(true) >= scene.maxEnemies) return;

      const enemyType = getRandomEnemyType();
      const enemy = new enemyType.class(scene, x, y, enemyType.key, enemyType.anims, enemyType.health);

      scene.add.existing(enemy);
      scene.physics.add.existing(enemy);
      scene.enemies.add(enemy);
    }

    this.time.addEvent({
      delay: 2000,
      callback: () => {
        const x = Phaser.Math.Between(100, 700);
        const y = Phaser.Math.Between(100, 500);
        spawnEnemy(this, x, y);
      },
      loop: true
    });


    this.physics.add.overlap(this.bulletsGroup, this.enemies, (bullet, enemy) => {
      if (!bullet.active || !enemy.active) return;

      enemy.takeDamage(1);

      bullet._penetrated = (bullet._penetrated || 0) + 1;

      if (bullet.penetration === 0 || bullet._penetrated > bullet.penetration) {
        bullet.setActive(false).setVisible(false);
        bullet.body.setVelocity(0);
      }
    });


    this.physics.add.overlap(this.player, this.enemies, (player, enemy) => {
      if (!enemy.isBusy && enemy.state !== 'death') {
        enemy.attack();
        player.takeDamage?.(1);
      }
    });
    // Mouse attack
    this.isShooting = false;

    this.input.on('pointerdown', pointer => {
      this.isShooting = true;
    });

    this.input.on('pointerup', pointer => {
      this.isShooting = false;
    });

  }
  createHealthBar() {
    this.healthBar = [];

    const barX = 20;
    const barY = 20;
    const spacing = 4;
    const width = 16;
    const height = 16;

    for (let i = 0; i < this.player.max_health; i++) {
      const unit = this.add.rectangle(
        barX + i * (width + spacing),
        barY,
        width,
        height,
        0xff0000
      ).setStrokeStyle(1, 0xffffff);
      this.healthBar.push(unit);
    }
  }

  updateHealthBar() {
    for (let i = 0; i < this.healthBar.length; i++) {
      if (i < this.player.health) {
        this.healthBar[i].setVisible(true);
      } else {
        this.healthBar[i].setVisible(false);
      }
    }
  }
  // handlePlayerDeath() {
  //   this.physics.pause();
  //   this.scene.pause();

  //   if (this.sfx && this.sfx.music) {
  //     this.sfx.music.stop();
  //   }

  //   const { width, height } = this.scale;
  //   this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.6);

  //   this.add.text(width / 2, height / 2 - 50, 'Game Over', {
  //     fontSize: '48px',
  //     color: '#ffffff'
  //   }).setOrigin(0.5);

  //   const restartBtn = this.add.text(width / 2, height / 2 + 20, 'Restart', {
  //     fontSize: '32px',
  //     backgroundColor: '#ffffff',
  //     color: '#000000',
  //     padding: { x: 20, y: 10 }
  //   }).setOrigin(0.5).setInteractive();

  //   restartBtn.on('pointerdown', () => {
  //     this.scene.restart();
  //   });
  // }


  handlePlayerDeath() {
    this.physics.pause(); // Stop physics
    this.scene.pause();   // Pause the scene

    const width = this.scale.width;
    const height = this.scale.height;

    this.gameOverText = this.add.text(width / 2, height / 2 - 50, 'Game Over', {
      fontSize: '32px',
      color: '#fff'
    }).setOrigin(0.5);

    this.restartButton = this.add.text(width / 2, height / 2 + 20, 'Restart', {
      fontSize: '24px',
      backgroundColor: '#000',
      color: '#fff',
      padding: { x: 10, y: 5 },
      border: 2
    })
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => {
        // this.scene.stop();
        // this.scene.start(this.scene.key);
        window.reload();
      });
  }


  update(time, delta) {
    this.player.update(time, delta);
    this.enemies.children.iterate(enemy => {
      if (enemy && enemy.active) {
        enemy.update(time, delta);
      }

    });

    if (this.isShooting) {
      this.player.attack();
      this.player.shoot(this.input.activePointer);
    }
    this.updateHealthBar();
    const pointer = this.input.activePointer;
    const dx = pointer.worldX - this.player.x;
    this.player.flipX = dx < 0;


  }
}


// 884 - 1412

// 528