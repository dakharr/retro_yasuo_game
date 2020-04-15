
var width;
var height;
var selectedBlock;

var block = ["resources/editor/void.png", "resources/editor/grassy_dirt.png", "resources/editor/dirt.png", "resources/editor/cave_dirt.png"];
var spawn = "resources/editor/spawn.png";
var exit = "resources/editor/exit.png";
var poro = "resources/editor/poro_editor.png";
var poroVolant = "resources/editor/poroVolant_editor.png";

var imgDiv = document.getElementById("palette");

for(var i = 0; i < block.length;i++)
{
    imgDiv.innerHTML += "<img src='"+block[i]+"' width='64' height='64' onclick=selectBlock('"+i+"')>";
}

imgDiv.innerHTML += "<br><img src='"+spawn+"' width='64' height='64' onclick=selectBlock('x')>";
imgDiv.innerHTML += "<img src='"+exit+"' width='64' height='64' onclick=selectBlock('e')>";
imgDiv.innerHTML += "<img src='"+poro+"' width='64' height='64' onclick=selectBlock('p')>";
imgDiv.innerHTML += "<img src='"+poroVolant+"' width='64' height='64' onclick=selectBlock('v')>";

var selectInfoTxt = document.getElementById("selectionInfo");


function generate()
{
    width = document.getElementById("map_width").value;
    height = document.getElementById("map_height").value;

    var tab = document.getElementById("tab");

    var htmlTab = "<table>";

    for(var y = 0;y<height;y++)
    {
        htmlTab += "<tr>";
        for(var x = 0; x < width; x++)
        {
            var id = x + "-" + y;
            var onclick = "updateBlock('"+ id+ "')";
            htmlTab += "<td id="+ id + " onclick=" + onclick +"><img id='img"+id+"' src='"+block[0]+"' width='64' height='64'></td>";
        }
        htmlTab += "</tr>";
    }

    htmlTab += "</table>";

    tab.innerHTML = htmlTab;
    
    document.getElementById("converterButton").hidden = false; //draw the export button
}

function selectBlock(select)
{
    selectedBlock = select;
    selectInfoTxt.innerHTML = "selected block " + select; 
}

function updateBlock(id)
{
    var index = block[selectedBlock];
    if(selectedBlock == "x")
        index = spawn;
    if(selectedBlock == "e")
        index = exit;
    if(selectedBlock == "p")
        index = poro;
    if(selectedBlock == "v")
        index = poroVolant;
    document.getElementById(id).innerHTML = "<img id='img"+id+"' src='"+ index +"' width='64' height='64'>";
}

function convertMap()
{
    var output= "";
    for(var y=0; y<height;y++)
    {
        output += "\"";
        for(var x=0; x<width;x++)
        {
            var imgsrc = document.getElementById("img"+x+"-"+y).src;
            //console.log(imgsrc);

            if(imgsrc.includes(spawn))
                output += "x ";
            else if(imgsrc.includes(exit))
                output += "e ";
            else if(imgsrc.includes(poro))
                output += "p ";
            else if(imgsrc.includes(poroVolant))
                output += "v ";

            else
            {
                for(var i=0; i<block.length;i++)
                {
                    if(imgsrc.includes(block[i]))
                    {
                        output += i +" ";
                    }
                }
            }
        }
        if(y!=height-1)
            output += "\\n\" + \n";
        else
            output += "\"\n";
    }

function loadMap(stringLevel)
{
    var array = stringLevel.split('\n');
    height = array.length;
    for (let i=0;i<height;i++){
        array[i]=array[i].split(' ');
    } 
    width = array[0].length;
    var htmlTab = "<table>";
    for(var y = 0;y<height;y++)
    {
        htmlTab += "<tr>";
        for(var x = 0; x < width; x++)
        {
            var truc = null;
            if(array[x][y] == "x")
                truc = spawn;
            else if(array[x][y] == "e")
                truc = exit;
            else if(array[x][y] == "p")
                truc = poro;
            else if(array[x][y] == "v")
                truc = poroVolant;
            for(var i = 0; i < block.length;i++)
            { 
                if (array[x][y]==i) truc = block[i]; 
            }
            var id = x + "-" + y;
            var onclick = "updateBlock('"+ id+ "')";
            htmlTab += "<td id="+ id + " onclick=" + onclick +"> <img id='img"+id+"' src='"+truc+"' width='64' height='64'> </td>";
        }
        htmlTab += "</tr>";
    }
    htmlTab += "</table>";

}

    console.log(output);
    var out = document.getElementById("output");
    out.innerHTML = output;
    out.select();

    document.execCommand("copy");
    var elem = document.getElementById("hide");

    if(elem != null)
        elem.id = "fadeOutAnim";
    else
    {
        elem = document.getElementById("fadeOutAnim");
        var newo = elem.cloneNode(true);
        elem.parentNode.replaceChild(newo, elem);
    }
    
}