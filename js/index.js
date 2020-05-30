import star from './item/star.js'

let gameSize = {
    w: 800, h: 600
};


var config = {
    type: Phaser.AUTO,
    scale: {
        width: gameSize.w,
        height: gameSize.h,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    audio: {
        disableWebAudio: true
    }
};



document.body.style.backgroundColor = "green";        


// <전역 변수 선언>
var game = new Phaser.Game(config);

var player;
var dead_chicken;
var FireList = [];
var tweenN = [];

var retry_on = false;
var retry_on_2 = false;
var retry_picture;
var background_1;
var start;

var i=0;
var bool = true;
var random = 0;
var delay = 3000;

var retry = undefined;  

var contWidth = undefined;
var scoreWidth = undefined;

var score = {};
score.self = undefined;
score.num = 0;
score.gap = 1;
score.toggle = false;
score.best = [0, 0, 0];
score.bestTxt = [];

var Touch_stick_x = 0;
var Touch_stick_y = 0;

var levelTexture = [];

var test_music = undefined;

var rank_block = [];
var rank_cont = [];

var playing_music = undefined;
var ghost_music = undefined;

var rank_music1 = undefined;
var rank_music2 = undefined;
var rank_music3 = undefined;


var item_star = undefined;
// <!전역 변수 선언>

// <preload>
function preload(){
    this.load.image('Fire', './assets/image/jin_fire_1.png');
    this.load.image('chicken', './assets/image/jin_chicken_s.png');
    this.load.image('deadChicken', './assets/image/jin_deadChicken.png')
    this.load.image('background', './assets/image/jin_Grill_1.png');
    this.load.image('retry_picture', './assets/image/retry_picture.png');
    this.load.image('rank_block', './assets/image/rank_block.png')

    this.load.audio('theme', './assets/audio/start_ting.wav');
    this.load.audio('ghost', './assets/audio/ghost_song.mp3');
    this.load.audio('tetris', './assets/audio/tetris_song.mp3');
    this.load.audio('rank1', './assets/audio/Pickup_coin_rank1.wav');
    this.load.audio('rank2', './assets/audio/Pickup_coin_rank2.wav');
    this.load.audio('rank3', './assets/audio/Pickup_coin_rank3.wav');


    item_star = new star(this, gameSize);
}
// <!preload>

// <create>
function create() 
{
    // <background, start, retry, score, player, Fire 생성>
    test_music = this.sound.add('theme'); 
    ghost_music = this.sound.add('ghost');
    playing_music = this.sound.add('tetris');
    rank_music1 = this.sound.add('rank1');
    rank_music2 = this.sound.add('rank2');
    rank_music3 = this.sound.add('rank3');
    
    this.cameras.main.setBackgroundColor('#bbbbbb');

    background_1 = this.add.image(0, 0, 'background');
    background_1.setDisplaySize(gameSize.w, gameSize.h);
    background_1.setOrigin(0);

    start = this.add.text(400, 480, 'press to start', { fontFamily: 'Arial', fontSize: 40, color: 'blue' });
    start.setInteractive();
    start.setOrigin(0.5);

    retry = this.add.text(400, 400, 'R e t r y', { fontFamily: 'Arial', fontSize: 30, color: 'White' });
    retry.setOrigin(0.5);
    retry.setVisible(false);
    retry.setInteractive();
    retry_picture = this.add.image(0, 0, 'retry_picture');
    retry_picture.setInteractive();
    init_retry_picture(false);
    retry_picture.setAlpha(0.01);
    retry_picture.setDisplaySize(gameSize.w, gameSize.h)
    retry_picture.setOrigin(0);

    rank_block[0] = this.add.image(0, 0, 'rank_block');
    rank_block[1] = this.add.image(0, 0, 'rank_block');
    rank_block[2] = this.add.image(0, 0, 'rank_block');
    rank_block[0].setOrigin(0.5);
    rank_block[1].setOrigin(0.5);
    rank_block[2].setOrigin(0.5);
    rank_block[0].setDisplaySize(gameSize.w / 3 * 2, gameSize.h / 6);
    rank_block[1].setDisplaySize(gameSize.w / 3 * 2, gameSize.h / 6);
    rank_block[2].setDisplaySize(gameSize.w / 3 * 2, gameSize.h / 6);
    contWidth = rank_block[0].width;

    score.self = this.add.text(400 , 60, 'Score: ' + score.num, { fontFamily: 'Arial', fontSize: 50, color: 'white' });
    score.self.setStroke('#000000', 5);
    score.self.setOrigin(0.5);
    
    score.bestTxt[0] = this.add.text(0, 0, 'RANK 1         '   + score.best[0], { fontFamily: 'Arial', fontSize: 60, color: 'gold' });
    score.bestTxt[1] = this.add.text(0, 0, 'RANK 2         '   + score.best[1], { fontFamily: 'Arial', fontSize: 60, color: 'silver' });
    score.bestTxt[2] = this.add.text(0, 0, 'RANK 3         '   + score.best[2], { fontFamily: 'Arial', fontSize: 60, color: 'brown' });
    scoreWidth = rank_block[0].width;
    score.bestTxt[0].setStroke('#000000', 3);
    score.bestTxt[1].setStroke('#000000', 3);
    score.bestTxt[2].setStroke('#000000', 3);
    score.bestTxt[0].setOrigin(0.5);
    score.bestTxt[1].setOrigin(0.5);
    score.bestTxt[2].setOrigin(0.5);   
    score.bestTxt[0].setDisplaySize(gameSize.w / 3, gameSize.h / 9);
    score.bestTxt[1].setDisplaySize(gameSize.w / 3, gameSize.h / 9);
    score.bestTxt[2].setDisplaySize(gameSize.w / 3, gameSize.h / 9);

    for(var i=0; i<3; i++){
        rank_cont[i] = this.add.container(0, 70 + 80 * (i+1));
        rank_cont[i].add(rank_block[i]);
        rank_cont[i].add(score.bestTxt[i]);
    }

    init_cont_x.call(this);
    init_cont_y();

    levelTexture[0] = this.add.text(400, 40, 'Level' + 1, { fontFamily: 'Arial', fontSize: 30, color: 'black' });
    levelTexture[0].setVisible(false);
    levelTexture[1] = this.add.text(400, 40, 'Level' + 2, { fontFamily: 'Arial', fontSize: 30, color: 'black' });
    levelTexture[1].setVisible(false);
    

    player = this.physics.add.image(400, 300, 'chicken');
    player.setDisplaySize(105, 121);
    player.setCircle(70, player.width/2 - 60, player.height/2 - 40);
    init_player(false);

    dead_chicken = this.add.image(400, 480, 'deadChicken');
    dead_chicken.setDisplaySize(70, 56)
    dead_chicken.setVisible(false)

    for(i=0; i<5; i++){
        FireList[i] = this.physics.add.image(0, Random_Int(gameSize.h, 10), 'Fire');
        FireList[i].setDisplaySize(60, 73);
        FireList[i].setCircle(28, FireList[i].width/2 - 25, FireList[i].height/2 - 28)
        FireList[i].angle = -90

        
        FireList[i+5] = this.physics.add.image(Random_Int(gameSize.w, 10), 0, 'Fire');
        FireList[i+5].setDisplaySize(60, 73);
        FireList[i+5].setCircle(28, FireList[i+5].width/2 - 25, FireList[i+5].height/2 - 28)
        
    }
    init_Fire(false);




    item_star.create(player, score);



    // <!background, start, retry, score, player, Fire 생성>

    // <Press to start 첫 시작 이벤트>
    this.input.once('pointerdown', (pointer) => {
        playing_music.setLoop(true);
        playing_music.play();
        start.setVisible(false);
        player.setInteractive();
        this.input.setDraggable(player);
        init_player(true);
        item_star.onceGame();
        setTimeout( () => {
            scoreToggleBoolean(true);
            init_Fire(true);
            for(i=0; i<5; i++){
                tween_LR.call(this, FireList[i], i);
            }
            for(i=5; i<10; i++){
                tween_UD.call(this, FireList[i], i);
            }
        }, delay)
    });
    // <!Press to start 첫 시작 이벤트>

    // <collide 충돌 시 이벤트>
    for(var k=0; k<10; k++){
        var emp = FireList[k];
        this.physics.add.collider(emp, player, () => {
            if(player.visible == true && FireList[1].visible == true){
                playing_music.stop();
                ghost_music.setLoop(true);
                ghost_music.play();
                init_player(false);
                init_Fire(false);
                init_retry_picture(true);
                retry.setVisible(true);
                scoreToggleBoolean(false);
                dead_chicken.setVisible(true);
                item_star.playerDeath();


                if(score.best[0] < score.num){
                    score.best[2] = score.best[1];
                    score.best[1] = score.best[0];
                    score.best[0] = score.num;
                    score.bestTxt[0].setText('RANK 1         '   + score.best[0]);
                    score.bestTxt[1].setText('RANK 2         '   + score.best[1]);
                    score.bestTxt[2].setText('RANK 3         '   + score.best[2]);
                    
                }
                else if(score.best[1] < score.num){
                    score.best[2] = score.best[1];
                    score.best[1] = score.num;
                    score.bestTxt[1].setText('RANK 2         '   + score.best[1]);
                    score.bestTxt[2].setText('RANK 3         '   + score.best[2]);
                }
                else if(score.best[2] < score.num){
                    score.best[2] = score.num;
                    score.bestTxt[2].setText('RANK 3         '   + score.best[2]);
                }

                tween_cont.call(this, rank_cont[2], 500);
                tween_cont.call(this, rank_cont[1], 1000);
                tween_cont.call(this, rank_cont[0], 1500);
                

                for(var i=0; i<10; i++){
                    if(i<5){
                        FireList[i].x = 0;
                        FireList[i].y = Random_Int(500, 10);
                    }
                    else{
                        FireList[i].x = Random_Int(700, 10);
                        FireList[i].y = 0;               //if문은 불을 초기 위치로 보낸다
                    }
                }
            }
        })
    }
    // <!collide 충돌 시 이벤트>
    
    // <retry 재시작 이벤트>
    retry_picture.on('pointerdown', () => {
        if(retry_on == true && retry_on_2){
            when_retry.call(this);
            retry_on = !retry_on;
            retry_on_2 = !retry_on_2;
        }    
    })
    // <!retry 재시작 이벤트>

    // <Touch Pad 기능>
    this.input.on('pointerdown', function (pointer, gameObject) {
            Touch_stick_x = player.x - pointer.x;
            Touch_stick_y = player.y - pointer.y;
    });
    
    this.input.on('pointermove', function (pointer) {
        if(player._visible == true){
            if (pointer.isDown) {
                var stx = 0, sty = 0;
                stx = distanceX(pointer.x);
                sty = distanceY(pointer.y);
            }
        }
    });

}
// <!create>

// <update>
function update()
{
    // <벽 통과 방지>
    if(player.x >= gameSize.w - player.body.width / 2){
        player.x = gameSize.w - player.body.width / 2;
    }
    else if(player.x <= player.body.width / 2){
        player.x = player.body.width / 2;
    }

    if(player.y >= gameSize.h - player.body.height / 2){
        player.y = gameSize.h - player.body.height / 2;
    }
    else if(player.y <= player.body.height / 2){
        player.y = player.body.height / 2;
    }
    // <!벽 통과 방지>

    updateScore();

    item_star.update(score);



}
// <!update>









// <function>
function rankTween(target, distance){
    this.tweens.add({
        targets: target,
        x: container.x + distance,
        duration: 1000,
        delay: 0,
        yoyo: false,
        repeat: 0
    });
}

// <Toggles>
function scoreToggle(){
    score.toggle = !score.toggle;
}
function scoreToggleBoolean(_bool) {
    score.toggle = _bool;
}
// <!Toggles>

// <Touch pad 기능>
function distanceX(_pointerX) {

    player.x = _pointerX + Touch_stick_x;

    return _pointerX + Touch_stick_x;
}

function distanceY(_pointerY) {

    player.y = _pointerY + Touch_stick_y;

    return _pointerY + Touch_stick_y;
}
// <!Touch Pad 기능>
 
// <retry 기능>
function when_retry() {
    ghost_music.stop();
    playing_music.setLoop(true);
    playing_music.play();
    init_retry_picture(false);
    init_player(true);
    dead_chicken.setVisible(false);
    retry.setVisible(false);
    item_star.retryGame();
    init_cont_x.call(this);
    init_cont_y();

    setTimeout( () => {
        scoreToggleBoolean(true);
        init_Fire(true);
        for(i=0; i<tweenN.length; i++){
            if(i<5){
                tween_LR.call(this, FireList[i], i);
                FireList[i].angle = -90
            }
            else{
                tween_UD.call(this, FireList[i], i);
                FireList[i].angle = 0
            }
        }
    }, delay)
}
// <!retry 기능>

// <update 기능>
function updateScore() {
    if (score.toggle) {
        score.num += score.gap;
        score.self.setText('Score: ' + score.num);
    }
    else {
        score.num = 0;
    }
}
// <!update 기능>

// <init 기능>
function init_retry_picture(bool) {
    retry_picture.setVisible(bool);
    retry_picture.setActive(bool); 
}
function init_player(bool) {
    player.setVisible(bool);
    player.setActive(bool);  
    if(bool){
        player.x = 400;
        player.y = 300;
    }
}
function init_Fire(bool) {
    for(var j=0; j<10; j++){
        FireList[j].setVisible(bool);
        FireList[j].setActive(bool);        
    }
}
// <!init 기능>

// <tween 기능>
function tween_LR(target, i) {
    tweenN[i] = this.tweens.add({
        targets: target,
        x: gameSize.w, 
        duration: Random_Double(5, 1)*1000, 
        ease: 'Linear',
        yoyo: true,
        onYoyo: function () { 
            target.y = Random_Int(gameSize.h, 0)
            target.angle = 90
        },
        onUpdate: () => {
            if(player.visible == false){
                tweenN[i].remove();
                target.x = 0
                target.y = Random_Int(gameSize.h, 0);
                if(i == 9){
                    retry_on = true;
                }
            }
        },
        onComplete: () => { 
            target.angle = -90;
            if(player.visible == true){
                target.y = Random_Int(gameSize.h, 0);
                tween_LR.call(this, target, i);
            }
        }
    });
}
function tween_UD(target, i) {
    tweenN[i] = this.tweens.add({
        targets: target,
        y: gameSize.h, 
        duration: Random_Double(5, 1)*1000, 
        ease: 'Linear',
        yoyo: true,
        repeat: 0,
        onYoyo: function () { 
            target.angle = 180
            target.x = Random_Int(gameSize.w, 0);
        },
        onUpdate: () => {
            if(player.visible == false){
                tweenN[i].remove();
                target.x = Random_Int(gameSize.w, 0);
                target.y = 0;
                if(i == 9){
                    retry_on = true;
                }
            }
        },
        onComplete: () => { 
            if(player.visible == true){
                target.angle = 0
                target.x = Random_Int(gameSize.w, 0);
                tween_UD.call(this, target, i);
            }
        }
    });
}
function tween_cont(target, i) {
    var tweenC = this.tweens.add({
        targets: target,
        x: gameSize.w/2,
        duration: i,
        ease: 'Bounce.easeIn',
        yoyo: false,
        repeat: 0,

        onComplete: () => {
            if(target == rank_cont[2]){
                rank_music3.play();
            }
            else if(target == rank_cont[1]){
                rank_music2.play();
            }
            else if(target == rank_cont[0]){
                rank_music1.play();
            }
            
            if(target == rank_cont[0]){
                retry_on_2 = true;
            }
        }
    })
}
// <!tween 기능>

// <Random 기능>
function Random_Int(max, min) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function Random_Double (max, min){
    return Math.random() * (max - min) + min;
}
// <!Random 기능>

function init_cont_x() {
    rank_cont[0].x = -(contWidth / 2);
    rank_cont[1].x = gameSize.w + (contWidth / 2);
    rank_cont[2].x = -(contWidth / 2);
}

function init_cont_y() {
    rank_cont[0].y = 70;
    rank_cont[1].y = 150;
    rank_cont[2].y = 230;

}

// <!function>




let tmpGameScene = undefined;

function resizeApp ()
{
    var canvas = document.getElementById("phaser-example");

    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;

    if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else {
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}

// detect portrait or landscape serial logics
function displayLandscapeMark() { // init check landscapeor portrait
    // window.addEventListener("resize", resize, false);

    var canvas = document.getElementById("phaser-example");

    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    // 가로 < 세로
    if(windowWidth < windowHeight) {
        setPortraitWarning(windowWidth, windowHeight);
    }
    // 가로 > 세로
    else {
        setLandscape(windowWidth, windowHeight);
    }
}
function setPortraitWarning(_windowWidth, _windowHeight) {
    // release the fullscreen
    if (tmpGameScene.scale.isFullscreen) {
        tmpGameScene.scale.stopFullscreen();
    }
}
function setLandscape(_windowWidth, _windowHeight) {
    // just make this fullscreen
    if (!tmpGameScene.scale.isFullscreen) {
        tmpGameScene.scale.startFullscreen();
    }
}



// force to delete warning about request fullscreen
let tmpPhaserExample = window.document.getElementById('phaser-example');
tmpPhaserExample.webkitRequestFullscreen();
// window.document.documentElement.webkitRequestFullscreen();


// window.addEventListener("resize", displayLandscapeMark, false);

window.onload = function () {
    tmpGameScene = game.scene.keys.default;
    // game.input.on('pointerdown', () => {
    tmpGameScene.input.on('pointerdown', () => {
        displayLandscapeMark();
    });
}





