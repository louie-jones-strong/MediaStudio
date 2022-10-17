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

		let colorRgb = color(this.ColorRgbPicker.value());

		let alpha = this.ColorAlphaSlider.value();

		let colorRgba = this.GetRgbaColor(colorRgb, alpha);


		this.SetColor(colorRgba);
	}

	SetColor(rgbaColor)
	{
		let currentColorHex = Helpers.GetColorHex(this.RgbaColor);
		let newColorHex = Helpers.GetColorHex(rgbaColor);

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
		let r = colorRgb.levels[0];
		let g = colorRgb.levels[1];
		let b = colorRgb.levels[2];

		return color(r, g, b, alphaValue);
	}
}