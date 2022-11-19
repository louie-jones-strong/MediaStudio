class LayerEffect extends Selectable
{
	constructor()
	{
		super();
		this.Name = "Base Effect";
	}

	Remove()
	{
		if (this.CachedImg != null)
		{
			this.CachedImg.remove();
		}
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

	GetCachedImage(width, height)
	{
		if (this.CachedImg == null ||
			this.CachedImg.width != width ||
			this.CachedImg.height != height)
		{
			if (this.CachedImg != null)
			{
				this.CachedImg.remove();
			}

			this.CachedImg = createGraphics(width, height);
		}

		this.CachedImg.clear()
		return this.CachedImg;
	}
}