class ChromaKeyEffect extends LayerEffect
{
	constructor()
	{
		super();
		this.Name = "Chroma Key";

		this.SelectedColour = color(0, 255, 0, 255);
		this.ReplaceColor = color(0, 0, 0, 0)
		this.Threshold = 0.1;

		this.ThresholdSlider = null;
		this.SelectedColourPicker = null;
		this.ReplaceColorPicker = null;
	}

	Draw()
	{
		super.Draw();
		if (this.ThresholdSlider != null)
		{
			this.Threshold = this.ThresholdSlider.Value;
			this.SelectedColour = this.SelectedColourPicker.UpdateColor()
			this.ReplaceColor = this.ReplaceColorPicker.UpdateColor()

		}
	}

	SetSelected(selected)
	{
		super.SetSelected(selected)
		if (selected)
		{
			this.ThresholdSlider = this.AddValueSlider("Threshold", "Threshold", 0, 400, this.Threshold);

			let selectedRgbHex = Helpers.GetColorHex(this.SelectedColour, false);
			let selectedA = this.SelectedColour.levels[3];
			this.SelectedColourPicker = this.AddColourPicker("SelectedColour", "Target Colour", selectedRgbHex, selectedA);

			let replaceRgbHex = Helpers.GetColorHex(this.ReplaceColor, false);
			let replaceA = this.ReplaceColor.levels[3];
			this.ReplaceColorPicker = this.AddColourPicker("ReplaceColor", "Replace Colour", replaceRgbHex, replaceA);
		}
		else
		{
			this.ThresholdSlider = null;
			this.SelectedColourPicker = null;
			this.ReplaceColorPicker = null;
		}
	}



	ApplyEffect(startImg)
	{
		startImg = super.ApplyEffect(startImg);

		startImg.loadPixels();
		let d = startImg.pixelDensity();

		for (let x = 0; x < startImg.width; x += 1)
		{
			for (let y = 0; y < startImg.height; y += 1)
			{
				let colours = Helpers.GetPixel(startImg, x, y, d);

				let delta = DistSquared(colours[0], colours[1], colours[2], this.SelectedColour.levels[0], this.SelectedColour.levels[1], this.SelectedColour.levels[2]);

				if (delta <= this.Threshold * this.Threshold)
				{
					Helpers.SetPixel(startImg, x, y, this.ReplaceColor.levels);
				}
			}
		}
		startImg.updatePixels();

		return startImg;
	}
}

function DistSquared(x1, y1, z1, x2, y2, z2)
{
	return (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) + (z2-z1)*(z2-z1);
}