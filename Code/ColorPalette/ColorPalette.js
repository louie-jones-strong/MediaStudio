const MaxRecentColors = 12;

//Displays and handles the color palette.
class ColorPalette
{
	constructor()
	{
		//be explicit about the color mode we are using
		colorMode(RGB, 255, 255, 255, 255);


		this.RecentColorsQueue = [];
		this.RecentColorsHashSet = new HashSet();
		this.AddRecentColor(color(255, 0, 0, 255)); // add red
		this.AddRecentColor(color(0, 255, 0, 255)); // add green
		this.AddRecentColor(color(0, 0, 255, 255)); // add blue

		this.LeftClickColor =  new ColorPicker(this, "color1");
		this.RightClickColor = new ColorPicker(this, "color2");

		this.UpdateColors();
		this.UpdateRecentColors();
	}

	UpdateColors()
	{

		this.LeftClickColor.UpdateColor();
		this.RightClickColor.UpdateColor();

		//update selectedColor based on what mouse button pressed
		if (MouseLeftOrRightDown)
		{
			if (MouseLeftDown)
			{
				this.SelectedColor = this.LeftClickColor.RgbaColor;

				if (Helpers.PosOnCanvas(MousePosX, MousePosY))
				{
					this.LeftClickColor.UseColor();
				}
			}
			else if (MouseRightDown)
			{
				this.SelectedColor = this.RightClickColor.RgbaColor;

				if (Helpers.PosOnCanvas(MousePosX, MousePosY))
				{
					this.RightClickColor.UseColor();
				}
			}

			//set the selected color and fill and stroke
			Layers.CurrentImg.fill(this.SelectedColor);
			Layers.CurrentImg.stroke(this.SelectedColor);
		}
	}

	AddRecentColor(rgbaColor)
	{
		let colorHex = Helpers.GetColorHex(rgbaColor);

		//check if color is already in recently used queue
		if (this.RecentColorsHashSet.Contains(colorHex))
		{
			return;
		}

		this.RecentColorsHashSet.Add(colorHex)

		this.RecentColorsQueue.push(rgbaColor);

		let hasRemovedColor = this.RecentColorsQueue.length > MaxRecentColors;

		while (this.RecentColorsQueue.length > MaxRecentColors)
		{
			this.RecentColorsQueue.shift();
		}

		if (hasRemovedColor)
		{
			this.RecentColorsHashSet.Clear();
			for (let index = 0; index < this.RecentColorsQueue.length; index++)
			{
				colorHex = Helpers.GetColorHex(this.RecentColorsQueue[index]);
				this.RecentColorsHashSet.Add(colorHex)
			}
		}

		this.UpdateRecentColors();
	}

	UpdateRecentColors()
	{
		var self = this;
		select(".recentColorsGrid").html("");

		for (let index = this.RecentColorsQueue.length-1; index >= 0; index--)
		{
			let color = this.RecentColorsQueue[index];

			let colorHolder = createDiv()
			colorHolder.class("recentColorHolder");
			colorHolder.parent(select(".recentColorsGrid"));

			let colorBlock = createDiv()
			colorBlock.parent(colorHolder);
			colorBlock.class("recentColor");
			colorBlock.id("recentColor_" + index);
			colorBlock.style("background-color", color);

			colorHolder.mousePressed(function(event)
			{
				let color = self.RecentColorsQueue[index];

				if (event.button == 0) // Left
				{
					self.LeftClickColor.SetColor(color);
				}
				else if (event.button == 2) // Right
				{
					self.RightClickColor.SetColor(color);
				}
			});
		}
	}
}