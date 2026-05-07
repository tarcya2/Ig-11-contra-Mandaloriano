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

function preload(){
    // Carregar uma imagem (sprite do personagem)
    this.load.image('player', 'ig11.png');
    this.load.image('enemy', 'mandalorian.png');;
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

    // Criando controles de teclado
    cursors = this.input.keyboard.createCursorKeys();

    // Colisão do inimigo
    enemy.setCollideWorldBounds(true);
}

function update(){
    // Movimentação do personagem
    if (cursors.up.isDown) {
        player.y -= 3;
    } else if (cursors.down.isDown) {
        player.y += 3;
    }

    // Movimentação do inimigo
    
}
