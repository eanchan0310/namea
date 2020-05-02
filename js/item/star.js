class star {
    constructor () {
        this.add_score = 1000
        this.width = 100
        this.height = 100
        // this.self = 
        this.init_width_height()

    }
    init_width_height() {
        this.self.width = this.width
        this.self.height = this.height
    }





    // EXTERNAL
    addScore(_score) {
        return _score + this.add_score
    }
}