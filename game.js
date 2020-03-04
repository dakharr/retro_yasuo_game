function createScene(stringLevel)
{
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);
    scene.collisionsEnabled = true;

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 3.5, -8), scene);
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

    // background
    var background = BABYLON.MeshBuilder.CreatePlane("background", {width: 20, height: 20}, scene);
    var material = new BABYLON.StandardMaterial("texture1", scene);
    material.diffuseTexture = new BABYLON.Texture("resources/background_lands.png", scene, false, true, BABYLON.Texture.NEAREST_SAMPLINGMODE);
    background.material = material;
    background.position = new BABYLON.Vector3(0, 4, 1.2);

    var underground_backround = BABYLON.MeshBuilder.CreatePlane("background", {width: 20, height: 20}, scene);
    var under_mat = new BABYLON.StandardMaterial("texture2", scene);
    under_mat.diffuseTexture = new BABYLON.Texture("resources/background_underground.png", scene, false, true, BABYLON.Texture.NEAREST_SAMPLINGMODE);
    under_mat.diffuseTexture.hasAlpha = true;
    underground_backround.material = under_mat;
    underground_backround.position = new BABYLON.Vector3(0, -8.9, 0.25);

    var first_backround = BABYLON.MeshBuilder.CreatePlane("background", {width: 20, height: 5}, scene);
    var first_mat = new BABYLON.StandardMaterial("texture3", scene);
    first_mat.diffuseTexture = new BABYLON.Texture("resources/first_background.png", scene, false, true, BABYLON.Texture.NEAREST_SAMPLINGMODE);
    first_mat.diffuseTexture.hasAlpha = true;
    first_backround.material = first_mat;
    first_backround.position = new BABYLON.Vector3(0, 1, 1.1);

    var endBlockList = new Array();
    var endBlock = null;
    var spawnPoints = new Array();
    var poros = new Array();


    endBlock = loadLevel(stringLevel, scene, spawnPoints, poros);

    //player.position = spawnPoints[0].clone();//spawnPoints[0];//spawnPosition.clone();
    playerSetPosition(spawnPoints[0].clone());
    
    //update loop
    scene.registerAfterRender(function()
    {
        var deltatime = engine.getDeltaTime();
        updatePlayer(map, scene, spawnPoints[0].clone(), poros);
        for(let i=0;i<poros.length;i++)
            poros[i].update(spawnPoints[0].clone());
        
        //move background
        background.material.diffuseTexture.uOffset += trueXDeplacement/100;
        underground_backround.material.diffuseTexture.uOffset += trueXDeplacement/20;
        first_backround.material.diffuseTexture.uOffset += trueXDeplacement/30;

        //cam and background follow player
        camera.position.x = player.position.x;
        if(player.position.y - camera.position.y > 1)
            camera.position.y = player.position.y-1;
        if(player.position.y - camera.position.y < 0 && camera.position.y > 3.5)
            camera.position.y = player.position.y;

        //update backgrounds
        background.position.x = player.position.x;
        background.position.y = camera.position.y + 4;
        underground_backround.position.x = player.position.x;
        first_backround.position.x = player.position.x;

        //check if player is on the endblock
        // for(let i=0;i<endBlockList.length;i++)
        // {
        //     if(endBlockList[i].intersectsPoint(player.position))
        //     {
        //         console.log("this is the end...");
        //         loadNextLevel();
        //     }
        // }

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
            else if(caracter[width] == "x")
            {
                var spawnPosition = new BABYLON.Vector3(width/2, (levelHeight - height)/2, 0); //mal spawnposition
                spawnPoints.push(spawnPosition);
            }
            else if(caracter[width] == "e")
            {
                var swordSpriteManager = new BABYLON.SpriteManager("swordSM", "resources/sword.png", 2, 64, scene, 0.01, BABYLON.Texture.NEAREST_SAMPLINGMODE);
                var swordSprite = new BABYLON.Sprite("sword", swordSpriteManager);
                swordSprite.playAnimation(0,4, true, 100);
                swordSprite.position = new BABYLON.Vector3(width/2, (levelHeight - height)/2 + 0.25, 0);
                //var endblock = BABYLON.Mesh.CreateBox('endbox', 0.5, scene); // mal liste endblock
                //endblock.position = new BABYLON.Vector3(width/2, (levelHeight - height)/2, 0);
                //endblock.isVisible = false;
                //endBlockList.push(endblock);
                endBlock = swordSprite;
            }
            else if(caracter[width] == "p")
            {
                var poroSpriteManager = new BABYLON.SpriteManager("poroSM", "resources/poro.png", 2, 64, scene, 0.01, BABYLON.Texture.NEAREST_SAMPLINGMODE);
                poros.push(new poro(width/2, (levelHeight - height)/2, 2, poroSpriteManager, scene));
                
            }
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

    for(let i=0;i<2;i++)
        blockList.push(buildBlock(scene, i));

    return blockList;
}