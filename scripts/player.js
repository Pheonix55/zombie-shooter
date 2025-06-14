import Entity from './entity.js';

export default class Player extends Entity {

    constructor(scene, x, y, textureKey, animations) {
        super(scene, x, y, textureKey, animations);
        this.max_health = 10;
        this.health = this.max_health;

        this.body.setSize(this.width * 0.2, this.height * 0.6);
        this.body.setOffset(this.width * 0.4, this.height * 0.4);



        // input keys
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.keys = scene.input.keyboard.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            D: Phaser.Input.Keyboard.KeyCodes.D
        });
        // bullets group should be created in scene and passed or referenced
        this.bullets = scene.bulletsGroup; // assume scene has bulletsGroup
        this.lastFired = 0;
        this.isPlayer = true;
        this.isDead = false;

    }

    update(time) {

        if (this.isDead) return;
        // if (this.state === 'death') return;
        if (!this.isBusy) {




            // handle movement
            const speed = 200;
            let vx = 0, vy = 0;
            if (this.cursors.left.isDown || this.keys.A.isDown) {
                vx = -speed; this.faceDirection('left');
            } else if (this.cursors.right.isDown || this.keys.D.isDown) {
                vx = speed; this.faceDirection('right');
            }
            if (this.cursors.up.isDown || this.keys.W.isDown) {
                vy = -speed;
            } else if (this.cursors.down.isDown || this.keys.S.isDown) {
                vy = speed;
            }
            this.setVelocity(vx, vy);
            if (vx !== 0 || vy !== 0) {
                this.setState('run');
            } else {
                this.setState('idle');
            }
        } else {
            // optionally lock movement during attack
            // this.setVelocity(0);
        }

        this.lastFired = time < this.lastFired ? this.lastFired : this.lastFired;
    }



    shoot(pointer) {
        if (this.isDead) return;
        const now = this.scene.time.now;
        const fireRate = 100;
        if (now < this.lastFired) return;

        const bullet = this.bullets.get();
        if (!bullet) return;

        if (!bullet.body) {
            this.scene.physics.add.existing(bullet);
        }

        bullet.setTexture('bullet')
            .setActive(true)
            .setVisible(true)
            .setPosition(this.x, this.y + 15) // adjust if needed
            .setScale(0.1)
            .setOrigin(0.5);
        // bullet.body.setSize(width, height).setOffset(x, y);

        const direction = pointer.worldX < this.x ? -1 : 1;
        const speed = 500;

        bullet.setVelocity(direction * speed, 0); // horizontal only
        this.scene.sfx.shoot.play();
        // Add penetration logic
        bullet.penetration = this.bulletPenetration || 0;  // customizable
        bullet._penetrated = 0;

        this.scene.time.delayedCall(2000, () => {
            bullet.setActive(false).setVisible(false);
        });

        this.lastFired = now + fireRate;
    }


    takeDamage(amount) {
        if (this.state === 'death') return;
        this.scene.updateHealthBar(this.health, this.maxHealth);
        this.health -= amount;
        Phaser.Utils.Array.GetRandom(this.scene.sfx.zombieGrowls).play();
        this.scene.sfx.playerHurt.play();

        if (this.health > 0) {
            this.hurt();
        } else {
            this.die();
        }
    }

}
