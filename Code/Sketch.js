var ToolManager = null;
var ColorP = null;
var Helpers = null;
var Layers = null;

var MainCanvas = null;
var CanvasWidth = null;
var CanvasHeight = null;
var Zoom = 1;
var CTRLPressed = false;

var Template = null;
var OverlayShowing = false;

var FileInput = null;

var MousePosX = 0;
var MousePosY = 0;
var MouseLeftPressed = false;
var MouseRightPressed = false;
var MouseCenterPressed = false;
var MouseLeftOrRightPressed = false;

var NormalizeAspectRatio = false;

function setup()
{
	HandleMouse();
	//this disables the default right click behavior for this page
	document.addEventListener('contextmenu', event => {
		event.preventDefault();
	});

	//create a ToolManager for storing the tools
	Brushes = new BrushManger();

	//create a ToolManager for storing the tools
	ToolManager = new Toolbox();

	//create a canvas to fill the content div from index.html
	let canvasContainer = select('#content');
	Resize(canvasContainer.size().width - 10, canvasContainer.size().height - 10)

	//create helper functions and the color palette
	Helpers = new HelperFunctions();
	ColorP = new ColorPalette();


	Actions = new ActionsManger();
	Template = new TemplateManager();

	Layers = new LayerManger();


	//add the tools to the ToolManager.
	ToolManager.AddTool(new FreehandTool());
	ToolManager.AddTool(new LineToTool());
	ToolManager.AddTool(new SprayCanTool());
	// ToolManager.AddTool(new MirrorDrawTool());
	ToolManager.AddTool(new ShapeTool());
	ToolManager.AddTool(new EditableShapeTool());
	ToolManager.AddTool(new FloodFillTool());
	ToolManager.AddTool(new TextTool());
	ToolManager.AddTool(new CopyPasteTool());

	FileInput = createFileInput(handleFile);
	FileInput.parent(select("#header"));


	OpenNewProject();

	SetZoom(Zoom)
}

function OpenNewProject()
{
	//create a canvas to fill the content div from index.html
	let canvasContainer = select('#content');
	Resize(CanvasWidth, CanvasHeight)

	ToolManager.Reset();
	Layers.SetBasicLayers();
	Layers.CurrentImg.loadPixels();

	let popup = OpenPopup(`<h1 class="center">Media Studio</h1>`, "thumbnail.png");
	let setupHolder = createDiv()
	setupHolder.id("setupHolder")
	setupHolder.parent(popup);

	let templateHolder = createDiv(`<h3 class="">Templates</h3>`)
	templateHolder.id("templatesHolder")
	templateHolder.parent(setupHolder);

	let templateDict = {}
	templateDict["Social Media Selling"] = "Templates/SocialMediaSelling.json"
	templateDict["Webcam Overlay"] = "Templates/WebcamOverlay.json"
	for (const key in templateDict)
	{
		let loadTemplateButton = createButton(key);
		loadTemplateButton.parent(templateHolder);
		let path = templateDict[key]
		loadTemplateButton.mousePressed(function(event)
		{
			loadJSON(
				path,
				text => {
					console.log(text);
					Template.LoadTemplate(text)
				},
				() => print('Failed to Load: '+ path),
			)
		});
	}


	let uploadTemplate = createFileInput(handleFile);
	uploadTemplate.elt.accept = "application/JSON"
	uploadTemplate.parent(templateHolder);


	let simpleImgHolder = createDiv("<h3>Start From an Image</h3>")
	simpleImgHolder.parent(setupHolder);

	let uploadImage = createFileInput(function(file)
	{
		console.log("handle file:", file);
		if (file.type === 'image')
		{
			console.log("Load image");
			loadImage(
				file.data,
				img => {
					Resize(img.width, img.height)

					ToolManager.Reset();
					Layers.ClearLayers()

					let layer = new Layer(file.name, img);
					Layers.AddLayer(layer);
					CloseOverlay()
				},
				() => print('Image Failed to Load: '+ file),
			);
		}
		FileInput.elt.value = null
	});
	uploadImage.elt.accept = "image/*"
	uploadImage.parent(simpleImgHolder);


	let blankCanvasHolder = createDiv(`<h3 class="">Blank Canvas</h3>
		<label for="canvasX">X:</label>
		<input id="canvasX" type="number" min=${1} max=${10000} step=1 value=${CanvasWidth}></input>
		<br>
		<label for="canvasY">Y:</label>
		<input id="canvasY" type="number" min=${1} max=${10000} step=1 value=${CanvasHeight}></input>`)
	blankCanvasHolder.id("blankCanvasHolder")
	blankCanvasHolder.parent(setupHolder);

	let createBlankCanvasButton = createButton(`Create Blank Canvas`);
	createBlankCanvasButton.parent(blankCanvasHolder);
	createBlankCanvasButton.mousePressed(function(event)
	{
		let x = select("#canvasX").elt.value
		let y = select("#canvasY").elt.value
		Zoom = 1

		if (x != CanvasWidth || y != CanvasHeight)
		{
			Resize(x, y)
		}
		CloseOverlay()
		ToolManager.SelectTool(ToolManager.Tools[0].Id);
	});



}


function draw()
{
	HandleMouse();
	if (!OverlayShowing)
	{
		ColorP.UpdateColors();
		Draggable.Update();
		//call the draw function on the selected tool
		ToolManager.Draw();
	}

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
	HandleMouse();
	ToolManager.KeyPressed(key, keyCode);

	if (keyCode === CONTROL)
	{
		CTRLPressed = true;
	}

	if (keyCode === SHIFT)
	{
		NormalizeAspectRatio = true;
	}
}

function keyReleased()
{
	HandleMouse();
	ToolManager.KeyReleased(key, keyCode);

	if (keyCode === CONTROL)
	{
		CTRLPressed = false;
	}

	if (keyCode === SHIFT)
	{
		NormalizeAspectRatio = false;
	}
}

function keyTyped()
{
	HandleMouse();
	ToolManager.KeyTyped(key, keyCode);
}

function mouseWheel(event)
{
	if (CTRLPressed)
	{
		Zoom -= event.delta / 1000;
		SetZoom(Zoom)

		//block page scrolling
		return false;
	}
}

function SetZoom(zoom)
{
	zoom = Math.max(zoom, 0.1)
	Zoom = Math.min(zoom, 40)
	MainCanvas.elt.style.width = `${CanvasWidth * Zoom}px`
	MainCanvas.elt.style.height = `${CanvasHeight * Zoom}px`
	document.documentElement.style.setProperty('--canvasZoom', Zoom);
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
				let layer = new Layer(file.name, img);
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

function HandleMouse()
{
	// as of the latest version we don't need to scale but pixel density
	// let d = pixelDensity();

	MousePosX = mouseX; // / d;
	MousePosY = mouseY; // / d;

	MouseLeftPressed = mouseIsPressed && mouseButton === LEFT;
	MouseRightPressed = mouseIsPressed && mouseButton === RIGHT;
	MouseCenterPressed = mouseIsPressed && mouseButton === CENTER;
	MouseLeftOrRightPressed = MouseLeftPressed || MouseRightPressed;
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
	MainCanvas = createCanvas(CanvasWidth, CanvasHeight);
	MainCanvas.id('canvas');
	MainCanvas.elt.classList.add("canvas")
	MainCanvas.parent("content");

	// resize layers
	if (Layers != null)
	{
		Layers.Resize(width, height);
	}

	ToolManager.Reset()
}

function OpenPopup(popupHtml="", coverImg=null)
{
	let holder = ShowOverlay("")


	let popup = createDiv();

	if (coverImg != null)
	{
		popup.html(`<img src="${coverImg}" class="popupCover" alt="Cover Image" >`)
	}
	popup.parent(holder);
	popup.elt.classList.add("popup")

	let content = createDiv();
	content.parent(popup);
	content.html(popupHtml)
	content.elt.classList.add("popupContent")

	return content;
}

function ShowOverlay(overlayHtml="", fadeTimeSecs=-1)
{
	ToolManager.SelectTool(null)
	OverlayShowing = true;
	let holder = select("#overlayHolder");
	holder.elt.classList.remove("hide");
	holder.elt.classList.add("show");
	holder.html(overlayHtml)

	if (fadeTimeSecs > 0)
	{
		setTimeout(CloseOverlay, fadeTimeSecs * 1000);
	}

	return holder;
}

function CloseOverlay()
{
	OverlayShowing = false;
	let holder = select("#overlayHolder")
	holder.elt.classList.add("hide");
	holder.elt.classList.remove("show");
	holder.html("")
}