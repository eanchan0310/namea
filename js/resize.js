let tmpGameScene = undefined;

function resizeApp ()
{
    var canvas = document.getElementById("phaser-example");
    // var canvas = document.getElementsByClassName("tabPanel")[0];
    console.log('canvas:', canvas);

    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;

    if(windowRatio < gameRatio){
        console.log('width');
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else {
        console.log('height');
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}

// detect portrait or landscape serial logics
function displayLandscapeMark() { // init check landscapeor portrait
    // window.addEventListener("resize", resize, false);

    var canvas = document.getElementById("phaser-example");
    // console.log('canvas:', canvas);

    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    // 가로 < 세로
    if(windowWidth < windowHeight) {
        console.log('portrait');
        setPortraitWarning(windowWidth, windowHeight);
    }
    // 가로 > 세로
    else {
        console.log('landscape');
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
    // console.log('game:', game);
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
    console.log('tmpGameScene:', tmpGameScene);
    // game.input.on('pointerdown', () => {
    tmpGameScene.input.on('pointerdown', () => {
        console.log('pointer down then resize event');
        displayLandscapeMark();
    });
}

