var wolf, wolf_running, wolf_collided;

var boneImg, bonesGroup;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;

var backgroundImg

var score = 0;

var ground, invisibleGround;

var gameOver, gameOverImg;
var restart, restartImg;
var jumpSound, collidedSound, backgroundSound, collectedSound;
var gameState = "play";

function preload(){

jumpSound = loadSound("jump.wav");
collectedSound = loadSound("bone.wav");
collidedSound = loadSound("bite.wav");
backgroundSound = loadSound("background.wav");

    wolf_running = loadAnimation("wolf 1.png", "wolf 2.png", "wolf 3.png", "wolf 4.png", "wolf 5.png", "wolf 6.png");
    wolf_collided = loadAnimation("scared_wolf-removebg-preview.png");
    boneImg = loadImage("bone.png");

    backgroundImg = loadImage("dark forest.PNG");
    gameOverImg = loadImage("game over.PNG");
    restartImg = loadImage("restart.PNG");

    obstacle1 = loadImage("animalhead_coyote.png");
    obstacle2 = loadImage("cuteanimals_bear.png");
    obstacle3 = loadImage("cuteanimals_fox3.png");
    obstacle4 = loadImage("eagle.png");
}

function setup() {
    createCanvas(windowWidth,windowHeight);

    wolf = createSprite(200, height-70)
 wolf.addAnimation("running", wolf_running);
 wolf.addAnimation("collided", wolf_collided);
 wolf.setCollider('circle', 0, 0, 75);

invisibleGround = createSprite(width/2, height-70, width, 10);
invisibleGround.visible = false

ground = createSprite(width/2, height, width, 2);
ground.x = width/2;
ground.velocityX = -(6 + 3*score/100);

 gameOver = createSprite(width/2 , height/2 -200);
 gameOver.addImage(gameOverImg);

 restart = createSprite(width/2 , height/2);
 restart.addImage(restartImg);

 gameOver.visible = false;
 restart.visible = false;

 bonesGroup = new Group();
 obstaclesGroup = new Group();

 score = 0;

}

function draw() {
background(backgroundImg)
textSize(20);
fill("white");
text("Score: "+ score,30,50)

if (gameState === "play"){

    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);

    if((touches.length > 0 || keyDown("SPACE")) && wolf.y >= height-200){
        jumpSound.play();
        wolf.velocityY = -20;
        touches = [];
    }

    wolf.velocityY = wolf.velocityY + 0.8;
    
    if(ground.x < 0){
        ground.x = ground.width/2;
    }

    wolf.collide(invisibleGround);
    spawnBones();
    spawnObstacles();

    if (bonesGroup.collide(wolf)){
        bonesGroup.lifetime = 0;
        score = score +100;
        bonesGroup.lifetime = 1000;
    }

    if(obstaclesGroup.isTouching(wolf)){
        collidedSound.play();
        gameState = "end"
    }
}
else if (gameState === "end"){
    background("black")
    gameOver.visible = true;
    restart.visible = true;

    ground.velocityX = 0;
    wolf.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    bonesGroup.setVelocityXEach(0);

    wolf.changeAnimation("collided", wolf_collided);

    obstaclesGroup.setLifetimeEach(-1);
    bonesGroup.setLifetimeEach(-1);

    if(touches.length > 0 || keyDown("SPACE")){
        reset();
        touches = [];
        }
    }


 drawSprites();
}

function spawnBones() {
    if(frameCount % 125 === 0){
        var bone = createSprite(width+20, height-250,40,10);
        bone.x = Math.round(random(50,width*3/4));
        bone.addImage(boneImg);
        bone.scale = 0.5;
        bone.velocityX = -3;

        bone.depth = wolf.depth;
        wolf.depth = wolf.depth +1;

        bonesGroup.add(bone);
        
    }
}

function spawnObstacles(){
    if(frameCount % 150 === 0){
        var obstacle = createSprite(width + 20,height-95,20,30);
        obstacle.setCollider('circle',0,0,45)

        obstacle.velocityX = -(6 + 3*score/100);

        var rand = Math.round(random(1,4));
        switch(rand){
            case 1: obstacle.addImage(obstacle1);
                    break;
            case 2: obstacle.addImage(obstacle2);
                    break;
            case 3: obstacle.addImage(obstacle3);
                    break;
            case 4: obstacle.addImage(obstacle4);
                    break;
            default: break;
        }

        obstacle.scale = 0.3;
        obstacle.lifetime = 300;
        obstacle.depth = wolf.depth;
        wolf.depth +=1;

        obstaclesGroup.add(obstacle)
    }
}

function reset(){
    gameState = "play";
    gameOver.visible = false;
    restart.visible = false;

    obstaclesGroup.destroyEach();
    bonesGroup.destroyEach();

    wolf.changeAnimation("running", wolf_running);

    score = 0;
}