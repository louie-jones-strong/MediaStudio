class ImageAction extends BaseAction
{
	constructor()
	{
		super("", "");
		this.StartingData = this.GetLayerData();
	}


	EndAction()
	{
		this.EndData = this.GetLayerData();
	}

	Undo()
	{

		this.SetLayerData(this.StartingData)
	}

	Redo()
	{
		if (!this.Ended)
		{
			return
		}
		this.SetLayerData(this.EndData)
	}

	GetLayerData()
	{


		let layer = Layers.Layers[Layers.SelectedIndex].LayerImage
		let img = createGraphics(layer.width, layer.height);
		img.image(layer, 0, 0, layer.width, layer.height);
		return img
	}

	SetLayerData(data)
	{
		let layer = Layers.Layers[Layers.SelectedIndex].LayerImage
		layer.clear()
		layer.image(data, 0, 0, layer.width, layer.height);
	}
}