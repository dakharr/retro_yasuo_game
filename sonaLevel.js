function sonaScene()
{
    var scene = new BABYLON.Scene(engine);
    
    var camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 2, -8), scene);
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(-2, 1, -2), scene);
    light.intensity = 0.7;

    camera.position = new BABYLON.Vector3(0,0, -8);

    //-------- input --------

    var originalBlocks = initOriginalsBlock(scene);

    var chunk = new Array();
    
    chunk.push(addChunk(c1, new BABYLON.Vector3(-15, -2, 0), originalBlocks));
    chunk.push(addChunk(c1, new BABYLON.Vector3(-10, -2, 0), originalBlocks));
    chunk.push(addChunk(c1, new BABYLON.Vector3(-5, -2, 0), originalBlocks));
    chunk.push(addChunk(c1, new BABYLON.Vector3(0, -2, 0), originalBlocks));
    chunk.push(addChunk(c1, new BABYLON.Vector3(5, -2, 0), originalBlocks));
    chunk.push(addChunk(c1, new BABYLON.Vector3(10, -2, 0), originalBlocks));

    
    
    scene.registerAfterRender(function()
    {

        chunk.forEach(element => {
            element.forEach(block => {
                block.position.x -= 0.05;
            })
        })

        if(chunk[0][0].position.x <= -15)
        {
            //remove chunk and add new
            console.log(chunk[0][0].position.x);
            var removedChunk = chunk.shift();
            freeChunk(removedChunk);
            chunk.push(addChunk(getRandomChunkModel(), new BABYLON.Vector3(chunk[chunk.length-1][chunk[chunk.length-1].length-1].position.x, -2, 0), originalBlocks));
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
"1 1 1 1 1 1 1 1 1 1 \n" +
"1 1 1 1 1 1 1 1 1 1 ";

var c2 = 
"0 0 0 0 0 0 0 0 0 0 \n" +
"0 0 0 1 1 1 1 0 0 0 \n" +
"1 1 1 1 1 1 1 1 1 1 \n" +
"1 1 1 1 1 1 1 1 1 1 ";

var c3 = 
"0 0 0 0 1 1 0 0 0 0 \n" +
"0 0 0 1 1 1 0 0 0 0 \n" +
"1 1 1 1 1 1 0 0 0 0 \n" +
"1 1 1 1 1 1 1 1 1 1 ";