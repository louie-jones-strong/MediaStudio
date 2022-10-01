class Layer
{
	constructor(layerId, layerName, pixelArray)
	{
		this.LayerId = layerId;
		this.LayerName = layerName;
		this.Show = true;
		this.Alpha = 1;

		this.Canvas = null;
		this.P5 = new p5(s);
		this.LayerImage = null;
	}

	DrawLayerIcon(holder)
	{
		let layer = createDiv(`<h3>${this.LayerName}</h3>`)
		layer.class("layer");
		layer.parent(holder);

		let iconWidth = 150;
		let iconHeight = height / (width / iconWidth);

		this.Canvas = this.P5.createCanvas(iconWidth, iconHeight);
		this.Canvas.id(`${this.LayerId}LayerCanvas`);
		this.Canvas.elt.classList.add("canvas")
		this.Canvas.parent(layer);

		this.LayerImage = createGraphics(CanvasWidth, CanvasHeight);
	}

	UpdateIcon()
	{
		this.P5.image(this.LayerImage, 0, 0, this.P5.width, this.P5.height);
	}

	DrawLayer()
	{
		if (!this.Show)
		{
			return;
		}

		image(this.LayerImage, 0, 0);
	}
}



var s = function( sketch )
{

	sketch.setup = function()
	{
	}

	sketch.draw = function()
	{
	}
};
