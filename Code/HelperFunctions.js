function HelperFunctions()
{

	select("#addLayerButton").mouseClicked(function() {

		let temp = new Layer(Layers.Layers.length, `Layer ${Layers.Layers.length}`, null);
		Layers.AddLayer(temp);
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
		saveCanvas()
	});


	//faster function to get the color of pixels
	this.GetPixel = function(x, y)
	{
		let d = pixelDensity();
		let color = [];
		for (let i = 0; i < d; ++i)
		{
			for (let j = 0; j < d; ++j)
			{
				let idx = 4 * ((y * d + j) * width * d + (x * d + i));
				color[0] = Layers.CurrentImg.pixels[idx];
				color[1] = Layers.CurrentImg.pixels[idx+1];
				color[2] = Layers.CurrentImg.pixels[idx+2];
				color[3] = Layers.CurrentImg.pixels[idx+3];
			}
		}
		return color;
	}

	//faster function to set the color of pixels
	this.SetPixel = function(x, y, color)
	{
		let d = pixelDensity();
		for (var i = 0; i < d; ++i)
		{
			for (var j = 0; j < d; ++j)
			{
				var idx = 4 * ((y * d + j) * width * d + (x * d + i));
				Layers.CurrentImg.pixels[idx]   = color.levels[0];
				Layers.CurrentImg.pixels[idx+1] = color.levels[1];
				Layers.CurrentImg.pixels[idx+2] = color.levels[2];
				Layers.CurrentImg.pixels[idx+3] = color.levels[3];
			}
		}
	}

	this.PosOnCanvas = function(x, y)
	{
		return x >= 0 && x <= width && y >= 0 && y <= height
	}

	this.GetColorHex = function(rgbaColor, withAlpha=true)
	{
		return this.GetColorLevelsHex(rgbaColor.levels, withAlpha);
	}

	this.GetColorLevelsHex = function(rgbaLevelsColor, withAlpha=true)
	{
		var hexString = "#";
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