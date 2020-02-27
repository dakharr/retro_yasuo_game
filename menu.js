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

    var paperSpriteM = new BABYLON.SpriteManager("paperManager", "resources/falling_paper.png", 2, 64, scene, 0.01, BABYLON.Texture.NEAREST_SAMPLINGMODE);
    var paperSprite = new BABYLON.Sprite("paper", paperSpriteM);
    paperSprite.position = new BABYLON.Vector3(7, 10, -1);
    paperSprite.playAnimation(1,5, true, 100);
    var tpyasSpriteM = new BABYLON.SpriteManager("yassManager", "resources/yasuo_animation.png", 8, 64, scene, 0.01, BABYLON.Texture.NEAREST_SAMPLINGMODE);
    var tpyasSprite = new BABYLON.Sprite("yass", tpyasSpriteM);
    tpyasSprite.position = new BABYLON.Vector3(7,5,0);
    tpyasSprite.size = 2;
    tpyasSprite.isVisible = false;


    var paperZoom = BABYLON.MeshBuilder.CreatePlane("paperzoom", {width: 6, height: 3}, scene);
    var mat = new BABYLON.StandardMaterial("papermat", scene);
    mat.diffuseTexture = new BABYLON.Texture("resources/paper.png", scene, false, true, BABYLON.Texture.NEAREST_SAMPLINGMODE);
    mat.diffuseTexture.hasAlpha = true;
    paperZoom.material = mat;
    paperZoom.position = new BABYLON.Vector3(7, 6, -2);
    paperZoom.isVisible = false;


    var tpTrigger = false;
    var tpTrigger2 = false;
    var tpDelay = 1000;
    var tpTimer = 0;
    var start = false;
    var drawPaperDelay = 1000;
    var drawPaperTrigger = false;

    //sound
    var music = new BABYLON.Sound("Music", "resources/yasuo_menu.mp3", scene, null, {loop: true, autoplay: true});
    BABYLON.Engine.audioEngine.setGlobalVolume(0.1);

    // background
    var background = BABYLON.MeshBuilder.CreatePlane("background", {width: 20, height: 20}, scene);
    var material = new BABYLON.StandardMaterial("texture1", scene);
    material.diffuseTexture = new BABYLON.Texture("resources/background_lands.png", scene, false, true, BABYLON.Texture.NEAREST_SAMPLINGMODE);
    background.material = material;
    background.position = new BABYLON.Vector3(5, 12, 1.2);

    // GUI
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("jUI");

    var text1 = new BABYLON.GUI.TextBlock();
    text1.text = "Press R to start";
    text1.fontFamily = "pixel";
    text1.color = "white";
    text1.fontSize = 32;
    text1.top = 300;
    advancedTexture.addControl(text1); 

    var textPaper = new BABYLON.GUI.TextBlock();
    textPaper.text = "";
    textPaper.fontFamily = "pixel";
    textPaper.color = "black";
    textPaper.fontSize = 32;
    textPaper.top = 0;
    textPaper.left = -200;

    advancedTexture.addControl(textPaper);

    scene.registerAfterRender(function()
    {
        if((map["r"] || map["R"]))
        {
            start = true;
            
            text1.text = "";

            if(drawPaperTrigger)
                loadNextLevel();
        };

        if(start)
            paperSprite.position.y -= 0.01;
            
        if(paperSprite.position.y < 6 && !tpTrigger)
        {
            music.stop();
            sprite.playAnimation(6,11, false, 25);
            particleSystem.stop();
            tpTimer = Date.now() + tpDelay;
            tpTrigger = true;
        }

        if(tpTrigger && !tpTrigger2 && tpTimer < Date.now())
        {
            tpyasSprite.isVisible = true;
            tpyasSprite.playAnimation(30, 42, false, 50);
            paperSprite.isVisible = false;
            tpTrigger2 = true;
            tpTimer = Date.now() + drawPaperDelay;
        }

        if(tpTrigger && tpTrigger2 && !drawPaperTrigger && tpTimer < Date.now())
        {
            paperZoom.isVisible = true;
            textPaper.text = "DJ Sona concert is the place to be !";
            drawPaperTrigger = true;
            text1.text = "press R to start the great quest";
        }
    });

    
    
    return scene;
}