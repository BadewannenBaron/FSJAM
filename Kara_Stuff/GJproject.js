var x = 10
var y = 5
var grid = new Array(x)

for (i = 0; i < x; i++) {
    grid[i] = new Array(y)
    for (j = 0; j < y; j++) {
        grid[i][j] = 1
    }
    // console.log(i + ": " + grid[i]);
}
grid[2][2] = 0
grid[2][3] = 0
grid[3][2] = 0


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
var stage = new Container(),




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
        .load(setup);

}

var player, enemy, state, tick = 0;
var velocity = 7.5;
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


function isOutsideBoundary(player) {
    var newX = player.x + player.vx
    var newY = player.y + player.vy

    var lowerX = (newX - newX % 100) / 100
    var upperX = (newX + 63 - (newX + 63) % 100) / 100
    var lowerY = (newY - newY % 100) / 100
    var upperY = (newY + 63 - (newY + 63) % 100) / 100

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

function isEnemyCollision(player, enemy) {
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


function checkEnemyCollision(player, enemy) {
    if (isEnemyCollision(player, enemy, false)) {
        player.x = player.x - 3 * player.vx;
        player.y = player.y - 3 * player.vy;
        return true;
    }
    return false;
}


function isPlayerCollision(player, enemy) {
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


function checkPlayerCollision(player, enemy) {
    if (isPlayerCollision(player, enemy, false)) {
        enemy.x = enemy.x - 3 * enemy.vx;
        enemy.y = enemy.y - 3 * enemy.vy;
        return true;
    }
    return false;
}

var enemies = [];
var healthBar;

function setup() {

    for (i = 0; i < x; i++) {
        for (j = 0; j < y; j++) {
            if (grid[i][j] == 0) {
                continue
            }

            var rectangle = new Graphics();
            // rectangle.lineStyle(4, 0xFF3300, 1);

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

        enemy = new Sprite(resources["images/evil.png"].texture);

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

    //Anfangs koordinaten

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
    4
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

/*function isEnemyCollision(player,enemy){
if((player.x>enemy.x)&&(player.x<(enemy.x+64))&&((player.y>enemy.y)&&(player.y<(enemy.y+64)))){
return true;
}
else if(((player.x+64)>enemy.x)&&((player.x+64)<(enemy.x+64))&&((player.y>enemy.y)&&(player.y<(enemy.y+64)))){
return true;
}
else if((player.x>enemy.x)&&(player.x<(enemy.x+64))&&(((player.y+64)>enemy.y)&&((player.y+64)<(enemy.y+64)))){
return true;
}
else if(((player.x+64)>enemy.x)&&((player.x+64)<(enemy.x+64))&&(((player.y+64)>enemy.y)&&((player.y+64)<(enemy.y+64)))){
return true;
}
return false;
}
*/
/*function checkEnemyCollision(player, enemy) {
var backoff = 0;
switch(spriteIntersectionDirection2(player, enemy)) {
case Side.TOP:
player.y -= backoff;
break;
case Side.LEFT:
player.x -= backoff;
break;
case Side.BOTTOM:
player.y += backoff;
break;
case Side.RIGHT:
player.x += backoff;
break;
case Side.NONE:
default:
// no collision
return false;
}
return true;
}
*/
/*function isEnemyCollision( first, other, isCentred )
{

x=first.x
y=first.y
x2=other.x
y2=other.y
// we need to avoid using floats, as were doing array lookups
x  = Math.round( x );
y  = Math.round( y );
x2 = Math.round( x2 );
y2 = Math.round( y2 );

var w  = first.width,
h  = first.height,
w2 = other.width,
h2 = other.height ;

// deal with the image being centred
if ( isCentred ) {
// fast rounding, but positive only
x  -= ( w/2 + 0.5) << 0
y  -= ( h/2 + 0.5) << 0
x2 -= (w2/2 + 0.5) << 0
y2 -= (h2/2 + 0.5) << 0
}

// find the top left and bottom right corners of overlapping area
var xMin = Math.max( x, x2 ),
yMin = Math.max( y, y2 ),
xMax = Math.min( x+w, x2+w2 ),
yMax = Math.min( y+h, y2+h2 );

// Sanity collision check, we ensure that the top-left corner is both
// above and to the left of the bottom-right corner.
if ( xMin >= xMax || yMin >= yMax ) {
return false;
}

var xDiff = xMax - xMin,
yDiff = yMax - yMin;

// get the pixels out from the images
var pixels  = first.data,
pixels2 = other.data;

// if the area is really small,
// then just perform a normal image collision check
if ( xDiff < 4 && yDiff < 4 ) {
for ( var pixelX = xMin; pixelX < xMax; pixelX++ ) {
for ( var pixelY = yMin; pixelY < yMax; pixelY++ ) {
if (
( pixels [ ((pixelX-x ) + (pixelY-y )*w )*4 + 3 ] !== 0 ) &&
( pixels2[ ((pixelX-x2) + (pixelY-y2)*w2)*4 + 3 ] !== 0 )
) {
return true;
}
}
}
} else {
/* What is this doing?
* It is iterating over the overlapping area,
* across the x then y the,
* checking if the pixels are on top of this.
*
* What is special is that it increments by incX or incY,
* allowing it to quickly jump across the image in large increments
* rather then slowly going pixel by pixel.
*
* This makes it more likely to find a colliding pixel early.
*/

// Work out the increments,
// it's a third, but ensure we don't get a tiny
// slither of an area for the last iteration (using fast ceil).*/
/*  var incX = xDiff / 3.0,
incY = yDiff / 3.0;
incX = (~~incX === incX) ? incX : (incX+1 | 0);
incY = (~~incY === incY) ? incY : (incY+1 | 0);

for ( var offsetY = 0; offsetY < incY; offsetY++ ) {
for ( var offsetX = 0; offsetX < incX; offsetX++ ) {
for ( var pixelY = yMin+offsetY; pixelY < yMax; pixelY += incY ) {
for ( var pixelX = xMin+offsetX; pixelX < xMax; pixelX += incX ) {
if (
        ( pixels [ ((pixelX-x ) + (pixelY-y )*w )*4 + 3 ] !== 0 ) &&
        ( pixels2[ ((pixelX-x2) + (pixelY-y2)*w2)*4 + 3 ] !== 0 )
) {
    return true;
}
}
}
}
}
}

return false;
}*/

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

    /* tick++
    if (tick ==60){
    tick =0;

    enemymovement = direction();
    if (enemymovement==0){
    enemy.vx = -3;
    enemy.vy = 0;}   // Anfangs geschwindigkeit
    if (enemymovement==1){
    enemy.vx = 3;
    enemy.vy = 0;}
    if (enemymovement==2){
    enemy.vy = -3;
    enemy.vx = 0;}
    if (enemymovement==3){
    enemy.vy = 3;
    enemy.vx = 0;}

    }*/

    //Update the current game state:
    state();
    //Render the stage
    renderer.render(stage);
}

function play() {
    checkOutsideBoundary(player);
    checkEnemyCollision(player, enemy);
    player.y += player.vy;
    player.x += player.vx;

    //checkOutsideBoundary(player);
    // checkOutsideBoundary(enemy);

    //checkEnemyCollision(player,enemy);

    //for(var i in enemies){
    enemies.forEach(function(enemy) {
        // checkEnemyCollision(enemy,enemy);
        // checkEnemyCollision(player,enemy);

        //enemy = enemies[i];


        checkPlayerCollision(player, enemy);
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
        if (enemyHitsWall === "top" || enemyHitsWall === "bottom") {
            enemy.vy *= -1;
        }
        if (enemyHitsWall === "left" || enemyHitsWall === "right") {
            enemy.vx *= -1;
        }


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
