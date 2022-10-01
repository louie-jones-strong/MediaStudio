class FloodFillTool extends Tool
{
	constructor()
	{
		super();
		//set an icon and a name for the object
		this.Name = "Flood Fill Tool";
		this.Icon = "assets/floodFillTool.png";
		this.ShowStrokeSettings = false;

		this.FilledHashSet = new HashSet();
		this.CheckedHashSet = new HashSet();
		this.StartingColor;
		this.FillColor;
		this.ToFill = [];
	}

	GetFooterHtml()
	{
		var footerHtml = super.GetFooterHtml();

		if (this.ToFill.length > 0)
		{
			footerHtml += "<p>Filling...</p>";
		}
		else
		{
			footerHtml += "<p>Click on the canvas to start flood fill</p>";
		}

		return footerHtml;
	}

	Draw()
	{
		super.Draw();

		if (this.ToFill.length > 0)
		{
			var frameStartTime = performance.now();

			do
			{
				var co = this.ToFill.shift();
				this.FillPixel(co[0], co[1]);
				var timeNow = performance.now();
			}
			while (timeNow - frameStartTime <= 30 && this.ToFill.length > 0);
			Layers.CurrentImg.updatePixels();

		}
		else if (mouseIsPressed && Helpers.PosOnCanvas(mouseX, mouseY))
		{
			var x = Math.round(mouseX);
			var y = Math.round(mouseY);

			Layers.CurrentImg.loadPixels();
			this.StartingColor = Helpers.GetPixel(x, y);
			this.FillColor = ColorP.SelectedColor;

			var startingColorHex = Helpers.GetColorLevelsHex(this.StartingColor);
			var fillColor = Helpers.GetColorHex(this.FillColor);
			if (startingColorHex == fillColor)
			{
				return;
			}
			this.FilledHashSet.Clear();
			this.CheckedHashSet.Clear();
			this.ToFill = [[x, y]];
		}
	}

	UnselectTool()
	{
		super.UnselectTool();
		this.FilledHashSet.Clear();
		this.CheckedHashSet.Clear();
		this.ToFill = [];
	}

	FillPixel(x, y)
	{
		this.FilledHashSet.Add([x, y]);

		Helpers.SetPixel(x, y, this.FillColor);

		if (x-1 >= 0 && this.CheckPixel(x-1, y))
		{
			this.ToFill.push([x-1, y]);
			this.CheckedHashSet.Add([x-1, y]);
		}

		if (x+1 <= width && this.CheckPixel(x+1, y))
		{
			this.ToFill.push([x+1, y]);
			this.CheckedHashSet.Add([x+1, y]);
		}

		if (y-1 >= 0 && this.CheckPixel(x, y-1))
		{
			this.ToFill.push([x, y-1]);
			this.CheckedHashSet.Add([x, y-1]);
		}

		if (y+1 <= height && this.CheckPixel(x, y+1))
		{
			this.ToFill.push([x, y+1]);
			this.CheckedHashSet.Add([x, y+1]);
		}
	}

	CheckPixel(x, y)
	{
		if (this.FilledHashSet.Contains([x, y]))
		{
			return false;
		}

		if (this.CheckedHashSet.Contains([x, y]))
		{
			return false;
		}

		//get color of pixel at coordinates (x, y)
		var color = Helpers.GetPixel(x, y);

		return this.IsColorInRange(color);
	}

	IsColorInRange(color2)
	{
		for (var i = 0; i < 4; i++)
		{
			if (this.StartingColor[i] != color2[i])
			{
				return false;
			}
		}
		return true;
	}
}

