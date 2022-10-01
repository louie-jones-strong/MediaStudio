class LayerManger
{
	constructor()
	{
		this.Layers = [];

		let baseLayer = new Layer(0, "background", null);
		this.AddLayer(baseLayer);

		let temp = new Layer(1, "temp", null);
		this.AddLayer(temp);


		this.SelectIndex(0)
	}

	AddLayer(layer)
	{
		this.Layers.push(layer);


		let holder = select('#layerListHolder');
		layer.DrawLayerIcon(holder);
		layer.UpdateIcon();
	}

	SelectIndex(index)
	{
		this.SelectedIndex = index;
		this.CurrentImg = this.Layers[this.SelectedIndex].LayerImage;
	}


//#region drawing
	DrawUnderLayers()
	{
		for (let i = 0; i < this.SelectedIndex; i++)
		{
			const layer = this.Layers[i];

			layer.DrawLayer()
		}
	}

	DrawSelectedLayer()
	{
		this.Layers[this.SelectedIndex].DrawLayer()
		this.Layers[this.SelectedIndex].UpdateIcon();
	}

	DrawOverLayers()
	{
		for (let i = this.SelectedIndex + 1; i < this.Layers.length; i++)
		{
			const layer = this.Layers[i];

			layer.DrawLayer()

		}
	}
//#endregion
}
