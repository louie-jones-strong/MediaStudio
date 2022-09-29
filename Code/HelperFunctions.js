function HelperFunctions()
{

	//p5.dom click click events. Notice that there is no this. at the
	//start we don't need to do that here because the event will
	//be added to the button and doesn't 'belong' to the object

	//event handler for the clear button event. Clears the screen
	select("#clearButton").mouseClicked(function() {

		ToolManager.Reset();

		//reset the color to white
		background(255);

		//call loadPixels to update the drawing state
		//this is needed for the mirror tool
		loadPixels();
	});

	//event handler for the save image button. saves the canvas to the
	//local file system.
	select("#saveImageButton").mouseClicked(function() {
		saveCanvas()
	});


	//faster function to get the color of pixels
	this.GetPixel = function(x, y)
	{
		var d = pixelDensity();
		var color = [];
		for (var i = 0; i < d; ++i)
		{
			for (var j = 0; j < d; ++j)
			{
			var idx = 4 * ((y * d + j) * width * d + (x * d + i));
			color[0] = pixels[idx];
			color[1] = pixels[idx+1];
			color[2] = pixels[idx+2];
			color[3] = pixels[idx+3];
			}
		}
		return color;
	}

	//faster function to set the color of pixels
	this.SetPixel = function(x, y, color)
	{
		var d = pixelDensity();
		for (var i = 0; i < d; ++i)
		{
			for (var j = 0; j < d; ++j)
			{
				var idx = 4 * ((y * d + j) * width * d + (x * d + i));
				pixels[idx]   = color.levels[0];
				pixels[idx+1] = color.levels[1];
				pixels[idx+2] = color.levels[2];
				pixels[idx+3] = color.levels[3];
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