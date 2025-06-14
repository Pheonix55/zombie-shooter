

export default class Entity extends Phaser.Physics.Arcade.Sprite {

    /**
     * scene: Phaser.Scene
     * x, y: spawn coords
     * textureKey: the key used in preload (e.g. 'player', 'enemy1')
     * animations: an object defining state → frame ranges, e.g.
     *   { idle: { start: 0, end: 3, frameRate: 6, repeat: -1 },
     *     run:  { start: 4, end: 9, frameRate: 10, repeat: -1 },
     *     attack: { start: 10, end: 15, frameRate: 12, repeat: 0 }, ... }
     */
    constructor(scene, x, y, textureKey, animations) {
        super(scene, x, y, textureKey);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);

        this.textureKey = textureKey;
        this.animConfigs = animations; // store config to create animations
        this.state = 'idle';
        this.isBusy = false; // e.g. attacking or hurt, non-interruptible
        this.facing = 'right';
        // Create animations for this texture if not already created globally
        this.createAnimations(scene);

        // Listen to animationcomplete to reset busy flags
        // this.on('animationcomplete', (anim) => {
        //     const key = anim.key;
        //     // e.g. 'player_attack' or 'enemy1_hurt'
        //     if (key === `${this.textureKey}_attack` || key === `${this.textureKey}_hurt`) {
        //         this.isBusy = false;
        //         this.playStateAnimation(); // resume appropriate anim
        //     }
        //     if (key === `${this.textureKey}_death`) {
        //         this.disableBody(true, false);
        //     }
        // });
        this.on('animationcomplete', (anim) => {
            if (!anim || !anim.key) return;
            const key = anim.key;
            if (key === `${this.textureKey}_attack` || key === `${this.textureKey}_hurt`) {
                this.isBusy = false;
                this.playStateAnimation();
            }
            if (key === `${this.textureKey}_death`) {
                this.disableBody(true, false);
            }
        });





    }

    createAnimations(scene) {


        for (const [state, cfg] of Object.entries(this.animConfigs)) {
            const animKey = `${this.textureKey}_${state}`;
            if (scene.anims.exists(animKey)) continue;
            scene.anims.create({
                key: animKey,
                frames: scene.anims.generateFrameNumbers(this.textureKey, { start: cfg.start, end: cfg.end }),
                frameRate: cfg.frameRate,
                repeat: cfg.repeat
            });
        }
    }

    playStateAnimation() {
        if (this.isBusy) return;
        const animKey = `${this.textureKey}_${this.state}`;
        if (!this.scene.anims.exists(animKey)) {
            this.state = 'idle';
        }
        const toPlay = `${this.textureKey}_${this.state}`;
        if (this.anims.currentAnim?.key !== toPlay) {
            this.play(toPlay, true);
        }
    }

    setState(newState) {
        if (this.state === newState) return;
        this.state = newState;
        this.playStateAnimation();
    }

    faceDirection(dir) {
        // dir: 'left' or 'right'
        this.facing = dir;
        this.setFlipX(dir === 'left');
    }

    attack() {
        if (this.isBusy) return;
        if (!this.scene.anims.exists(`${this.textureKey}_attack`)) return;
        this.isBusy = true;
        this.state = 'attack';
        this.play(`${this.textureKey}_attack`);
    }

    hurt() {
        if (this.isBusy) return;
        if (!this.scene.anims.exists(`${this.textureKey}_hurt`)) return;
        this.isBusy = true;
        this.state = 'hurt';
        this.play(`${this.textureKey}_hurt`);
    }

    die() {
        if (!this.scene.anims.exists(`${this.textureKey}_death`)) return;

        this.isBusy = true;
        this.state = 'death';
        this.play(`${this.textureKey}_death`);

        this.once('animationcomplete', () => {
            this.scene.time.delayedCall(5000, () => {
                if (this.isPlayer) {
                    this.isDead = true;
                    this.body.enable = false;
                    this.scene.handlePlayerDeath();
                } else {
                    this.destroy();
                }
            });
        });
    }


}
