
// Global variables, one dead kitten for each one
var x = 10
var y = 5
var grid = new Array(x)
var player, state, tick = 0;
var velocity = 7.5;
var enemies = [];
var metals = [];
var healthBar;

var Side = {
    NONE: 0,
    TOP: 1,
    RIGHT: 2,
    BOTTOM: 3,
    LEFT: 4,
};


//Aliases
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    Text = PIXI.Text,
    Graphics = PIXI.Graphics;

var type = "WebGL"
if (!PIXI.utils.isWebGLSupported()) {
    type = "canvas";
}

//Create a container object called the `stage`
// Whatever you put inside the stage will be rendered on the canvas.
var stage = new Container();

//definiert den renderer
renderer = autoDetectRenderer(256, 256);
renderer.backgroundColor = 0x061639;
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
renderer.resize(window.innerWidth, window.innerHeight);
//Add the canvas to the HTML document
document.body.appendChild(renderer.view);

//load an image and run the `setup` function when it's done
function startGame() {
    document.getElementById("intro").remove();
    document.body.appendChild(renderer.view);
    renderer.render(stage);
    loader
        .add("images/cat.png")
        .add("images/evil.png")
        .add("images/metal.png")
        .load(setup);
}

// -80 sind nicht die richtigen Werte, das hängt dann vom Endsprite player ab
var boundary = {
    "top": 0,
    "bottom": window.innerHeight - 64,
    "left": 0,
    "right": window.innerWidth - 64
};

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function direction() {
    var direc = undefined;
    var erg = Math.floor((Math.random() * 3) + 0);
    if (erg == 0) {
        direc = "left";
    }
    if (erg == 1) {
        direc = "right";
    }
    if (erg == 2) {
        direc = "top";
    }
    if (erg == 3) {
        direc = "bottom";
    }
    return erg;
}

function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press)
                key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };
    key.upHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release)
                key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };

    //Attach event listeners
    window.addEventListener(
        "keydown",
        key.downHandler.bind(key),
        false
    );

    window.addEventListener(
        "keyup",
        key.upHandler.bind(key),
        false
    );
    return key;
}

//Da fehlt die jeweils andere Ecke (die wird dann nicht getestet)
function contain(sprite, container) {
    var collision = undefined;
    //Left
    if (sprite.x < container.x) {
        sprite.x = container.x;
        collision = "left";
    }
    //Top
    if (sprite.y < container.y) {
        sprite.y = container.y;
        collision = "top";
    }
    //Right
    if (sprite.x + sprite.width > container.width) {
        sprite.x = container.width - sprite.width;
        collision = "right";
    }
    //Bottom
    if (sprite.y + sprite.height > container.height) {
        sprite.y = container.height - sprite.height;
        collision = "bottom";
    }
    //Return the `collision` value
    return collision;
}

//Monster-mit-Monster-Kollision
function sidestep(sprite1, sprite2) {
    var meet = undefined;

    //Mini-Test, da kann eigentlich nichts schief gehen
    if (sprite1.x < sprite2.x) {
        meet = true;
    }
    /*
    //eigentlicher Code, woran auch immer es scheitert
    if((sprite1.x+64)>sprite2.x && (sprite1.x+64)<(sprite2.x+64)
    && sprite1.y>sprite2.y && sprite1.y<(sprite2.y+64)) {
    meet = true;
    }

    if((sprite2.x+64)>sprite1.x && (sprite2.x+64)<(sprite1.x+64)
    && sprite2.y>sprite1.y && sprite2.y<(sprite1.y+64)) {
    meet = true;
    }

    if(sprite1.x>sprite2.x && sprite1.x<(sprite2.x+64)
    && sprite1.y>sprite2.y && sprite1.y<(sprite2.y+64)){
    meet = true;
    }
    if(sprite2.x>sprite1.x && sprite2.x<(sprite1.x+64) && sprite2.y>sprite1.y && sprite2.y<(sprite1.y+64)) {
    meet = true;
    }*/
    return meet;
}


function isOutsideBoundary(entity) {
    var newX = entity.x + entity.vx
    var newY = entity.y + entity.vy

    var lowerX = (newX - newX % 100) / 100
    var upperX = (newX + entity.width-1 - (newX + entity.width-1) % 100) / 100
    var lowerY = (newY - newY % 100) / 100
    var upperY = (newY + entity.height-1 - (newY + entity.height-1) % 100) / 100

    if (newX >= 0 && upperX < x && newY >= 0 && upperY < y &&
        grid[lowerX][lowerY] == 1 &&
        grid[lowerX][upperY] == 1 &&
        grid[upperX][lowerY] == 1 &&
        grid[upperX][upperY] == 1) {
        return false
    }

    return true;
}


function checkOutsideBoundary(player) {
    if (isOutsideBoundary(player)) {
        //player.position.set(player.initX, player.initY);
        player.x = player.x - player.vx;
        player.y = player.y - player.vy;
        return true;
    }
    return false;
}


function autofinder(s, t, richtung) {
    dx = t.x - s.x;
    dy = t.y - s.y;
    //richtung= richtung%2;

    if (dx < 0 && richtung == 1) {
        s.vx = -2
        s.vy = 0
    }

    if (dx > 0 && richtung == 1) {
        s.vx = 2
        s.vy = 0
    }

    if (dy < 0 && richtung == 0) {
        s.vx = 0
        s.vy = -2
    }

    if (dy > 0 && richtung == 0) {
        s.vx = 0
        s.vy = 2
    }
}


function isPlayerEnemyCollision(player, enemy) {
    if ((player.x > enemy.x) && (player.x < (enemy.x + 64)) && ((player.y > enemy.y) && (player.y < (enemy.y + 64)))) {
        return true;
    } else if (((player.x + 64) > enemy.x) && ((player.x + 64) < (enemy.x + 64)) && ((player.y > enemy.y) && (player.y < (enemy.y + 64)))) {
        return true;
    } else if ((player.x > enemy.x) && (player.x < (enemy.x + 64)) && (((player.y + 64) > enemy.y) && ((player.y + 64) < (enemy.y + 64)))) {
        return true;
    } else if (((player.x + 64) > enemy.x) && ((player.x + 64) < (enemy.x + 64)) && (((player.y + 64) > enemy.y) && ((player.y + 64) < (enemy.y + 64)))) {
        return true;
    }
    return false;
}


function checkPlayerEnemyCollision(player, enemy) {
    // if (isPlayerEnemyCollision(player, enemy)) {
    //     player.x = player.x - 3 * player.vx;
    //     player.y = player.y - 3 * player.vy;
    //     return true;
    // }
    // return false;
    if (isPlayerEnemyCollision(player, enemy)) {
        replaceEnemyByMetal(enemy);
        return true;
    }
    return false;
}

function replaceEnemyByMetal(enemy) {
    if (isPlayerEnemyCollision(player, enemy)) {
        stage.removeChild(enemy)
        enemies.splice(enemies.indexOf(enemy), 1);
        var metl = new Sprite(resources["images/metal.png"].texture);
        metl.x = enemy.x;
        metl.y = enemy.y;
        metl.vx = 0;
        metl.vy = 0;
        metals.push(metl);
        stage.addChild(metl);
    }
}


function setup() {

    // setup grid (level)
    for (i = 0; i < x; i++) {
        grid[i] = new Array(y)
        for (j = 0; j < y; j++) {
            grid[i][j] = 1
        }
        // console.log(i + ": " + grid[i]);
    }
    grid[2][2] = grid[2][3] = grid[3][2] = 0

    for (i = 0; i < x; i++) {
        for (j = 0; j < y; j++) {
            if (grid[i][j] == 0) {
                continue
            }
            var rectangle = new Graphics();
            //rectangle.lineStyle(4, 0xFF3300, 1);
            rectangle.beginFill(0x66CCFF);
            rectangle.drawRect(0, 0, 100, 100);
            rectangle.endFill();
            rectangle.x = 100 * i
            rectangle.y = 100 * j
            stage.addChild(rectangle);
        }
    }

    //Create the `player` sprite
    player = new Sprite(resources["images/cat.png"].texture);

    // Anfangskoordinaten
    player.initY = player.x = 0;
    player.initX = player.y = 0;
    // Anfangsgeschwindigkeit
    player.vx = 0;
    player.vy = 0;

    var numberOfEnemies = 3,
        spacing = 48,
        xOffset = 150,
        speed = 2,
        direction = 1;


    for (var i = 0; i < numberOfEnemies; i++) {

        //Make a blob
        var enemy = new Sprite(resources["images/evil.png"].texture);

        //Space each blob horizontally according to the `spacing` value.
        //`xOffset` determines the point from the left of the screen
        var randomx = randomInt(0, window.innerWidth - enemy.width);
        //Give the enemy a random y position
        //(`randomInt` is a custom function - see below)
        var randomy = randomInt(0, window.innerHeight - enemy.height);

        //Set the blob's position
        enemy.x = randomx;
        enemy.y = randomy;

        /* enemy = new Sprite(resources["images/evil.png"].texture);
        var randomx = randomInt(0, window.innerWidth - enemy.width);
        //Give the enemy a random y position
        //(`randomInt` is a custom function - see below)
        var randomy = randomInt(0, window.innerHeight - enemy.height);
        //Set the enemy's position
        enemy.y = randomy;
        enemy.x = randomx;*/
        enemy.vx = 0; // Anfangsgeschwindigkeit
        enemy.vy = 0;

        enemies.push(enemy);
        stage.addChild(enemy);
    }

    // Anfangskoordinaten
    stage.addChild(player);

    //Create the health bar
    healthBar = new Container();
    healthBar.position.set(20, 6)
    stage.addChild(healthBar);
    //Create the black background rectangle
    var innerBar = new Graphics();
    innerBar.beginFill(0x000000);
    innerBar.drawRect(0, 0, 150, 15);
    innerBar.endFill();
    healthBar.addChild(innerBar);
    //Create the front red rectangle
    var outerBar = new Graphics();
    outerBar.beginFill(0xFF3300);
    outerBar.drawRect(0, 0, 150, 15);
    outerBar.endFill();
    healthBar.addChild(outerBar);
    healthBar.outer = outerBar;

    var message = new Text(
        "Welle:", {
            fontFamily: "Arial",
            fontSize: 32,
            fill: "white"
        }
    );
    message.position.set(window.innerWidth - 170, 6);
    stage.addChild(message);

    var left = keyboard(37), //Ascii keyboard bindings
        up = keyboard(38),
        right = keyboard(39),
        down = keyboard(40);

    //left
    left.press = function() {
        //move the player
        player.vx = -velocity;
        player.vy = 0;
    };

    left.release = function() {
        //Stop the player
        if (!right.isDown && player.vy === 0) {
            player.vx = 0;
        }
    };

    //Up
    up.press = function() {
        player.vy = -velocity;
        player.vx = 0;
    };
    up.release = function() {
        if (!down.isDown && player.vx === 0) {
            player.vy = 0;
        }
    };

    //Right
    right.press = function() {
        player.vx = velocity;
        player.vy = 0;
    };
    right.release = function() {
        if (!left.isDown && player.vy === 0) {
            player.vx = 0;
        }
    };

    //Down
    down.press = function() {
        player.vy = velocity;
        player.vx = 0;
    };
    down.release = function() {
        if (!up.isDown && player.vx === 0) {
            player.vy = 0;
        }
    };

    checkOutsideBoundary(player);

    //Set the game state
    state = play;

    //Start the game loop
    gameLoop();
}


function doSpritesIntersect(a, b) {
    return spriteIntersectionDirection(a, b) > Side.NONE;
}

function spriteIntersectionDirection(A, B) {
    var w = (A.width + B.width) / 2; // avg width
    var h = (A.height + B.height) / 2; // avg height
    var dx = A.x - B.x; // difference X
    var dy = A.y - B.y; // difference Y
    if (Math.abs(dx) <= w && Math.abs(dy) <= h) {
        var wy = w * dy;
        var hx = h * dx;
        if (wy > hx) {
            return (wy > -hx) ? Side.TOP : Side.LEFT;
        } else {
            return (wy > -hx) ? Side.RIGHT : Side.BOTTOM;
        }
    }
    return Side.NONE;
}

function spriteIntersectionDirection2(a, b) {
    if (!doSpritesIntersect(a, b))
        return Side.NONE;
    if (b.y <= a.y - (a.height / 2))
        return Side.BOTTOM;
    if (b.y >= a.y + (a.height / 2))
        return Side.TOP;
    if (b.x < a.x - a.width / 2)
        return Side.RIGHT;
    if (b.x > a.x + a.width / 2)
        return Side.LEFT;
}

function gameLoop() {

    //Loop this function 60 times per second
    requestAnimationFrame(gameLoop);
    tick++;
    if (tick == 30) {
        tick = 0;
        enemies.forEach(function(enemy) {
            var richtung = Math.floor((Math.random() * 2) + 0);
            autofinder(enemy, player, richtung);
        });
    }

/*
    tick++
    if (tick == 60) {
        tick = 0;

        enemymovement = direction();
        if (enemymovement==0){
            enemy.vx = -3;
            enemy.vy = 0;
        }   // Anfangsgeschwindigkeit
        if (enemymovement==1){
            enemy.vx = 3;
            enemy.vy = 0;
        }
        if (enemymovement==2){
            enemy.vy = -3;
            enemy.vx = 0;
        }
        if (enemymovement==3){
            enemy.vy = 3;
            enemy.vx = 0;}
        }
    }
*/

    //Update the current game state:
    state();
    //Render the stage
    renderer.render(stage);
}

function play() {
    player.y += player.vy;
    player.x += player.vx;
    checkOutsideBoundary(player);
    //checkOutsideBoundary(enemy);

    //for(var i in enemies){
    enemies.forEach(function(enemy) {
        // checkEnemyCollision(enemy,enemy);
        // checkEnemyCollision(player,enemy);
        //enemy = enemies[i];

        checkPlayerEnemyCollision(player, enemy);
        enemy.y += enemy.vy;
        enemy.x += enemy.vx;

        var enemyHitsWall = contain(enemy, {
            x: 0,
            y: 0,
            width: 1000,
            height: 500
        });
        //If the enemy hits the top or bottom of th stage, reverse
        //its direction
        if (enemyHitsWall === "top" || enemyHitsWall === "bottom")
            enemy.vy *= -1;
        if (enemyHitsWall === "left" || enemyHitsWall === "right")
            enemy.vx *= -1;

        //3 ist Anzahl der Enemies, global geben!
        enemies.forEach(function(enemy2) {
            //var enemy2 = enemies[j];
            var enemyNearEnemy = sidestep(enemy, enemy2);
            if ((enemyNearEnemy == true) && (enemy != enemy2)) {
                enemy.vy *= -1;
                enemy2.vx *= -1;
            }
            if ((enemyNearEnemy == true) && (enemy != enemy2)) {
                enemy.vx *= -1;
                enemy2.vy *= -1;
            }
        });
        //}
    });
}