class ImageAction extends BaseAction
{
	constructor()
	{
		super();
		this.Icon = "";
		this.Name = "";

		let layer = Layers.Layers[Layers.SelectedIndex].LayerImage

		this.StartingImage = createGraphics(layer.width, layer.height);
		this.StartingImage.image(layer, 0, 0, layer.width, layer.height);
	}


	EndAction()
	{
		let layer = Layers.Layers[Layers.SelectedIndex].LayerImage
		this.EndImage = createGraphics(layer.width, layer.height);
		this.EndImage.image(layer, 0, 0, layer.width, layer.height);
	}

	Undo()
	{

		let layer = Layers.Layers[Layers.SelectedIndex].LayerImage
		layer.image(this.StartingImage, 0, 0, layer.width, layer.height);
	}

	Redo()
	{
		if (!this.Ended)
		{
			return
		}
		let layer = Layers.Layers[Layers.SelectedIndex].LayerImage
		layer.image(this.EndImage, 0, 0, layer.width, layer.height);
	}
}