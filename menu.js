function createSceneMenu()
{
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(7, 6, -8), scene);
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

    var sp = new BABYLON.SpriteManager("sp", "resources/yasuo_intro_flute.png", 2, 128, scene, 0.01, BABYLON.Texture.NEAREST_SAMPLINGMODE);
    
    var sprite = new BABYLON.Sprite("sprite", sp);
    sprite.playAnimation(1,4, true, 300);
    sprite.height = 4;
    sprite.width = 4;
    sprite.position = new BABYLON.Vector3(7,6.5,0);

    var end;
    var spawn;
    loadLevel(stringLevelIntro, scene, end, spawn);
    var fountain = BABYLON.Mesh.CreateBox("fountain", 0.5, scene);
    fountain.position = new BABYLON.Vector3(7, 6, -1);
    fountain.isVisible = false;

    //particle system
    var particleSystem = new BABYLON.ParticleSystem("particles", 100, scene);
    particleSystem.particleTexture = new BABYLON.Texture("resources/musical_note.png", scene, false, true, BABYLON.Texture.NEAREST_SAMPLINGMODE);

    particleSystem.color1 = new BABYLON.Color4(0.94, 0.04, 0.04);
    particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
    particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);

    particleSystem.emitter = fountain;

    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
    
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.25;
    
    particleSystem.minLifeTime = 0.3;
    particleSystem.maxLifeTime = 1.5;

    particleSystem.emitRate = 5;

    particleSystem.minAngularSpeed = -Math.PI;
    particleSystem.maxAngularSpeed = Math.PI;

    particleSystem.minEmitPower = 0.5;
    particleSystem.maxEmitPower = 1;
    particleSystem.updateSpeed = 0.005;

    particleSystem.start();

    //sound
    var music = new BABYLON.Sound("Music", "resources/yasuo_dance.mp3", scene, null, {loop: true, autoplay: true});
    BABYLON.Engine.audioEngine.setGlobalVolume(0.1);

    // GUI
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("jUI");

    var text1 = new BABYLON.GUI.TextBlock();
    text1.text = "Press R to start";
    text1.color = "white";
    text1.fontSize = 32;
    text1.top = 250;
    advancedTexture.addControl(text1); 

    scene.registerAfterRender(function()
    {
        if((map["r"] || map["R"]))
        {
            inMenu = false;
            level1 = true;
        };
    });

    
    
    return scene;
}