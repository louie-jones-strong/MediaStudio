class LayerEffect extends Selectable
{
	constructor()
	{
		super();
		this.Name = "Base Effect";
	}

	ApplyEffect(startImg)
	{

		return startImg;
	}

	SetSelected(selected)
	{
		if (selected)
		{
			ToolManager.SelectTool(null);
		}
		super.SetSelected(selected)
	}

}