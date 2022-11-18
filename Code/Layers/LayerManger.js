class LayerManger
{
	static NumberOfCreatedLayers = 0;

	constructor()
	{
		this.SetBasicLayers()
	}

	GetLayerDict(key=null, value=null)
	{
		let dict = {}

		if (key != null)
		{
			dict[key] = value;
		}

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

	MoveLayer(startingIndex, endIndex)
	{

		if (startingIndex < 0 ||
			startingIndex >= this.Layers.length ||
			endIndex < 0 ||
			endIndex >= this.Layers.length)
		{
			return;
		}

		let draggedLayer = this.Layers[startingIndex];


		// this needs to be moved to swapping layers down or up
		this.Layers[startingIndex] = this.Layers[endIndex];




		this.Layers[endIndex] = draggedLayer;


		// need to reselect layer
		if (startingIndex == this.SelectedIndex)
		{
			this.SelectIndex(endIndex);
		}
		else if (endIndex == this.SelectedIndex)
		{
			this.SelectIndex(startingIndex);
		}


		let holder = select('#offscreen');
		for (let i = 0; i < this.Layers.length; i++)
		{
			const layer = this.Layers[i];

			let icon = layer.GetLayerIconDiv()
			icon.parent(holder);
		}

		holder = select('#layerListHolder');
		for (let i = 0; i < this.Layers.length; i++)
		{
			const layer = this.Layers[i];

			let icon = layer.GetLayerIconDiv()
			icon.parent(holder);
		}

	}

	AddLayer(layer)
	{
		let holder = select('#layerListHolder');

		var id = layer.LayerId //this.Layers.length;
		layer.AddLayerUiHtml(holder, function() {
			// Layers.SelectIndex(index);
			Layers.SelectId(id)
		});

		this.Layers.push(layer);

		this.SelectIndex(this.Layers.length-1)
	}

	SelectId(id)
	{
		for (let i = 0; i < this.Layers.length; i++)
		{
			const layer = this.Layers[i];
			if (layer.LayerId == id)
			{
				this.SelectIndex(i)
				break;
			}
		}
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

		if (this.Layers.length <= 1)
		{
			select("#moveUpLayer").attribute('disabled', '');
			select("#moveDownLayer").attribute('disabled', '');
			select("#removeLayerButton").attribute('disabled', '');

		}
		else
		{
			select("#removeLayerButton").removeAttribute('disabled');

			if (this.SelectedIndex >= this.Layers.length - 1)
			{
				select("#moveUpLayer").attribute('disabled', '');
			}
			else
			{
				select("#moveUpLayer").removeAttribute('disabled');
			}

			if (this.SelectedIndex <= 0)
			{
				select("#moveDownLayer").attribute('disabled', '');
			}
			else
			{
				select("#moveDownLayer").removeAttribute('disabled');
			}
		}
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


