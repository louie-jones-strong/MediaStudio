class Tool extends Selectable
{
	static StrokeWeight = 2;

	constructor()
	{
		super();
		this.Name = "BaseTool";
		this.Id = "Base_Tool";
		this.Icon = "";
		this.ShowStrokeSettings = true;

		this.StrokeWeightSlider = null;
		this.NormalizeAspectRatio = false;
	}

	SelectTool()
	{
		super.SetSelected(true);

		if (this.ShowStrokeSettings)
		{
			this.StrokeWeightSlider = this.AddValueSlider("StrokeWeight", "Stroke Weight", 1, 100, Tool.StrokeWeight);
		}
	}

	//when the tool is deselected update the pixels to just show the drawing and
	//hide any overlays. Also clear SelectedOptions
	UnselectTool()
	{
		super.SetSelected(false);
		this.StrokeWeightSlider = null;
	}

	Draw()
	{
		super.Draw();
		if (this.ShowStrokeSettings)
		{
			Tool.StrokeWeight = this.StrokeWeightSlider.Value;
			Layers.CurrentImg.strokeWeight(Tool.StrokeWeight);
		}
	}

	KeyTyped(key, keyCode)
	{
	}

	KeyPressed(key, keyCode)
	{
		if (keyCode === SHIFT)
		{
			this.NormalizeAspectRatio = true;
		}
	}

	KeyReleased(key, keyCode)
	{
		if (keyCode === SHIFT)
		{
			this.NormalizeAspectRatio = false;
		}
	}
}