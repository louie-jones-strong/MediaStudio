class LayerManger
{
	constructor()
	{
		this.Layers = [];

		let img = createGraphics(CanvasWidth, CanvasHeight);
		img.background(255);

		let baseLayer = new Layer(0, "background", img);
		this.AddLayer(baseLayer);

		this.SelectIndex(0)
	}

	AddLayer(layer)
	{


		let holder = select('#layerListHolder');

		var index = this.Layers.length;
		layer.DrawLayerIcon(holder, function() {
			Layers.SelectIndex(index);
		});

		this.Layers.push(layer);
		layer.UpdateIcon();
	}

	SelectIndex(index)
	{
		if (this.SelectedIndex != null)
			this.Layers[this.SelectedIndex].SetSelected(false);


		this.SelectedIndex = index;
		this.CurrentImg = this.Layers[this.SelectedIndex].LayerImage;


		this.Layers[this.SelectedIndex].SetSelected(true);
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
		let layer = this.Layers[this.SelectedIndex];
		layer.ForceEffectRefresh = true;
		layer.DrawLayer()
		layer.UpdateIcon();
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


