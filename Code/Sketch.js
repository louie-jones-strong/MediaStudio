//global variables that will store the ToolManager color palette
//and the helper functions
var ToolManager = null;
var ColorP = null;
var Helpers = null;
var Layers = null;
var CanvasWidth = null;
var CanvasHeight = null;
var Template = null;
var PopupOpen = false;

var FileInput = null;

function setup()
{
	ScaleMousePos();
	//this disables the default right click behavior for this page
	document.addEventListener('contextmenu', event => {
		event.preventDefault();
	});

	//create a canvas to fill the content div from index.html
	var canvasContainer = select('#content');


	//create a ToolManager for storing the tools
	ToolManager = new Toolbox();

	Resize(canvasContainer.size().width - 10, canvasContainer.size().height - 10)

	// background(255);

	//create helper functions and the color palette
	Helpers = new HelperFunctions();
	ColorP = new ColorPalette();

	Template = new TemplateManager();

	Layers = new LayerManger();


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

	FileInput = createFileInput(handleFile);

	FileInput.parent(select("#header"));

	ClosePopup();
}

function draw()
{
	ScaleMousePos();
	ColorP.UpdateColors();
	//call the draw function on the selected tool
	ToolManager.Draw();

	RenderImage();
}

function RenderImage()
{
	clear();

	// Draw Under Layers
	Layers.DrawUnderLayers();

	// Draw current layer
	Layers.DrawSelectedLayer();

	// Draw Over Layers
	Layers.DrawOverLayers();
}

function keyPressed()
{
	ScaleMousePos();
	ToolManager.KeyPressed(key, keyCode);
}

function keyReleased()
{
	ScaleMousePos();
	ToolManager.KeyReleased(key, keyCode);
}

function keyTyped()
{
	ScaleMousePos();
	ToolManager.KeyTyped(key, keyCode);
}

function handleFile(file)
{
	console.log("handle file:", file);
	if (file.type === 'image')
	{
		console.log("Load image");
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
	else if (file.type === 'application' && file.subtype === 'json')
	{
		console.log("Loading template");
		Template.LoadTemplate(file.data)
	}

	FileInput.elt.value = null
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
	CanvasWidth = floor(width);
	CanvasHeight = floor(height);

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

	ToolManager.Reset()
}

function OpenPopup(popupHtml="")
{
	PopupOpen = true;
	let holder = select("#popupHolder");
	holder.elt.classList.remove("hide");

	let popup = createDiv();
	popup.parent(holder);
	popup.elt.classList.add("popup")
	popup.html(popupHtml)

	return popup;
}

function ClosePopup()
{
	PopupOpen = false;
	let holder = select("#popupHolder")
	holder.elt.classList.add("hide");
	holder.html("")
}
