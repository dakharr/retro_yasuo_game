var spawnPosition;
var blockList;

function createScene()
{
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);
    scene.collisionsEnabled = true;

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 2, -8), scene);
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

    var endBlockList = new Array();

    loadLevel(stringLevel1, scene, endBlockList);

    player.position = spawnPosition.clone();
    
    //update loop
    scene.registerAfterRender(function()
    {
        updatePlayer(map, scene);
        //move background
        background.material.diffuseTexture.uOffset += xdep/100;

        //cam and background follow player
        camera.position.x = player.position.x;
        background.position.x = player.position.x;

        //check if player is on the endblock
        for(let i=0;i<endBlockList.length;i++)
        {
            if(endBlockList[i].intersectsPoint(player.position))
                console.log("this is the end...");
        }
    });

    return scene;
}

function loadLevel(stringLevel, scene, endBlockList)
{
    blockList = [];
    var stringLine = stringLevel.split('\n');

    var levelHeight = stringLine.length;
    var levelWidth = stringLine[0].split(' ').length;

    for(let height=0; height<levelHeight;height++)
    {
        var caracter = stringLine[height].split(' ');
        
        for(let width=0; width<levelWidth;width++)
        {
            if(caracter[width] == "1")
            {
                var pos = new BABYLON.Vector3(width/2,(levelHeight - height)/2, 0);
                blockList.push(buildBlock(pos, scene, 0));
            }
            if(caracter[width] == "2")
            {
                var pos = new BABYLON.Vector3(width/2,(levelHeight - height)/2, 0);
                blockList.push(buildBlock(pos, scene, 1));
            }
            else if(caracter[width] == "x")
                spawnPosition = new BABYLON.Vector3(width/2, (levelHeight - height)/2, 0); //mal spawnposition
            else if(caracter[width] == "e")
            {
                var endblock = BABYLON.Mesh.CreateBox('endbox', 0.5, scene); // mal liste endblock
                endblock.position = new BABYLON.Vector3(width/2, (levelHeight - height)/2, 0);
                endblock.isVisible = false;
                endBlockList.push(endblock);
            }
        }
    }
}

function buildBlock(position, scene, textureIndex)
{
    var columns = 6;
    var rows = 6;
    var faceUV = new Array(6);

    for(let i=0;i<6;i++)
        faceUV[i] = new BABYLON.Vector4(i/columns, textureIndex/rows, (i+1)/columns, (textureIndex+1)/rows);

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
    newblock.position = position;
    newblock.checkCollisions = true;
    newblock.material = mat;

    return newblock;
}

