function HelperFunctions()
{

	select("#addLayerButton").mouseClicked(function() {

		let temp = new Layer(`Layer ${Layers.Layers.length}`, null);
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

		let baseLayer = new Layer(Layers.Layers[Layers.SelectedIndex].LayerName + " Copy", Layers.CurrentImg);
		Layers.AddLayer(baseLayer);

	});

	//p5.dom click click events. Notice that there is no this. at the
	//start we don't need to do that here because the event will
	//be added to the button and doesn't 'belong' to the object

	//event handler for the clear button event. Clears the screen
	select("#clearButton").mouseClicked(function() {

		OpenNewProject();
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
	this.GetPixel = function(img, x, y, d=null)
	{
		if (d == null)
			d = img.pixelDensity();

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
	this.SetPixel = function(img, x, y, color, d=null)
	{
		if (d == null)
			d = img.pixelDensity();

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

	this.RgbToBw = function(rgbaLevelsColor, withAlpha=true, normalize=false)
	{
		let value = 0
		value += rgbaLevelsColor[0];
		value += rgbaLevelsColor[1];
		value += rgbaLevelsColor[2];
		value /= 3;

		if (withAlpha)
		{
			value *= (rgbaLevelsColor[3] / 255);
		}

		if(normalize)
		{
			value /= 255;
		}

		return value;
	}

	this.Tint = function Tint(img, tintColourLevels) {
		let outImg = createGraphics(img.width, img.height);

		img.loadPixels();
		outImg.loadPixels();


		for (let x = 0; x < img.width; x += 1)
		{
			for (let y = 0; y < img.height; y += 1)
			{
				let colour = Helpers.GetPixel(img, x, y)

				colour[0] *= tintColourLevels[0] / 255
				colour[1] *= tintColourLevels[1] / 255
				colour[2] *= tintColourLevels[2] / 255
				colour[3] *= tintColourLevels[3] / 255

				Helpers.SetPixel(outImg, x, y, colour);
			}
		}
		img.updatePixels();
		outImg.updatePixels();

		return outImg
	}
}