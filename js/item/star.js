export default class star{
    constructor (_scene) {
        this.scene = _scene
        this.preload();
        this.add_score = 1000;
        this.width = 50;
        this.height = 50;
        this.self = undefined;   

        



    }
    preload(){
        this.scene.load.image('star', './assets/image/star.png');
        this.scene.load.audio('create_star_snd', './assets/audio/createStarSnd.mp3')
        this.scene.load.audio('collision_star_snd', './assets/audio/start_ting.wav')
    }
    create(player, score){
        this.self = this.scene.physics.add.image(400, 300, 'star');
        this.self.setDepth(99999);
        this.init_width_height();

        this.scene.physics.add.collider(this.self, player, () => {
            console.log('fi')
            if(player.visible == true){
                console.log("sd")
                // score.self = this.add_score(score.self);
                this.self.setVisible(false);

            }
        




        })
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
        return _score + this.add_score;
    }
    create_loc(low, cal) {
        this.create_loc_x = this.random_double(low, 0);
        this.create_loc_y = this.random_double(cal, 0);
    }
}


// function Random_Double (max, min){
//     return Math.random() * (max - min) + min;
// 