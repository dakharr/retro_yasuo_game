function createScene(stringLevel, biome)
{
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);
    scene.collisionsEnabled = true;

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 3.6, -8), scene);
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(-2, 1, -2), scene);
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
    createPlayer(scene);
    var tex_background;
    var tex_middleground;
    var tex_foreground;

    if(biome == 0)
    {
        tex_background = "resources/lands_background.png";
        tex_middleground = "resources/lands_middleground.png";
        tex_foreground = "resources/lands_foreground.png";
    }
    else
    {
        tex_background = "resources/cave_background.png";
        tex_middleground = "resources/cave_middleground.png";
        tex_foreground = "resources/cave_foreground.png";
    }

    // background grass
    var land_background = BABYLON.MeshBuilder.CreatePlane("background", {width: 18, height: 9}, scene);
    var material = new BABYLON.StandardMaterial("texture1", scene);
    material.diffuseTexture = new BABYLON.Texture(tex_background, scene, false, true, BABYLON.Texture.NEAREST_SAMPLINGMODE);
    land_background.material = material;
    land_background.position = new BABYLON.Vector3(0, 4, 1.2);

    var land_middleground = BABYLON.MeshBuilder.CreatePlane("background", {width: 18, height: 9}, scene);
    var under_mat = new BABYLON.StandardMaterial("texture2", scene);
    under_mat.diffuseTexture = new BABYLON.Texture(tex_middleground, scene, false, true, BABYLON.Texture.NEAREST_SAMPLINGMODE);
    under_mat.diffuseTexture.hasAlpha = true;
    land_middleground.material = under_mat;
    land_middleground.position = new BABYLON.Vector3(0, 4, 1.2);

    var land_foreground = BABYLON.MeshBuilder.CreatePlane("background", {width: 18, height: 9}, scene);
    var first_mat = new BABYLON.StandardMaterial("texture3", scene);
    first_mat.diffuseTexture = new BABYLON.Texture(tex_foreground, scene, false, true, BABYLON.Texture.NEAREST_SAMPLINGMODE);
    first_mat.diffuseTexture.hasAlpha = true;
    land_foreground.material = first_mat;
    land_foreground.position = new BABYLON.Vector3(0, 4, 1.2);



    //background cave
    // var cave_background = BABYLON.MeshBuilder.CreatePlane("background", {width: 18, height: 9}, scene);
    // var cave_background_mat = new BABYLON.StandardMaterial("texture1", scene);
    // cave_background_mat.diffuseTexture = new BABYLON.Texture("resources/cave_background.png", scene, false, true, BABYLON.Texture.NEAREST_SAMPLINGMODE);
    // cave_background.material = cave_background_mat;
    // cave_background.position = new BABYLON.Vector3(0, 4, 1.2);

    // var cave_middleground = BABYLON.MeshBuilder.CreatePlane("background", {width: 18, height: 9}, scene);
    // var cave_middleground_mat = new BABYLON.StandardMaterial("texture1", scene);
    // cave_middleground_mat.diffuseTexture = new BABYLON.Texture("resources/cave_middleground.png", scene, false, true, BABYLON.Texture.NEAREST_SAMPLINGMODE);
    // cave_middleground_mat.diffuseTexture.hasAlpha = true;
    // cave_middleground.material = cave_middleground_mat;
    // cave_middleground.position = new BABYLON.Vector3(0, 4, 1.2);

    // var cave_foreground = BABYLON.MeshBuilder.CreatePlane("background", {width: 18, height: 9}, scene);
    // var cave_foreground_mat = new BABYLON.StandardMaterial("texture1", scene);
    // cave_foreground_mat.diffuseTexture = new BABYLON.Texture("resources/cave_foreground.png", scene, false, true, BABYLON.Texture.NEAREST_SAMPLINGMODE);
    // cave_foreground_mat.diffuseTexture.hasAlpha = true;
    // cave_foreground.material = cave_foreground_mat;
    // cave_foreground.position = new BABYLON.Vector3(0, 4, 1.2);


    var background;
    var middleground;
    var foreground;

    background = land_background;
    middleground = land_middleground;
    foreground = land_foreground;

    var endBlock = null;
    var spawnPoints = new Array();
    var poros = new Array();


    endBlock = loadLevel(stringLevel.level, scene, spawnPoints, poros);

    playerSetPosition(spawnPoints[0].clone());

    //text
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("jUI");
    var fadingDelay = 2500 + Date.now();
    var text1 = new BABYLON.GUI.TextBlock();
    text1.text = stringLevel.name;
    text1.fontFamily = "pixel";
    text1.color = "white";
    text1.fontSize = 32;
    text1.top = 0;
    advancedTexture.addControl(text1); 
    
    //update loop
    scene.registerAfterRender(function()
    {
        var deltatime = engine.getDeltaTime();
        updatePlayer(map, scene, spawnPoints[0].clone(), poros);

        for(let i=0;i<poros.length;i++)
            poros[i].update(spawnPoints[0].clone());


        //fading name level
        if(text1.alpha != 0 && fadingDelay < Date.now())
        {
            text1.alpha = 0;
        }
        
        //move background
        background.material.diffuseTexture.uOffset += trueXDeplacement/100;
        middleground.material.diffuseTexture.uOffset += trueXDeplacement/50;
        foreground.material.diffuseTexture.uOffset += trueXDeplacement/20;
        //underground_backround.material.diffuseTexture.uOffset += trueXDeplacement/20;
        //first_backround.material.diffuseTexture.uOffset += trueXDeplacement/30;

        //cam and background follow player
        camera.position.x = player.position.x;
        if(player.position.y - camera.position.y > 1)
            camera.position.y = player.position.y-1;
        if(player.position.y - camera.position.y < 0 && camera.position.y > 3.5)
            camera.position.y = player.position.y;
        if(camera.position.y < 3.6)
            camera.position.y = 3.6;


        //update backgrounds
        background.position.x = player.position.x;
        background.position.y = camera.position.y;// + 4;
        middleground.position.x = player.position.x;
        middleground.position.y = camera.position.y;
        foreground.position.x = player.position.x;
        //underground_backround.position.x = player.position.x;
        //first_backround.position.x = player.position.x;

        //new endlevel checking
        if(endBlock == null)
        {
            console.error("ya pas de block fin de niveau !!!");
        }
        else
        {
            if(BABYLON.Vector3.Distance(player.position, endBlock.position) < 1)
            {
                console.log("this is the end...");
                loadNextLevel();
            }
        }
        
    });

    return scene;
}

function loadLevel(stringLevel, scene, spawnPoints, poros)
{
    var stringLine = stringLevel.split('\n');

    var levelHeight = stringLine.length;
    var levelWidth = stringLine[0].split(' ').length;

    //init blocks
    var blockList = initOriginalsBlock(scene);
    var endBlock = null;

    var swordSpriteManager = new BABYLON.SpriteManager("swordSM", "resources/sword.png", 2, 64, scene, 0.01, BABYLON.Texture.NEAREST_SAMPLINGMODE);
    var poroSpriteManager = new BABYLON.SpriteManager("poroSM", "resources/poro.png", 50, 64, scene, 0.01, BABYLON.Texture.NEAREST_SAMPLINGMODE);

    for(let height=0; height<levelHeight;height++)
    {
        var caracter = stringLine[height].split(' ');
        
        for(let width=0; width<levelWidth;width++)
        {
            if(caracter[width] == "1")
            {
                var pos = new BABYLON.Vector3(width/2,(levelHeight - height)/2, 0);
                instanceBlock(pos, blockList[0]);
            }
            if(caracter[width] == "2")
            {
                var pos = new BABYLON.Vector3(width/2,(levelHeight - height)/2, 0);
                instanceBlock(pos, blockList[1]);
            }
            if(caracter[width] == "3")
            {
                var pos = new BABYLON.Vector3(width/2,(levelHeight - height)/2, 0);
                instanceBlock(pos, blockList[2]);
            }
            else if(caracter[width] == "x")
            {
                var spawnPosition = new BABYLON.Vector3(width/2, (levelHeight - height)/2, 0); //mal spawnposition
                spawnPoints.push(spawnPosition);
            }
            else if(caracter[width] == "e")
            {
                var swordSprite = new BABYLON.Sprite("sword", swordSpriteManager);
                swordSprite.playAnimation(0,4, true, 100);
                swordSprite.position = new BABYLON.Vector3(width/2, (levelHeight - height)/2 + 0.25, 0);
                endBlock = swordSprite;
            }
            else if(caracter[width] == "p")
                poros.push(new poro(width/2, (levelHeight - height)/2, 2, false, poroSpriteManager, scene));
            else if(caracter[width] == "v")
                poros.push(new poro(width/2, (levelHeight - height)/2, 2, true, poroSpriteManager, scene));
        }
    }

    return endBlock;
}

function buildBlock(scene, textureIndex)
{
    var columns = 6;
    var rows = 6;
    var faceUV = new Array(6);
    var textureOffset = 0.001; // pour fix les le clipping de la texture

    for(let i=0;i<6;i++)
        faceUV[i] = new BABYLON.Vector4(i/columns + textureOffset, textureIndex/rows + textureOffset, (i+1)/columns - textureOffset, (textureIndex+1)/rows - textureOffset);

    var options = {
        faceUV:faceUV,
        width: 0.5,
        height: 0.5,
        depth: 0.5,
        wrap:true };

    var mat = new BABYLON.StandardMaterial("blockmat", scene);
    var atlas = new BABYLON.Texture("resources/atlas.png", scene, false, true, BABYLON.Texture.NEAREST_SAMPLINGMODE);
    mat.diffuseTexture = atlas;
    var newblock = BABYLON.MeshBuilder.CreateBox('box', options, scene);
    newblock.position = new BABYLON.Vector3(0, -100, 0);
    newblock.material = mat;

    return newblock;
}

function instanceBlock(position, block)
{
    var instance = block.createInstance("blockInstance");
    instance.position = position;
    instance.checkCollisions = true;
}

function initOriginalsBlock(scene)
{
    var blockList = Array();

    for(let i=0;i<3;i++)
        blockList.push(buildBlock(scene, i));

    return blockList;
}