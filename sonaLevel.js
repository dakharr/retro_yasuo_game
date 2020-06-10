function sonaScene()
{
    var scene = new BABYLON.Scene(engine);
    scene.collisionsEnabled = true;
    
    var camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 2, -8), scene);
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(-2, 1, -2), scene);
    light.intensity = 0.7;

    camera.position = new BABYLON.Vector3(0,0, -8);

    createPlayer(scene);
    playerSetPosition(new BABYLON.Vector3(0, 5, 0));

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

    //----- particle system------

    //particle system
    var fountain = BABYLON.Mesh.CreateBox("fountain", 1, scene);
    fountain.position = new BABYLON.Vector3(0, 0, 0);
    fountain.rotate(BABYLON.Axis.Z, Math.PI/2, BABYLON.Space.WORLD);
    fountain.isVisible = false;



    var particleSystem = new BABYLON.ParticleSystem("particles", 1000, scene);
    particleSystem.particleTexture = new BABYLON.Texture("resources/musical_note.png", scene, false, true, BABYLON.Texture.NEAREST_SAMPLINGMODE);

    particleSystem.color1 = new BABYLON.Color4(0.94, 0.04, 0.04);
    particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

    particleSystem.emitter = fountain;
    particleSystem.minEmitBox = new BABYLON.Vector3(-10, -10, 0);
    particleSystem.maxEmitBox = new BABYLON.Vector3(10, 10, 0);

    //particleSystem.rotate(BABYLON.Axis.Z, Math.PI/2, BABYLON.Space.WORLD);

    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.25;
    
    particleSystem.minLifeTime = 0.3;
    particleSystem.maxLifeTime = 1.5;

    

    particleSystem.emitRate = 50;

    particleSystem.minAngularSpeed = -Math.PI;
    particleSystem.maxAngularSpeed = Math.PI;

    particleSystem.minEmitPower = 2;
    particleSystem.maxEmitPower = 5;
    particleSystem.updateSpeed = 0.005;

    particleSystem.start();

    // --------------------

    var swapKinetic = new BABYLON.Sound("swap", "resources/soundEffects/swapKinetic.mp3", scene);
    var swapConcussive= new BABYLON.Sound("swap", "resources/soundEffects/swapConcussive.mp3", scene);
    var swapEthereal = new BABYLON.Sound("swap", "resources/soundEffects/swapEthereal.mp3", scene);
    var levelState = 0;

    var slowScrollSpeed = 0.0025;
    var baseScrollSpeed = 0.005;
    var mediumScrollSpeed = 0.006;
    var fastScrollSpeed = 0.0075;
    var scrollSpeed = slowScrollSpeed;

    var originalBlocks = initOriginalsBlock(scene);

    var chunk = new Array();
    
    chunk.push(addChunk(c1, new BABYLON.Vector3(-15, -2, 0), originalBlocks));
    chunk.push(addChunk(c1, new BABYLON.Vector3(-10, -2, 0), originalBlocks));
    chunk.push(addChunk(c1, new BABYLON.Vector3(-5, -2, 0), originalBlocks));
    chunk.push(addChunk(c1, new BABYLON.Vector3(0, -2, 0), originalBlocks));
    chunk.push(addChunk(c1, new BABYLON.Vector3(5, -2, 0), originalBlocks));
    chunk.push(addChunk(c1, new BABYLON.Vector3(10, -2, 0), originalBlocks));

    var startTime = Date.now();
    
    scene.registerAfterRender(function()
    {
        var deltatime = engine.getDeltaTime();

        if((Date.now() - startTime) > 30000)
        {
            startTime = Date.now();
            console.log("next");

            levelState++;

            if(levelState < 4)
            {
                music.stop();
                music.dispose();
            }

            
            if(levelState == 1)
            {
                particleSystem.color1 = new BABYLON.Color4(0, 0.35, 0.89, 1.0);
                particleSystem.color2 = new BABYLON.Color4(0, 0.86, 0.47, 1.0);

                particleSystem.minEmitPower = 5;
                particleSystem.maxEmitPower = 10;
                particleSystem.updateSpeed = 0.01;
                scrollSpeed = baseScrollSpeed;
                swapKinetic.play();
                music = new BABYLON.Sound("Music", "resources/music/kinetic.mp3", audioScene, null, {loop: true, autoplay: true, offset: 77});
            }
            else if(levelState == 2)
            {
                particleSystem.color1 = new BABYLON.Color4(0.90, 0.06, 0.06, 1.0);
                particleSystem.color2 = new BABYLON.Color4(1, 0.65, 0.20, 1.0);
                scrollSpeed = mediumScrollSpeed;
                swapConcussive.play();
                music = new BABYLON.Sound("Music", "resources/music/concussive.mp3", audioScene, null, {loop: true, autoplay: true, offset: 89});
            }
            else if(levelState == 3)
            {
                particleSystem.color1 = new BABYLON.Color4(0.80, 0.20, 1.0, 1.0);
                particleSystem.color2 = new BABYLON.Color4(0.33, 0.2, 1.0, 1.0);

                particleSystem.updateSpeed = 0.02;
                scrollSpeed = fastScrollSpeed;
                swapEthereal.play();
                music = new BABYLON.Sound("Music", "resources/music/ethereal.mp3", audioScene, null, {loop: true, autoplay: true, offset: 90});
            }
            else
            {
                particleSystem.minEmitPower = 2;
                particleSystem.maxEmitPower = 4;
                particleSystem.updateSpeed = 0.005;
                scrollSpeed = 0;
            }
                
        }

        updatePlayer(map, scene, new BABYLON.Vector3(0, 5, 0), new Array(), true, -scrollSpeed);

        chunk.forEach(element => {
            element.forEach(block => {
                block.position.x -= scrollSpeed*deltatime;
            })
        })

        if(chunk[0][0].position.x <= -15)
        {
            //remove chunk and add new
            console.log(chunk[0][0].position.x);
            var removedChunk = chunk.shift();
            freeChunk(removedChunk);
            chunk.push(addChunk(getRandomChunkModel(), new BABYLON.Vector3(chunk[chunk.length-1][chunk[chunk.length-1].length-1].position.x+0.5, -2, 0), originalBlocks));
            console.log("aa");
        }
    });

    return scene;
}

function addChunk(chunkModel, position, listBlock)
{
    return loadchunk(chunkModel, position, listBlock);
}

function freeChunk(chunk)
{
    chunk.forEach(block => {
        block.dispose();
    })
}

function instanceBlock(position, block)
{
    var instance = block.createInstance("blockInstance");
    instance.position = position;
    instance.checkCollisions = true;

    return instance;
}

function loadchunk(stringChunk, posoffset, originalBlockList)
{
    chunkBlocks = new Array();
    var stringLine = stringChunk.split('\n');

    var levelHeight = stringLine.length;
    var levelWidth = stringLine[0].split(' ').length;

    for(let height = 0; height<levelHeight;height++)
    {
        var caracter = stringLine[height].split(' ');

        for(let width = 0; width < levelWidth; width++)
        {
            var pos = new BABYLON.Vector3(width/2 + posoffset.x, (levelHeight - height)/2 + posoffset.y, 0 + posoffset.z);
            
            switch(caracter[width])
            {
                case "1":
                    chunkBlocks.push(instanceBlock(pos, originalBlockList[0]));
                    break;
                case "2":
                    chunkBlocks.push(instanceBlock(pos, originalBlockList[1]));
                    break;
                case "3":
                    chunkBlocks.push(instanceBlock(pos, originalBlockList[2]));
                    break;
                case "4":
                    chunkBlocks.push(instanceBlock(pos, originalBlockList[3]));
            }
        }
    }

    return chunkBlocks;
}

function getRandomChunkModel()
{
    var rand = Math.random()*100;
    if(rand < 30)
        return c1;
    else if(rand < 60)
        return c2;
    else
        return c3;
}

var c1 = 
"0 0 0 0 0 0 0 0 0 0 \n" +
"0 0 0 0 0 0 0 0 0 0 \n" +
"4 4 4 4 4 4 4 4 4 4 \n" +
"4 4 4 4 4 4 4 4 4 4 ";

var c2 = 
"0 0 0 0 0 0 0 0 0 0 \n" +
"0 0 0 4 4 4 4 0 0 0 \n" +
"4 4 4 4 4 4 4 4 4 4 \n" +
"4 4 4 4 4 4 4 4 4 4 ";

var c3 = 
"0 0 0 0 4 4 0 0 0 0 \n" +
"0 0 0 4 4 4 0 0 0 0 \n" +
"4 4 4 4 4 4 0 0 0 0 \n" +
"4 4 4 4 4 4 4 4 4 4 ";