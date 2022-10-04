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

		this.LeftClickColor =  new ColorPicker(this, "color1", color(0, 0, 0, 255));
		this.RightClickColor = new ColorPicker(this, "color2", color(255, 255, 255, 255));

		this.UpdateColors();
		this.UpdateRecentColors();
	}

	UpdateColors()
	{

		this.LeftClickColor.UpdateColor();
		this.RightClickColor.UpdateColor();

		//update selectedColor based on what mouse button pressed
		if (mouseIsPressed &&
			(mouseButton === LEFT || mouseButton === RIGHT))
		{
			if (mouseButton === LEFT)
			{
				this.SelectedColor = this.LeftClickColor.RgbaColor;

				if (Helpers.PosOnCanvas(mousePosX, mousePosY))
				{
					this.LeftClickColor.UseColor();
				}
			}
			else
			{
				this.SelectedColor = this.RightClickColor.RgbaColor;

				if (Helpers.PosOnCanvas(mousePosX, mousePosY))
				{
					this.RightClickColor.UseColor();
				}
			}

			//set the selected color and fill and stroke
			fill(this.SelectedColor);
			stroke(this.SelectedColor);
		}
	}

	AddRecentColor(rgbaColor)
	{
		var colorHex = Helpers.GetColorHex(rgbaColor);

		//check if color is already in recently used queue
		if (this.RecentColorsHashSet.Contains(colorHex))
		{
			return;
		}

		this.RecentColorsHashSet.Add(colorHex)

		this.RecentColorsQueue.push(rgbaColor);

		var hasRemovedColor = this.RecentColorsQueue.length > MaxRecentColors;

		while (this.RecentColorsQueue.length > MaxRecentColors)
		{
			this.RecentColorsQueue.shift();
		}

		if (hasRemovedColor)
		{
			this.RecentColorsHashSet.Clear();
			for (let index = 0; index < this.RecentColorsQueue.length; index++)
			{
				var colorHex = Helpers.GetColorHex(this.RecentColorsQueue[index]);
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
			var color = this.RecentColorsQueue[index];

			var colorHolder = createDiv()
			colorHolder.class("recentColorHolder");
			colorHolder.parent(select(".recentColorsGrid"));

			var colorBlock = createDiv()
			colorBlock.parent(colorHolder);
			colorBlock.class("recentColor");
			colorBlock.id("recentColor_" + index);
			colorBlock.style("background-color", color);

			colorHolder.mousePressed(function(event)
			{
				var color = self.RecentColorsQueue[index];

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