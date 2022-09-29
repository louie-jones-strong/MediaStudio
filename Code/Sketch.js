//global variables that will store the ToolManager color palette
//and the helper functions
var ToolManager = null;
var ColorP = null;
var Helpers = null;

function setup()
{

	//this disables the default right click behavior for this page
	document.addEventListener('contextmenu', event => {
		event.preventDefault();
	});

	//create a canvas to fill the content div from index.html
	var canvasContainer = select('#content');
	var canvas = createCanvas(canvasContainer.size().width - 10, canvasContainer.size().height - 10);
	canvas.id('canvas');
	canvas.parent("content");
	background(255);

	//create helper functions and the color palette
	Helpers = new HelperFunctions();
	ColorP = new ColorPalette();

	//create a ToolManager for storing the tools
	ToolManager = new Toolbox();

	//add the tools to the ToolManager.
	ToolManager.AddTool(new FreehandTool());
	ToolManager.AddTool(new LineToTool());
	ToolManager.AddTool(new SprayCanTool());
	ToolManager.AddTool(new MirrorDrawTool());
	ToolManager.AddTool(new ShapeTool());
	ToolManager.AddTool(new EditableShapeTool());
	ToolManager.AddTool(new FloodFillTool());
	ToolManager.AddTool(new TextTool());
	ToolManager.AddTool(new CopyPasteTool());
}

function draw()
{

	ColorP.UpdateColors();

	//call the draw function on the selected tool
	ToolManager.Draw();
}

function keyPressed()
{
	ToolManager.KeyPressed();
}

function keyReleased()
{
	ToolManager.KeyReleased();
}

function keyTyped()
{
	ToolManager.KeyTyped();
}