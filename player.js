var player;
var playerSprite;

var grounded = false;
var vy = 0;
var xdep;
function createPlayer(scene)
{
    //player entity
    player = BABYLON.MeshBuilder.CreatePlane("player", {width: 1, height: 1}, scene);
    player.position.z = -0.5;
    player.position.y = 4;
    player.checkCollisions = true;
    player.ellipsoid = new BABYLON.Vector3(0.20, 0.5, 0.5); // collision "box"
    player.isVisible = false;

    //player sprite
    var spriteManagerPlayer = new BABYLON.SpriteManager("playerManager", "resources/yasuo_animation.png", 2, 64, scene, 0.01, BABYLON.Texture.NEAREST_SAMPLINGMODE);
    playerSprite = new BABYLON.Sprite("pp", spriteManagerPlayer);
    playerSprite.playAnimation(1, 5, true, 100);
}

function updatePlayer(map, scene)
{
    //x deplacement
    xdep = 0;
    var speed = 0.005;
    var gravity = -0.0002;
    var jumpHeight = 16;

    if((map["q"] || map["Q"]))
    {
        xdep = -speed;
        playerSprite.invertU = true;
    };
    if((map["d"] || map["D"]))
    {
        xdep = speed;
        playerSprite.invertU = false;
    };

    //jump
    if((map["Z"] || map["z"]) && grounded)
    {
        vy = Math.sqrt(0 - 2*gravity*jumpHeight);
    };
    //collision on x axis
    grounded = false;

    //update player position
    var deltatime = scene.getEngine().getDeltaTime();
    player.moveWithCollisions(new BABYLON.Vector3(xdep*deltatime,vy,0));

    //sprite follow player
    playerSprite.position = player.position;

    //2 ray for more accuracy in the detection of the ground
    var raypos1 = new BABYLON.Vector3(player.position.x+0.1, player.position.y-0.5, player.position.z);
    var ray1 = new BABYLON.Ray(raypos1, new BABYLON.Vector3(0, -1, 0), 0.01);
    var hit1 = scene.pickWithRay(ray1);

    var raypos2 = new BABYLON.Vector3(player.position.x-0.1, player.position.y-0.5, player.position.z);
    var ray2 = new BABYLON.Ray(raypos2, new BABYLON.Vector3(0, -1, 0), 0.01);
    var hit2 = scene.pickWithRay(ray2);

    // let rayHelper1 = new BABYLON.RayHelper(ray1);		
    // rayHelper1.show(scene);
    // let rayHelper2 = new BABYLON.RayHelper(ray2);		
    // rayHelper2.show(scene);

    if(hit1.pickedMesh!=null || hit2.pickedMesh!=null)
    {
        vy = 0;
        grounded = true;
    }
    else
    {
        vy += gravity * deltatime;
    }
}