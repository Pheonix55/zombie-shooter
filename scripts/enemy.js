import Entity from './entity.js';

export default class Enemy extends Entity {


    constructor(scene, x, y, textureKey, animConfigs, health) {
        super(scene, x, y, textureKey, animConfigs, health);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        // animConfigs = animConfigs;
        this.isPlayer = false;
        this.scene = scene;
        this.textureKey = textureKey;
        this.state = 'idle';
        // this.health = 3;
        this.health = health;
        this.isBusy = false;
        this.facing = 'right';
        this.body.setSize(this.width * 0.2, this.height * 0.6);
        this.body.setOffset(this.width * 0.4, this.height * 0.4);

        this.body.setCollideWorldBounds(true);
        this.createAnimations(scene);
    }

    update() {
        const player = this.scene.player;
        if (!player || this.state === 'death') return;
        if (this.state === 'death') return;
        // Simple chase AI
        const dist = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
        if (dist < 200 && dist > 50) {
            // chase
            const angle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
            const speed = 100;
            this.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
            this.faceDirection(player.x < this.x ? 'left' : 'right');
            this.setState('move'); // assume animConfigs has 'move'
        } else if (dist <= 50) {
            // close enough to attack
            this.setVelocity(0);
            if (!this.isBusy) {
                this.attack();
                player.takeDamage(1);
            }
        } else {
            this.setVelocity(0);
            this.setState('idle');
        }
        // death check
        if (this.health <= 0 && this.state !== 'death') {
            this.die();
        }

    }

    takeDamage(amount) {
        console.log('Enemy health', this.health);
        if (this.state === 'death') return;
        this.scene.sfx.zombieHit.play();

        this.health -= amount;
        console.log('after being attacked ', this.health)
        if (this.health > 0) {
            this.hurt();
        } else {
            this.scene.sfx.zombieDead.play();
            this.die();
        }
    }
    playAttackSound() {
        Phaser.Utils.Array.GetRandom(this.scene.sfx.zombieGrowls).play();
    }
}
