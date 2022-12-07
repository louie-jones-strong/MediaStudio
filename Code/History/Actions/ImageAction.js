class ImageAction extends BaseAction
{
	constructor()
	{
		super("assets/freehandTool.png", "Drawing");
		this.StartingData = this.GetLayerData();
	}

	Remove()
	{
		super.Remove()
		this.StartingData.remove();
		if (this.EndData != null)
		{
			this.EndData.remove();
		}

	}

	EndAction()
	{
		super.EndAction()
		this.EndData = this.GetLayerData();
	}

	Undo()
	{
		super.Undo()
		this.SetLayerData(this.StartingData)
	}

	Redo()
	{
		super.Redo()
		if (!this.Ended)
		{
			return
		}
		this.SetLayerData(this.EndData)
	}

	GetLayerData()
	{


		let layer = Layers.Layers[Layers.SelectedIndex].PreEffectsImage
		let img = createGraphics(layer.width, layer.height);
		img.image(layer, 0, 0, layer.width, layer.height);
		return img
	}

	SetLayerData(data)
	{
		let layer = Layers.Layers[Layers.SelectedIndex].PreEffectsImage
		layer.clear()
		layer.image(data, 0, 0, layer.width, layer.height);
	}
}