export default class star{
    constructor (_scene, _gameSize) {
        this.scene = _scene;
        this.gameSize = _gameSize;
        this.preload();
        this.plus_score = 1000;
        this.width = 50;
        this.height = 50;
        this.self = undefined;   
        this.collider = undefined;
        this.score_text = undefined;
        this.tween_text = undefined;
        this.tween_star = undefined;
        this.create_star_snd = undefined;
        this.eat_star_snd = undefined;
        this.interval_score = 0;
        
    }
    preload(){
        this.scene.load.image('star', './assets/image/star.png');
        this.scene.load.image('star1', './assets/image/yellow.png');
        this.scene.load.audio('create_star_snd', './assets/audio/createStarSnd.mp3');
        this.scene.load.audio('collision_star_snd', './assets/audio/start_ting.wav');
        this.scene.load.audio('start_ting', './assets/audio/start_ting.wav');
    }
    create(player, score){
        this.eat_star_snd = this.scene.sound.add('start_ting');
        this.create_star_snd = this.scene.sound.add('create_star_snd');

        this.self = this.scene.physics.add.image(400, 300, 'star');
        this.self.setVisible(false);
        this.self.setDepth(99999);
        this.self.setOrigin(0.5);
        this.init_width_height();
        this.score_text = this.scene.add.text(10, 10, '+1000' ,{ fontFamily: 'Arial', fontSize: 50, color: 'white' })
        this.score_text.setOrigin(0.5);
        this.set_loc(this.gameSize.w, this.gameSize.h);
        this.score_text.setScale(0);
        this.tween_star_angle();

        var emitter = this.scene.add.particles('star1').createEmitter({
            x: 400,
            y: 300,
            speed: { min: -800, max: 800 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            blendMode: 'SCREEN',
            lifespan: 600,
            gravityY: 800,
            on: false
        });
        
        var emitter1 = this.scene.add.particles('star').createEmitter({
            x: 400,
            y: 300,
            speed: { min: -800, max: 800 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.5, end: 0 },
            blendMode: 'SCREEN',
            lifespan: 600,
            gravityY: 800,
            on: false
        });



        this.collider = this.scene.physics.add.collider(this.self, player, () => {
            console.log('fi')
            if(player.visible == true && score.toggle == true){
                // this.tween_star.remove();
                this.tween_text_performance();
                this.eatStar(score);

                emitter.setPosition(this.self.x, this.self.y);
                emitter1.setPosition(this.self.x, this.self.y);
                for(var i = 0; i < 20; i++){            
                    emitter.explode();   
                }
                for(var j = 0; j < 80; j++){             
                    emitter1.explode();   
                }

            }
        })
        this.collider.active = false;
    }

    // 언제인지, 뭘바꾸는지, + 더 상세하게하면 할 수록 좋음
    onceGame() {
        this.interval_score = 0;
        this.set_loc(this.gameSize.w, this.gameSize.h);
        this.create_star_snd.play();
    }
    eatStar(score) {
        this.self.setVisible(false);
        this.eat_star_snd.play();
        this.collider.active = false;
        score.num = this.add_score(score.num);
        this.interval_score = score.num;
    }
    playerDeath() {
        this.self.setVisible(false);
        this.collider.active = false;
        this.interval_score = 0;
    }
    retryGame() {
        this.set_loc(this.gameSize.w, this.gameSize.h);
        this.create_star_snd.play();
    }

    update(score) {
        if(score.num > this.interval_score + this.random_double(1000, 700)) {           
            this.self.setVisible(true);
            this.collider.active = true;   
            this.create_star_snd.play();
            this.interval_score = score.num;
        }
    }
    tween_star_angle() {
        this.tween_star = this.scene.tweens.add({
            targets: this.self,
            angle: { from: 0, to: 360 },
            ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 4000,
            repeat: -1,            // -1: infinity
            yoyo: false
        });

    }
    tween_text_performance() {
        this.tween_text = this.scene.tweens.add({
            targets: this.score_text,
            y: {value: this.self.y - this.height, duration: 1000, ease: 'Linear', yoyo: false, repeat: 0},
            scale: {from: 0, to: 1, duration: 1000},
            alpha: {delay: 1000, from: 1, to: 0, duration: 500},

            onComplete: () => {
                this.score_text.setScale(0);
                this.score_text.setAlpha(1);
                this.set_loc(this.gameSize.w, this.gameSize.h);
            }
        })
    }
    control_star(_bool) {
        this.self.setVisible(_bool);
        this.collider.active = _bool;     
    }
    init_width_height() {
        // console.log('this.self:', this.self);
        this.self.setDisplaySize(this.width, this.height);
        
    }
    random_double(max, min){
        return ~~(Math.random() * (max - min) + min);
    }
    // EXTERNAL
    add_score(_score) {
        return _score + this.plus_score;
    }
    create_loc(low, cal) {
        this.create_loc_x = this.random_double(low, 0);
        this.create_loc_y = this.random_double(cal, 0);
    }
    set_loc(_low, _cal) {
        this.create_loc(_low, _cal);
        this.self.x = this.create_loc_x;
        this.self.y = this.create_loc_y;
        this.score_text.x = this.self.x;
        this.score_text.y = this.self.y;
    }
}


