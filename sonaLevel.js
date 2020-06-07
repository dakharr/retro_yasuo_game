function sonaScene()
{
    var scene = new BABYLON.Scene(engine);
    
    var camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 2, -8), scene);
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(-2, 1, -2), scene);
    light.intensity = 0.7;

    camera.position = new BABYLON.Vector3(0,0, -8);

    //-------- input --------

    var block = buildBlock(scene, 0);

    var chunk = new Array();
    
    chunk.push(addChunk(block, new BABYLON.Vector3(-15, -2, 0)));
    chunk.push(addChunk(block, new BABYLON.Vector3(-10, -2, 0)));
    chunk.push(addChunk(block, new BABYLON.Vector3(-5, -2, 0)));
    chunk.push(addChunk(block, new BABYLON.Vector3(0, -2, 0)));
    chunk.push(addChunk(block, new BABYLON.Vector3(5, -2, 0)));
    chunk.push(addChunk(block, new BABYLON.Vector3(10, -2, 0)));

    
    
    scene.registerAfterRender(function()
    {

        chunk.forEach(element => {
            element.forEach(block => {
                block.position.x -= 0.1;
            })
        })

        if(chunk[0][0].position.x <= -15)
        {
            //remove chunk and add new
            console.log(chunk[0][0].position.x);
            var removedChunk = chunk.shift();
            freeChunk(removedChunk);
            chunk.push(addChunk(block, new BABYLON.Vector3(10, -2, 0)));
            console.log("aa");
        }
    });

    return scene;
}

function addChunk(block, position)
{
    var chunk = new Array()
    for(let h = 0; h < 4; h++)
    {
        for(let w = 0; w < 10; w++)
        {
            var pos = new BABYLON.Vector3(position.x + w/2, position.y + h/2, position.z + 0);
            chunk.push(instanceBlock(pos, block));
        }
    }

    return chunk;
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