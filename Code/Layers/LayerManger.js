class LayerManger
{
	constructor()
	{
		this.Layers = [];
		this.SelectedLayer = 0;

		let baseLayer = new Layer(0, "background", null);
		this.AddLayer(baseLayer);

		let temp = new Layer(1, "temp", null);
		this.AddLayer(temp);
	}

	AddLayer(layer)
	{
		this.Layers.push(layer);
		this.DrawLayerIcons();
	}

	DrawLayerIcons()
	{
		let html = "";
		for (let i = this.Layers.length-1; i >= 0; i--)
		{
			const layer = this.Layers[i];
			html = layer.DrawLayerIcon(html, this.SelectedLayer == i)
		}
		let holder = document.getElementById("layerListHolder");
		holder.innerHTML = html;
	}

	UpdateIcons()
	{
		for (let i = 0; i < this.Layers.length; i++)
		{
			const layer = this.Layers[i];
			layer.UpdateIcon();

		}
	}

	DrawUnderLayers()
	{
		for (let i = 0; i < this.Layers.length; i++)
		{
			const layer = this.Layers[i];

			if (i == this.SelectedLayer)
			{
				return;
			}
			layer.DrawLayer()

		}
	}

	UnderLayers()
	{
		for (let i = 0; i < this.Layers.length; i++)
		{
			const layer = this.Layers[i];

			if (i != this.SelectedLayer)
			{
				continue;
			}
			layer.DrawLayer()

		}
	}

	DrawOverLayers()
	{
		for (let i = 0; i < this.Layers.length; i++)
		{
			const layer = this.Layers[i];

			if (i <= this.SelectedLayer)
			{
				continue;
			}
			layer.DrawLayer()

		}
	}
}
