const config = {
    type: Phaser.AUTO,
    width: 1820, 
    height: 900,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
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
let playerBullets;
let playerLifes = 3;
let gameOver = false;
let score = 0;
let scoreText;
let lifeText;
let enemyLifeText;
let endText;

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
    enemy.life = 5;
     // Colisão do inimigo
    enemy.setCollideWorldBounds(true);
    enemy.setImmovable(true);
    enemy.body.allowGravity = false;
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
    );

    // Criando controles de teclado
    cursors = this.input.keyboard.createCursorKeys();

    keySpace = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE
    )
    scoreText = this.add.text(20, 20, "score: 0", {fontSize: "32px", color: "#ffffff"})
    lifeText = this.add.text(20, 60, "life: 3", {fontSize: "32px", color: "#ffffff"})
    enemyLifeText = this.add.text(1550, 20, "enemy life: "+ enemy.life, {fontSize: "32px", color: "#ffffff"})
    endText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "",{fontSize: "64px", color: "#e9e913", fontStyle: "bold"});
    endText.setOrigin(0.5);
}

function update(){
    if (gameOver){
        return;
    }
    if(!player.active){
        return;
    }
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
    if (gameOver){
        return;
    }
    if (!enemy.active){
        return;
    }
    let bullet = bullets.create(enemy.x -50, enemy.y, "enemyBullet");
    bullet.setScale(0.2)
    bullet.body.allowGravity = false;
    bullet.setVelocityX(-400);
}

function hitPlayer(player, bullet){
    bullet.destroy();
    playerLifes--;
    lifeText.setText("life: "+ playerLifes);
    console.log("Vidas do Jogador", playerLifes);
    player.setTint(0xff0000);
    console.log("Jogador atingido!!")
    setTimeout(() => {
        player.clearTint();
    }, 200);
    if (playerLifes <= 0){
        gameOver = true;
        enemy.setVelocity(0, 0);
        enemy.body.enable = false;
        player.disableBody(true, true);
        console.log("Game Over");
        endText.setText("Game Over!");
    }
}

function shootBulletPlayer(scene){
    if (!player.active){
        return;
    }
    const bulletPlayer = playerBullets.create(player.x, player.y, "playerBullet")
    bulletPlayer.setScale(0.15)
    bulletPlayer.body.allowGravity = false;
    bulletPlayer.body.immovable = true;
    bulletPlayer.setVelocityX(400);
}
function hitEnemy(ememy, bullet){

    //bullet.destroy();
    bullet.disableBody(true, true)
    enemy.life--;
    enemyLifeText.setText("enemy life: "+ enemy.life);
    score += 10;
    scoreText.setText("score: "+score);
    console.log ("Vida do Inimigo:", enemy.life);
    
    enemy.setTint(0xff0000);
    enemy.scene.time.delayedCall(100, () => {
        if (enemy.active){
            enemy.clearTint();
        }
        
    });

    if (enemy.life <= 0){
        enemy.destroy();
        console.log("Inimigo Derrotado!")  
         endText.setText("You Win!"); 
    }

}