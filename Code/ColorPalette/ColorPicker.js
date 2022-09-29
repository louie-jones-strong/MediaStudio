class ColorPicker
{
	constructor(colorPalette, htmlIdName, rgbaColor)
	{
		this.ColorPalette = colorPalette;

		this.ColorRgbPicker = select("#" + htmlIdName + "_color");
		this.ColorAlphaSlider = select("#" + htmlIdName + "_alpha");

		this.RgbaColor = rgbaColor;
		this.UseColor();
	}

	UseColor()
	{
		if (this.HasBeenUsed == true)
		{
			return;
		}

		this.ColorPalette.AddRecentColor(this.RgbaColor)
		this.HasBeenUsed = true;
	}

	UpdateColor()
	{

		var colorRgb = color(this.ColorRgbPicker.value());

		var alpha = this.ColorAlphaSlider.value();

		var colorRgba = this.GetRgbaColor(colorRgb, alpha);


		this.SetColor(colorRgba);
	}

	SetColor(rgbaColor)
	{
		var currentColorHex = Helpers.GetColorHex(this.RgbaColor);
		var newColorHex = Helpers.GetColorHex(rgbaColor);

		if (currentColorHex == newColorHex)
		{
			return;
		}

		this.HasBeenUsed = false;
		this.RgbaColor = rgbaColor;

		this.ColorRgbPicker.elt.value = Helpers.GetColorHex(this.RgbaColor, false);

		//update alpha slider visual styling color
		this.ColorAlphaSlider.style("background-color", rgbaColor);
		this.ColorAlphaSlider.elt.value = rgbaColor.levels[3]
	}

	//construct the rgba color from rgb color + alphaValue
	GetRgbaColor(colorRgb, alphaValue)
	{
		var r = colorRgb.levels[0];
		var g = colorRgb.levels[1];
		var b = colorRgb.levels[2];

		return color(r, g, b, alphaValue);
	}
}