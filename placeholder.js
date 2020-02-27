function createScenePlaceholder()
{
    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 3.5, -8), scene);
    var cameraSpeed = 0.01;
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(-10, 1, -2), scene);
    light.intensity = 1;

    // background
    var background = BABYLON.MeshBuilder.CreatePlane("background", {width: 18, height: 9}, scene);
    var material = new BABYLON.StandardMaterial("texture1", scene);
    material.diffuseTexture = new BABYLON.Texture("resources/entry_background.png", scene, false, true, BABYLON.Texture.NEAREST_SAMPLINGMODE);
    background.material = material;
    background.position = new BABYLON.Vector3(0, 4, 1.2);

    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("jUI");

    var text1 = new BABYLON.GUI.TextBlock();
    text1.text = "Le niveau final arrivera avec la version finale ! :)";
    text1.fontFamily = "pixel";
    text1.color = "white";
    text1.fontSize = 32;
    //text1.top = 300;
    advancedTexture.addControl(text1); 


    return scene;
}