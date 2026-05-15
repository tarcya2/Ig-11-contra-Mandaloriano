const config = {
    type: Phaser.AUTO,
    width: 1820, 
    height: 900,
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 0},
            debug: false,
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
}

const game = new Phaser.Game(config);

let player;
let cursors;
let enemy;
let bullets;
let playerBullets

function preload(){
    // Carregar uma imagem (sprite do personagem)
    this.load.image('player', 'ig11.png');
    this.load.image('enemy', 'mandalorian.png');
    this.load.image('enemyBullet', 'blue.png');
    this.load.image('playerBullet', 'red.png');
}

function create(){
    // Adicionando o personagem ao jogo com física ativada
    player = this.physics.add.sprite(300, 300, 'player');

    // Reduzindo o tamanho do jogador para 50% (0.5x)
    player.setScale(0.5);
    
    // Colisão do personagem
    player.setCollideWorldBounds(true);

    // Adicionando o inimigo ao jogo com física ativada
    enemy = this.physics.add.sprite(1500, 300, 'enemy');

    // Reduzindo o tamanho do inimigo para 50% (0.5x)
    enemy.setScale(0.5);

     // Colisão do inimigo
    enemy.setCollideWorldBounds(true);
    enemy.setBounce(1);

    enemy.setVelocityY(550);

    bullets = this.physics.add.group();
    this.time.addEvent({
        delay: 2000,
        callback: shootBullet,
        callbackScope: this,
        loop: true,
    })

    this.physics.add.overlap(player, bullets, hitPlayer, null, this);

    playerBullets = this.physics.add.group();
    /*
    this.time.addEvent({
        delay: 2000,
        callback: shootBullet,
        callbackScope: this,
        loop: true,
    })
    */
    this.physics.add.overlap(
        playerBullets,
        enemy,
        hitEnemy,
        null,
        this);

    // Criando controles de teclado
    cursors = this.input.keyboard.createCursorKeys();

    keySpace = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE
    )
}

function update(){
    // Movimentação do personagem
    if (cursors.up.isDown) {
        player.y -= 3;
    } else if (cursors.down.isDown) {
        player.y += 3;
    }
    if (Phaser.Input.Keyboard.JustDown(keySpace)){
        shootBulletPlayer()
    }
    playerBullets.children.iterate(function(bullet){
        if (bullet && bullet.x > 2000){
            bullet.destroy();
        }
    });
}

function shootBullet(){
    let bullet = bullets.create(enemy.x -50, enemy.y, "enemyBullet");
    bullet.setScale(0.2)
    bullet.body.allowGravity = false;
    bullet.setVelocityX(-400);
}

function hitPlayer(player, bullet){
    bullet.destroy();
    player.setTint(0xff0000);
    console.log("Jogador atingido!!")
    setTimeout(() => {
        player.clearTint();
    }, 200)
}

function shootBulletPlayer(scene){
    const bulletPlayer = playerBullets.create(player.x, enemy.y, "playerBullet")
    bullet.setScale(0.2)
    bullet.body.allowGravity = false;
    bullet.setVelocityX(400);
}
function hitEnemy(bullett, enemy){
    bullet.destroy();

}