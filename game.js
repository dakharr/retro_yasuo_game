function createScene()
{
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);
    scene.collisionsEnabled = true;

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 2, -8), scene);
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(-2, 1, -2), scene)
    light.intensity = 0.7;

    //-------- input --------

    var map = {};
    scene.actionManager = new BABYLON.ActionManager(scene);

    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function(evt)
    {
        map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));

    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function(evt)
    {
        map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
    }));

    //character
    // var perso = BABYLON.MeshBuilder.CreatePlane("player", {width: 1, height: 1}, scene);
    // perso.position.z = -0.5;
    // perso.position.y = 4;
    // perso.checkCollisions = true;
    // perso.ellipsoid = new BABYLON.Vector3(0.20, 0.5, 0.5); // collision "box"
    // perso.isVisible = false;

    // var spriteManagerPlayer = new BABYLON.SpriteManager("playerManager", "resources/yasuo_animation.png", 2, 64, scene, 0.01, BABYLON.Texture.NEAREST_SAMPLINGMODE);
    // var persoSprite = new BABYLON.Sprite("pp", spriteManagerPlayer);
    // persoSprite.playAnimation(1, 5, true, 100);
    createPlayer(scene);

    // background
    var background = BABYLON.MeshBuilder.CreatePlane("background", {width: 20, height: 20}, scene);
    var material = new BABYLON.StandardMaterial("texture1", scene);
    material.diffuseTexture = new BABYLON.Texture("resources/background_lands.png", scene, false, true, BABYLON.Texture.NEAREST_SAMPLINGMODE);
    background.material = material;

    // boxes
    var cube = BABYLON.Mesh.CreateBox("crate", 1 , scene);
    cube.position.z = 0;
    cube.checkCollisions = true;
    var materialCube = new BABYLON.StandardMaterial("texturee", scene);
    materialCube.diffuseTexture = new BABYLON.Texture("resources/Capture2.jpg", scene, false, true, BABYLON.Texture.NEAREST_SAMPLINGMODE);
    cube.material = materialCube;

    var cube2 = BABYLON.Mesh.CreateBox("crate", 1 , scene);
    cube2.position.x = 2;
    cube2.position.y = 2;
    cube2.checkCollisions = true;

    //---moving
    var grounded = false; //is grounded flag
    var vy = 0; // jump/falling velocity
    
    
    //update loop
    scene.registerAfterRender(function()
    {
        updatePlayer(map, scene);

        //move background
        background.material.diffuseTexture.uOffset += xdep/100;

        //cam and background follow player
        camera.position.x = player.position.x;
        background.position.x = player.position.x;
    });

    return scene;
}

