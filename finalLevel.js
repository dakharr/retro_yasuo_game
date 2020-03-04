function specialScene()
{
    var scene = new BABYLON.Scene(engine);
    
    var camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 2, -8), scene);
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(-2, 1, -2), scene);
    light.intensity = 0.7;

    camera.position = new BABYLON.Vector3(0,0, -8);

    var soundBoard = BABYLON.MeshBuilder.CreatePlane("board", {width:3, height:7}, scene);
    soundBoard.position = new BABYLON.Vector3(0, 0,0);
    soundBoard.rotation = new BABYLON.Vector3(Math.PI*1/3,0, 0); 

    var mat = new BABYLON.StandardMaterial("tex1", scene);
    mat.diffuseTexture = new BABYLON.Texture("resources/soundboard.png", scene, false, true, BABYLON.Texture.NEAREST_SAMPLINGMODE);
    soundBoard.material = mat;

    var music = new BABYLON.Sound("Music", "resources/dj_sona_kinetic.mp3", scene, null, {loop: false, autoplay: true});
    BABYLON.Engine.audioEngine.setGlobalVolume(0.1);
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

    var startposL = new BABYLON.Vector3(-0.75, 1.8, 3);
    var endposL = new BABYLON.Vector3(-0.75, -1.8, -3);

    var startposR = new BABYLON.Vector3(0.75, 1.8, 3);
    var endposR = new BABYLON.Vector3(0.75, -1.8, -3);

    var tilespeed = 0.014;

    var listCube = new Array();

    var musicStartTime = Date.now();
    var hitIndex = 0;

    var stop = false;
    scene.registerAfterRender(function()
    {

        if(map["z"])
        {
            listCube.push(new rectangle(startposL, endposL, tilespeed, scene));
        }

        if(map["e"])
        {
            listCube.push(new rectangle(startposR, endposR, tilespeed, scene));
        }

        if(musicStartTime + musichit[hitIndex] < Date.now() && !stop)
        {
            listCube.push(new rectangle(startposL, endposL, tilespeed, scene));
            
            hitIndex++;
            
            if(hitIndex == musichit.length)
            {
                stop = true;
                console.log("end of the track");
            }
                
        }

        listCube.forEach(element => {
            element.update();
        });
    });

    return scene;
}

class rectangle
{
    constructor(startpos, endpos, speed, scene)
    {
        this.rectangle = BABYLON.Mesh.CreateBox('cube', 0.5, scene);
        this.speed = speed;
        this.startTime = Date.now();
        this.distance = BABYLON.Vector3.Distance(startpos, endpos);
        this.startpos = startpos;
        this.endpos = endpos;
    }

    update()
    {
        var dst = (Date.now() - this.startTime) * this.speed;
        var frac = dst / this.distance;
        this.rectangle.position = BABYLON.Vector3.Lerp(this.startpos, this.endpos, frac);
    }
}

var musichit = [
    500,750, 1000, 1250, 1500, 2000
    //1000, 3000, 6000
];