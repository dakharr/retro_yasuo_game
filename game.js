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
    var perso = BABYLON.MeshBuilder.CreatePlane("player", {width: 1, height: 1}, scene);
    perso.position.z = -0.5;
    perso.position.y = 4;
    perso.checkCollisions = true;
    perso.ellipsoid = new BABYLON.Vector3(0.20, 0.5, 0.5); // collision "box"
    var persoMaterial = new BABYLON.StandardMaterial("yasuo", scene);
    persoMaterial.diffuseTexture = new BABYLON.Texture("resources/yasuo.png", scene, false, true, BABYLON.Texture.NEAREST_SAMPLINGMODE);
    persoMaterial.diffuseTexture.hasAlpha = true;
    perso.material = persoMaterial;

    // background
    var background = BABYLON.MeshBuilder.CreatePlane("background", {width: 20, height: 20}, scene);
    var material = new BABYLON.StandardMaterial("texture1", scene);
    material.diffuseTexture = new BABYLON.Texture("resources/background_lands.png", scene, false, true, BABYLON.Texture.NEAREST_SAMPLINGMODE);
    background.material = material;

    // boxes
    var cube = BABYLON.Mesh.CreateBox("crate", 1 , scene);
    cube.position.z = 0;
    cube.checkCollisions = true;

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
        //x deplacement
        var xdep = 0;
        if((map["q"] || map["Q"]))
        {
            xdep = -0.05;

            perso.material.diffuseTexture.uScale = -1;
            perso.material.diffuseTexture.vScale = 1;
        };
        if((map["d"] || map["D"]))
        {
            xdep = 0.05;

            perso.material.diffuseTexture.uScale = 1;
            perso.material.diffuseTexture.vScale = 1;

        };

        //jump
        if((map["Z"] || map["z"]) && grounded)
        {
            vy = Math.sqrt(0 - 2*-0.001*2);
        };
        //collision on x axis
        grounded = false;
        perso.material.diffuseColor = new BABYLON.Color3(1,1,1);

        //update player position
        var deltatime = scene.getEngine().getDeltaTime();
        perso.moveWithCollisions(new BABYLON.Vector3(xdep,vy,0));

        //move background
        background.material.diffuseTexture.uOffset += xdep/100;

        //cam and background follow player
        camera.position.x = perso.position.x;
        background.position.x = perso.position.x;


        //2 ray for more accuracy in the detection of the ground
        var raypos1 = new BABYLON.Vector3(perso.position.x+0.1, perso.position.y-0.5, perso.position.z);
        var ray1 = new BABYLON.Ray(raypos1, new BABYLON.Vector3(0, -1, 0), 0.01);
        var hit1 = scene.pickWithRay(ray1);

        var raypos2 = new BABYLON.Vector3(perso.position.x-0.1, perso.position.y-0.5, perso.position.z);
        var ray2 = new BABYLON.Ray(raypos2, new BABYLON.Vector3(0, -1, 0), 0.01);
        var hit2 = scene.pickWithRay(ray2);

        // let rayHelper1 = new BABYLON.RayHelper(ray1);		
        // rayHelper1.show(scene);
        // let rayHelper2 = new BABYLON.RayHelper(ray2);		
		// rayHelper2.show(scene);

        if(hit1.pickedMesh!=null || hit2.pickedMesh!=null)
        {
            perso.material.diffuseColor = new BABYLON.Color3(1,0,0);
            vy = 0;
            grounded = true;
        }
        else
        {
            vy -= 0.001;
        }
    });

    return scene;
}

