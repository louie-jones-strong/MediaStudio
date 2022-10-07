const FastEffectScaleFactor = 1;

class Layer
{
	constructor(layerId, layerName, graphic)
	{
		this.LayerId = layerId;
		this.LayerName = layerName;

		this.Canvas = null;
		this.P5 = new p5(s);

		this.Show = true;
		this.Alpha = 1;

		this.LayerEffects = [];
		this.MuteEffects = false;
		this.UseFastEffect = false;

		this.Resize(CanvasWidth, CanvasHeight, graphic)


		// this.LayerEffects.push(new BlurEffect())
		// this.LayerEffects.push(new ChromaKeyEffect())
	}

	Resize(width, height, graphic)
	{
		this.LayerImage = createGraphics(width, height);

		if (graphic != null)
		{
			this.LayerImage.image(graphic, 0, 0);
		}

		this.AffectEffectsCache = createGraphics(width, height);
		this.FastEffectsCache = createGraphics(floor(CanvasWidth / FastEffectScaleFactor), floor(height / FastEffectScaleFactor));
		this.ForceEffectRefresh = true;
	}

	DrawLayerIcon(holder, onClick)
	{
		let layer = createDiv(`<div class="layerHeader"> <h3>${this.LayerName}</h3>
		Show
		<input type="checkbox" id="Layer${this.LayerId}ShowToggle" checked></div>
		`);

		layer.mouseClicked(onClick);
		layer.class("layer");
		layer.parent(holder);
		layer.id(`Layer${this.LayerId}`);

		let iconWidth = 150;
		let iconHeight = height / (width / iconWidth);

		this.Canvas = this.P5.createCanvas(iconWidth, iconHeight);
		this.Canvas.id(`Layer${this.LayerId}Canvas`);
		this.Canvas.elt.classList.add("canvas")
		this.Canvas.parent(layer);

		layer.html(`<input type="checkbox" id="Layer${this.LayerId}EffectsToggle" checked>`, true);

		let effectsHolder = createDiv();
		effectsHolder.class("effectHolder")
		effectsHolder.id(`Layer${this.LayerId}Effects`);
		effectsHolder.parent(layer);

		let button = createButton('+');
		button.parent(layer);

		var self = this;
		button.mousePressed(function() {
			let holder = select(`#Layer${self.LayerId}Effects`);

			let effect = new LayerEffect();

			let effectDiv = createDiv(`Effect`);
			effectDiv.parent(holder)


			self.LayerEffects.push(effect)
		});
	}

	SetSelected(selected)
	{

		this.UseFastEffect = selected;
		this.ForceEffectRefresh = true;

		let layer = select(`#Layer${this.LayerId}`)


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
		let showCheckBox = document.getElementById(`Layer${this.LayerId}ShowToggle`);
		this.Show = showCheckBox.checked;

		let muteEffectsCheckBox = document.getElementById(`Layer${this.LayerId}EffectsToggle`);
		this.MuteEffects = !muteEffectsCheckBox.checked;

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
