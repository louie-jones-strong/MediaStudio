//global variables that will store the ToolManager color palette
//and the helper functions
var ToolManager = null;
var ColorP = null;
var Helpers = null;
var Layers = null;
var CanvasWidth = null;
var CanvasHeight = null;

function setup()
{
	ScaleMousePos();
	//this disables the default right click behavior for this page
	document.addEventListener('contextmenu', event => {
		event.preventDefault();
	});

	//create a canvas to fill the content div from index.html
	var canvasContainer = select('#content');

	Resize(canvasContainer.size().width - 10, canvasContainer.size().height - 10)

	// background(255);

	//create helper functions and the color palette
	Helpers = new HelperFunctions();
	ColorP = new ColorPalette();

	Layers = new LayerManger();

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

	input = createFileInput(handleFile);

	input.parent(select("#header"));



}

function draw()
{
	ScaleMousePos();
	clear();


	ColorP.UpdateColors();

	// Draw Under Layers
	Layers.DrawUnderLayers();

	// Draw current layer
	Layers.DrawSelectedLayer();

	//call the draw function on the selected tool
	ToolManager.Draw();

	// Draw Over Layers
	Layers.DrawOverLayers();
}

function keyPressed()
{
	ScaleMousePos();
	ToolManager.KeyPressed();
}

function keyReleased()
{
	ScaleMousePos();
	ToolManager.KeyReleased();
}

function keyTyped()
{
	ScaleMousePos();
	ToolManager.KeyTyped();
}

function handleFile(file)
{
	console.log("handle file:", file);
	if (file.type === 'image')
	{
		loadImage(
			file.data,
			img => {
				ResizeToFit(img.width, img.height)
				let layer = new Layer(Layers.Layers.length, file.name, img);
				Layers.AddLayer(layer);
			},
			() => print('Image Failed to Load: '+ file),
		);
	}
}

function ScaleMousePos()
{
	// as of the latest version we don't need to scale but pixel density
	// let d = pixelDensity();


	mousePosX = mouseX; // / d;
	mousePosY = mouseY; // / d;
}

function ResizeToFit(contentWidth, contentHeight)
{
	let newWidth = Math.max(CanvasWidth, contentWidth);
	let newHeight = Math.max(CanvasHeight, contentHeight);

	if (newWidth > CanvasWidth ||
		newHeight > CanvasHeight)
	{
		Resize(newWidth, newHeight)
	}
}

function Resize(width, height)
{
	// set width and height
	CanvasWidth = width;
	CanvasHeight = height;

	// create canvas
	let canvas = createCanvas(CanvasWidth, CanvasHeight);
	canvas.id('canvas');
	canvas.elt.classList.add("canvas")
	canvas.parent("content");

	// resize layers
	if (Layers != null)
	{
		Layers.Resize(width, height);
	}
}