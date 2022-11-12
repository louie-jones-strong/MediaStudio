class LayerManger
{
	static NumberOfCreatedLayers = 0;

	constructor()
	{
		this.SetBasicLayers()
	}

	GetLayerDict()
	{
		let dict = {}
		for (let i = 0; i < this.Layers.length; i++)
		{
			const layer = this.Layers[i];
			dict[layer.LayerName] = layer
		}
		return dict
	}

	SetBasicLayers()
	{
		this.ClearLayers()

		let img = createGraphics(CanvasWidth, CanvasHeight);
		img.background(255);

		let baseLayer = new Layer("background", img);
		this.AddLayer(baseLayer);


		this.FastEffects = true;
	}

	Resize(width, height)
	{
		for (let i = 0; i < this.Layers.length; i++)
		{
			const layer = this.Layers[i];

			layer.Resize(width, height, layer.LayerImage)
		}

		this.SelectIndex(this.SelectedIndex);
	}

	ClearLayers()
	{
		LayerManger.NumberOfCreatedLayers = 0;
		this.Layers = [];
		const container = document.getElementById('layerListHolder');

		container.innerHTML = '';
		this.SelectedIndex = null
	}

	AddLayer(layer)
	{
		let holder = select('#layerListHolder');

		var index = this.Layers.length;
		layer.AddLayerUiHtml(holder, function() {
			Layers.SelectIndex(index);
		});

		this.Layers.push(layer);

		this.SelectIndex(this.Layers.length-1)
	}

	SelectIndex(index)
	{
		if (this.SelectedIndex != null)
		{
			this.Layers[this.SelectedIndex].SetCurrentLayer(false);
			this.Layers[this.SelectedIndex].UseFastEffect = false;
		}





		this.SelectedIndex = index;
		this.CurrentImg = this.Layers[this.SelectedIndex].LayerImage;


		this.Layers[this.SelectedIndex].SetCurrentLayer(true);
		this.Layers[this.SelectedIndex].UseFastEffect = this.FastEffects;

		let canUseTools = this.Layers[this.SelectedIndex].DisplaySource == DisplaySource.Drawing;
		ToolManager.SetCanUseTools(canUseTools);
	}


//#region drawing
	DrawUnderLayers()
	{
		for (let i = 0; i < this.SelectedIndex; i++)
		{
			const layer = this.Layers[i];

			layer.Draw()
		}
	}

	DrawSelectedLayer()
	{
		let layer = this.Layers[this.SelectedIndex];
		layer.ForceEffectRefresh = true;
		layer.Draw()
	}

	DrawOverLayers()
	{
		for (let i = this.SelectedIndex + 1; i < this.Layers.length; i++)
		{
			const layer = this.Layers[i];

			layer.Draw()

		}
	}
//#endregion
}


