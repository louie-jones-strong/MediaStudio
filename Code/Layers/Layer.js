const FastEffectScaleFactor = 4;

class Layer
{
	constructor(layerId, layerName, graphic)
	{
		this.LayerId = layerId;
		this.LayerName = layerName;
		this.Show = true;
		this.MuteEffects = false;
		this.Alpha = 1;

		this.Canvas = null;
		this.P5 = new p5(s);

		this.LayerImage = graphic;

		if (this.LayerImage == null)
			this.LayerImage = createGraphics(CanvasWidth, CanvasHeight);

		this.AffectEffectsCache = createGraphics(CanvasWidth, CanvasHeight);
		this.FastEffectsCache = createGraphics(floor(CanvasWidth / FastEffectScaleFactor), floor(CanvasHeight / FastEffectScaleFactor));

		this.LayerEffects = [];


		this.ForceEffectRefresh = true;
		this.UseFastEffect = true;


		this.LayerEffects.push(new BlurEffect())
		// this.LayerEffects.push(new ChromaKeyEffect())
	}

	DrawLayerIcon(holder, onClick)
	{
		let layer = createDiv(`<div class="layerHeader"> <h3>${this.LayerName}</h3>
		Show
		<input type="checkbox" id="${this.LayerId}LayerShowToggle" checked></div>
		<input type="checkbox" id="${this.LayerId}LayerMuteEffectsToggle">`);
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

		this.UseFastEffect = selected;
		this.ForceEffectRefresh = true;

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

		let muteEffectsCheckBox = document.getElementById(`${this.LayerId}LayerMuteEffectsToggle`);
		this.MuteEffects = muteEffectsCheckBox.checked;

		if (!this.Show)
		{
			return;
		}

		let afterEffectsImg = this.ApplyEffects();
		image(afterEffectsImg, 0, 0, CanvasWidth, CanvasHeight);
	}


	ApplyEffects()
	{
		if (this.LayerEffects.length == 0 ||
			this.MuteEffects)
		{
			return this.LayerImage;
		}

		if (!this.ForceEffectRefresh)
		{
			if (this.UseFastEffect)
				return this.FastEffectsCache;
			else
				return this.AffectEffectsCache;
		}



		let img  = null;
		if (this.UseFastEffect)
		{
			this.FastEffectsCache.clear();
			this.FastEffectsCache.image(this.LayerImage, 0, 0, this.FastEffectsCache.width, this.FastEffectsCache.height);
			img = this.FastEffectsCache;
		}
		else
		{
			this.AffectEffectsCache.clear();
			this.AffectEffectsCache.image(this.LayerImage, 0, 0);
			img = this.AffectEffectsCache;
		}

		for (let i = 0; i < this.LayerEffects.length; i++)
		{
			const effect = this.LayerEffects[i];
			img = effect.ApplyEffect(img);
		}


		if (this.UseFastEffect)
		{
			this.FastEffectsCache = img;
		}
		else
		{
			this.AffectEffectsCache = img;
		}

		this.ForceEffectRefresh = false;

		return img;
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
