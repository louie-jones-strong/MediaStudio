function HelperFunctions()
{

	select("#addLayerButton").mouseClicked(function() {

		let temp = new Layer(Layers.Layers.length, `Layer ${Layers.Layers.length}`, null);
		Layers.AddLayer(temp);
	});

	select("#removeLayerButton").mouseClicked(function() {

		if (Layers.Layers.length > 1)
		{
			let layerToRemove = Layers.Layers[Layers.SelectedIndex]
			select(`#Layer${layerToRemove.LayerId}`).remove();

			Layers.Layers.splice(Layers.SelectedIndex, 1);

			let newIndex = Layers.SelectedIndex - 1;
			if (newIndex < 0)
			{
				newIndex = Layers.Layers.length - 1
			}

			Layers.SelectedIndex = null;


			Layers.SelectIndex(newIndex);
		}
	});

	select("#duplicateLayerButton").mouseClicked(function() {
		let img = createGraphics(CanvasWidth, CanvasHeight);
		img.image(Layers.CurrentImg, 0, 0);

		let baseLayer = new Layer(Layers.Layers.length, Layers.Layers[Layers.SelectedIndex].LayerName + " Copy", img);
		Layers.AddLayer(baseLayer);

	});

	//p5.dom click click events. Notice that there is no this. at the
	//start we don't need to do that here because the event will
	//be added to the button and doesn't 'belong' to the object

	//event handler for the clear button event. Clears the screen
	select("#clearButton").mouseClicked(function() {

		ToolManager.Reset();

		//reset the color to white
		Layers.CurrentImg.background(255);

		//call loadPixels to update the drawing state
		//this is needed for the mirror tool
		Layers.CurrentImg.loadPixels();
	});

	//event handler for the save image button. saves the canvas to the
	//local file system.
	select("#saveImageButton").mouseClicked(function() {

		if (!Template.TrySaveOutputs())
		{
			saveCanvas()
		}
	});


	//faster function to get the color of pixels
	this.GetPixel = function(img, x, y)
	{
		let d = pixelDensity();
		let color = [];
		for (let i = 0; i < d; ++i)
		{
			for (let j = 0; j < d; ++j)
			{
				let idx = 4 * ((y * d + j) * img.width * d + (x * d + i));
				color[0] = img.pixels[idx];
				color[1] = img.pixels[idx+1];
				color[2] = img.pixels[idx+2];
				color[3] = img.pixels[idx+3];
			}
		}
		return color;
	}

	//faster function to set the color of pixels
	this.SetPixel = function(img, x, y, color)
	{
		let d = pixelDensity();
		for (let i = 0; i < d; ++i)
		{
			for (let j = 0; j < d; ++j)
			{
				let idx = 4 * ((y * d + j) * img.width * d + (x * d + i));
				img.pixels[idx]   = color[0];
				img.pixels[idx+1] = color[1];
				img.pixels[idx+2] = color[2];
				img.pixels[idx+3] = color[3];
			}
		}
	}

	this.PosOnCanvas = function(x, y)
	{
		return x >= 0 && x <= CanvasWidth &&
			   y >= 0 && y <= CanvasHeight &&
			   !OverlayShowing;
	}

	this.GetColorHex = function(rgbaColor, withAlpha=true)
	{
		return this.GetColorLevelsHex(rgbaColor.levels, withAlpha);
	}

	this.GetColorLevelsHex = function(rgbaLevelsColor, withAlpha=true)
	{
		let hexString = "#";
		hexString += hex(rgbaLevelsColor[0], 2);
		hexString += hex(rgbaLevelsColor[1], 2);
		hexString += hex(rgbaLevelsColor[2], 2);

		if (withAlpha)
		{
			hexString += hex(rgbaLevelsColor[3], 2);
		}

		return hexString;
	}
}