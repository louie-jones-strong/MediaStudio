class Layer
{
	constructor(layerId, layerName, graphic)
	{
		this.LayerId = layerId;
		this.LayerName = layerName;
		this.Show = true;
		this.Alpha = 1;

		this.Canvas = null;
		this.P5 = new p5(s);

		this.LayerImage = graphic;

		if (this.LayerImage == null)
			this.LayerImage = createGraphics(CanvasWidth, CanvasHeight);

		this.AffectEffectsCache = createGraphics(CanvasWidth, CanvasHeight);
		this.LayerEffects = [];

		this.ForceEffectRefresh = true;
	}

	DrawLayerIcon(holder, onClick)
	{
		let layer = createDiv(`<div class="layerHeader"> <h3>${this.LayerName}</h3>
		Show
		<input type="checkbox" id="${this.LayerId}LayerShowToggle" checked></div>`);
		layer.mouseClicked(onClick);
		layer.class("layer");
		layer.parent(holder);
		layer.id(`${this.LayerId}Layer`);

		let iconWidth = 150;
		let iconHeight = height / (width / iconWidth);

		this.Canvas = this.P5.createCanvas(iconWidth, iconHeight);
		this.Canvas.id(`${this.LayerId}LayerCanvas`);
		this.Canvas.elt.classList.add("canvas")
		this.Canvas.parent(layer);


	}

	SetSelected(selected)
	{
		let layer = select(`#${this.LayerId}Layer`)


		if (selected)
		{
			layer.elt.classList.add("selected");
		}
		else
		{
			layer.elt.classList.remove("selected");
		}
	}

	UpdateIcon()
	{
		this.P5.clear();

		let afterEffectsImg = this.ApplyEffects();

		this.P5.image(afterEffectsImg, 0, 0, this.P5.width, this.P5.height);
	}

	DrawLayer()
	{
		let showCheckBox = document.getElementById(`${this.LayerId}LayerShowToggle`);
		this.Show = showCheckBox.checked;
		if (!this.Show)
		{
			return;
		}

		let afterEffectsImg = this.ApplyEffects();
		image(afterEffectsImg, 0, 0);
	}


	ApplyEffects()
	{
		if (!this.ForceEffectRefresh)
			return this.AffectEffectsCache;

		this.AffectEffectsCache.clear();
		this.AffectEffectsCache.image(this.LayerImage, 0, 0);

		for (let i = 0; i < this.LayerEffects.length; i++)
		{
			const effect = this.LayerEffects[i];
			this.AffectEffectsCache = effect.ApplyEffect(this.AffectEffectsCache);
		}

		this.ForceEffectRefresh = false;

		return this.AffectEffectsCache;
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
