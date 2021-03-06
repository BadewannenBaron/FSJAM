
// Global variables, one dead kitten for each one
var x = 14
var y = 8
var grid = new Array(x)
var player, state, tick = 0;
var velocity = 7.5;
var enemies = [];
var metals = [];
var objects = [];
var updateHealth;
var premiumcounter=0;
var healthBar;
var premiumcounter= getIntCookie("premium");
var levelcounter= getIntCookie("level");
var messageCounter;
var gameOverScene;

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


var boundary = {
    "top": 0,
    "bottom": window.innerHeight - 50,
    "left": 0,
    "right": window.innerWidth - 50
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


//Monster-mit-Monster-Kollision
function sidestep(s1, s2) {
    var meet = undefined;

    //von links unten=rechts oben
    if((s1.x+s1.width+20)>s2.x && (s1.x+s1.width+20)<(s2.x+s2.width)
    && (s1.y+s1.height)>s2.y && s1.y<(s2.y+s2.height)) {
      meet = true;
    }
    if((s2.x+s2.width+20)>s1.x && (s2.x+s2.width+20)<(s1.x+s1.width)
    && (s2.y+s2.height)>s1.y && s2.y<(s1.y+s1.height)) {
      meet = true;
    }

    //von links oben=rechts unten
    if(s1.x>s2.x && s1.x<(s2.x+s2.width+20)
    && s1.y>s2.y && s1.y<(s2.y+s2.height+20)){
      meet = true;
    }
    if(s1.x>s2.x && s1.x<(s2.x+s2.width+20)
    && s1.y>s2.y && s1.y<(s2.y+s2.height+20)){
      meet = true;
    }
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
    if ((player.x > enemy.x) && (player.x < (enemy.x + enemy.width)) && ((player.y > enemy.y) && (player.y < (enemy.y + enemy.height)))) {
        return true;
    } else if (((player.x + player.width) > enemy.x) && ((player.x + player.width) < (enemy.x + enemy.width)) && ((player.y > enemy.y) && (player.y < (enemy.y + enemy.height)))) {
        return true;
    } else if ((player.x > enemy.x) && (player.x < (enemy.x + enemy.width)) && (((player.y + player.height) > enemy.y) && ((player.y + player.height) < (enemy.y + enemy.height)))) {
        return true;
    } else if (((player.x + player.width) > enemy.x) && ((player.x + player.width) < (enemy.x + enemy.width)) && (((player.y + player.height) > enemy.y) && ((player.y + player.height) < (enemy.y + enemy.height)))) {
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
        enemy.health-=player.damage;

        player.health-=enemy.damage;
        updateHealth=true;

        //console.log(enemy.health);
		if(player.health==0){
            setCookie("premium", premiumcounter, 365)
            setCookie("level", levelcounter+1, 365)
			window.location = "gameover.html";

			//stage.visible = false;
           // gameOverScene.visible = true;
			//stage.removeChild(player);

        }

        if(enemy.health==0){
            replaceEnemyByMetal(enemy);
        }

        player.x = player.x - 3 * player.vx;
        player.y = player.y - 3 * player.vy;
        //oben/unten rausgebounced?
        if(isOutsideBoundary(player)){
            player.y = player.y + 3 * player.vy;
        }
        //seitlich rausgebounced?
        if(isOutsideBoundary(player)){
            player.x = player.x + 3 * player.vx;
        }

        return true;
    }
    return false;
}

function updateHealthBar(e,posx, posy,small,dead){
        //small bar for enemies
        if(dead){
            return;
        }
        if (small == true){
            var length = 50;
            var height = 4;
        }
        else{
            var length = 200;
            var height = 15;
        }
        e.healthBar = new Container();
        e.healthBar.position.set(posx, posy)
        stage.addChild(e.healthBar);
        //Create the black background rectangle
        var innerBar = new Graphics();
        innerBar.beginFill(0x000000);
        innerBar.drawRect(0, 0, length, height);
        innerBar.endFill();
        e.healthBar.addChild(innerBar);
        //Create the front red rectangle
        var outerBar = new Graphics();
        outerBar.beginFill(0xFF3300);
        outerBar.drawRect(0, 0, ((length/10)*e.health), height);
        //console.log((length/10)*e.health);
        outerBar.endFill();
        e.healthBar.addChild(outerBar);
        e.healthBar.outer = outerBar;
}

function checkPlayerMetlCollision(player, Metl) {
    // if (isPlayerEnemyCollision(player, enemy)) {
    //     player.x = player.x - 3 * player.vx;
    //     player.y = player.y - 3 * player.vy;
    //     return true;
    // }
    // return false;
    if (isPlayerEnemyCollision(player, Metl)) {
        replaceMetl(Metl);
        return true;
    }
    return false;
}

function replaceMetl(Metl) {
    stage.removeChild(Metl);
        metals.splice(metals.indexOf(Metl), 1);
       premiumcounter++;


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
        enemy.dead = true;
		setTimeout(function(){metals.push(metl);},200);
		stage.addChild(metl);
    }
}

function spawnmetal() {
  var metl = new Sprite(resources["images/metal.png"].texture);
  var tempmetlx = randomInt(0, 13);
  var tempmetly = randomInt(0, 7);

  while(!grid[tempmetlx][tempmetly]){
    var tempmetlx = randomInt(0, 13);
    var tempmetly = randomInt(0, 7);
  }

  metl.x = tempmetlx * 100;
  metl.y = tempmetly * 100;


  metl.vx = 0;
  metl.vy = 0;
  metals.push(metl);
  stage.addChild(metl);
setTimeout(function(){metals.push(metl);},200);
stage.addChild(metl);

}




function setup() {



    // setup grid (level)

    //var levelstr = levels[Math.floor(Math.random()*levels.length)];
    var levelstr = levels[levelcounter]
    for (i = 0; i < x; i++) {
      grid[i] = new Array(y)
      for (j = 0; j < y; j++) {
          grid[i][j] = levelstr[i + j * x]

      }
    }

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
    player.wannaX = 0;
    player.wannaY = 0;
    //Anfangskamfwerte
    player.health = 10;  //TEMP!!!!
    player.damage = 1;

    //create Scrappieces
    rndmax = randomInt(0,6);
    for (rndvar=0 ; rndvar < rndmax; rndvar++){
      spawnmetal();
      //console.log(rndmax);
    }

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

        //Anfangskampfwerte
        enemy.health = 10;
        enemy.damage = 0.5;
        enemy.dead = false;
        //Set the blob's position
        enemy.x = randomx;
        enemy.y = randomy;

        enemy.vx = 0; // Anfangsgeschwindigkeit
        enemy.vy = 0;

        //Enemy an legaler Stelle erzeugt? Wenn nicht zurücksetzen
        for(var j in enemies){

                var enemyNearEnemy = sidestep(enemy, enemies[j]);
                if ((enemyNearEnemy == true) && (enemy != enemies[j])) {
                    break;
                }
        }

        if(isOutsideBoundary(enemy) || isPlayerEnemyCollision(player, enemy) || enemyNearEnemy){
            i-=1;
        }

        else{
            enemies.push(enemy);
            stage.addChild(enemy);
            updateHealthBar(enemy,enemy.x,(enemy.y+enemy.height+10),true,enemy.dead);
        }
    }

    // Anfangskoordinaten
    stage.addChild(player);
    updateHealthBar(player,20,6,false,false);


  var messageWelle = new Text(
        "Welle:", {
            fontFamily: "Arial",
            fontSize: 32,
            fill: "white"
        });

	  messageCounter = new Text(
        "PREMIUM-Counter:"+premiumcounter, {
            fontFamily: "Arial",
            fontSize: 24,
            fill: "white"
        });
    messageWelle.position.set(window.innerWidth - 170, 6);
    stage.addChild(messageWelle);

	messageCounter.position.set(window.innerWidth - 270,38 );
    stage.addChild(messageCounter);


    var left = keyboard(37), //Ascii keyboard bindings
        up = keyboard(38),
        right = keyboard(39),
        down = keyboard(40);

    // Movement wishes
    right.press = function()   { player.wannaX += 1; };
    right.release = function() { player.wannaX -= 1; };
    down.press = function()    { player.wannaY += 1; };
    down.release = function()  { player.wannaY -= 1; };
    up.press = function()      { player.wannaY -= 1; };
    up.release = function()    { player.wannaY += 1; };
    left.press = function()    { player.wannaX -= 1; };
    left.release = function()  { player.wannaX += 1; };

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


    //Update the current game state:
    state();
    //Render the stage
    renderer.render(stage);
}

function play() {
    // Honor direction wishes
    player.vx = player.wannaX * velocity;
    player.vy = player.wannaY * velocity;
    // Actually move
    player.x += player.vx;
    player.y += player.vy;
    checkOutsideBoundary(player);

    enemies.forEach(function(enemy) {

        checkPlayerEnemyCollision(player, enemy);
        enemy.y += enemy.vy;
        enemy.x += enemy.vx;
        stage.removeChild(enemy.healthBar);
        updateHealthBar(enemy,enemy.x,(enemy.y+enemy.height+10),true,enemy.dead);

        if(isOutsideBoundary(enemy)){
            enemy.vx *= -1;
            enemy.vy *= -1;
        }

        enemies.forEach(function(enemy2) {
            var enemyNearEnemy = sidestep(enemy, enemy2);
            if ((enemyNearEnemy == true) && (enemy != enemy2)) {
                enemy.vy *= -1;
                enemy2.vx *= -1;
            }
        });
    });

	metals.forEach(function(metl) {
	checkPlayerMetlCollision(player, metl);
	});

	if (premiumcounter>0){
		stage.removeChild(messageCounter);
		messageCounter = new Text(
        "PREMIUM-Counter:"+premiumcounter, {
            fontFamily: "Arial",
            fontSize: 24,
            fill: "white"
        });
	messageCounter.position.set(window.innerWidth - 270,38 );
    stage.addChild(messageCounter);
	}

    if(updateHealth==true){
        stage.removeChild(player.healthBar);
        updateHealthBar(player,20,6,false,false);
    }

}













// COOKIE FUNCTIONS
function setCookie(cname, cvalue, exdays) {
    var d = new Date()
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
    var expires = "expires="+d.toUTCString()
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"
}

function getCookie(cname) {
    var name = cname + "="
    var ca = document.cookie.split(';')
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i]
        while (c.charAt(0) == ' ') {
            c = c.substring(1)
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length)
        }
    }
    return ""
}

function getIntCookie(cname) {
    var result = getCookie(cname)

    // return 0
    // if (cname === "scrap") return 100; else return 0;

    if (result == "") {
        result = 0
    } else {
        result = parseInt(result)
    }

    return result
}
