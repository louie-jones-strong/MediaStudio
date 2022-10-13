var NumEffectsCreated = 0;
const FastEffectScaleFactor = 4;

const DefaultEffectDropDownSelected ='Select Effect';
const EffectLookup = {}
EffectLookup["Chroma Key"] = ChromaKeyEffect
EffectLookup["Blur"] = BlurEffect

class Layer
{
	constructor(layerId, layerName, graphic, resizePivotX=0, resizePivotY=0)
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

		// resizing Style
		this.ResizePivotX = resizePivotX;
		this.ResizePivotY = resizePivotY;

		this.Resize(CanvasWidth, CanvasHeight, graphic)
	}

	Resize(width, height, graphic)
	{
		this.LayerImage = createGraphics(width, height);

		if (graphic != null)
		{
			let x = floor((this.ResizePivotX * width) - (this.ResizePivotX * graphic.width));
			let y = floor((this.ResizePivotY * height) - (this.ResizePivotY * graphic.height));

			console.log(x, y);
			this.LayerImage.image(graphic, x, y);
		}

		this.AffectEffectsCache = createGraphics(width, height);
		this.FastEffectsCache = createGraphics(floor(CanvasWidth / FastEffectScaleFactor), floor(height / FastEffectScaleFactor));
		this.ForceEffectRefresh = true;

		this.UpdateIcon();
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

		layer.html(`Effects<input type="checkbox" id="Layer${this.LayerId}EffectsToggle" checked>`, true);

		let effectsHolder = createDiv();
		effectsHolder.class("effectHolder")
		effectsHolder.id(`Layer${this.LayerId}Effects`);
		effectsHolder.parent(layer);

		var self = this;

		// add effect drop down
		this.EffectDropDown = createSelect();
		this.EffectDropDown.option(DefaultEffectDropDownSelected);
		for (const key in EffectLookup)
		{
			this.EffectDropDown.option(key);
		}
		this.EffectDropDown.selected(DefaultEffectDropDownSelected);
		this.EffectDropDown.parent(layer);


		this.EffectDropDown.changed(function()
		{
			let name = self.EffectDropDown.value();
			self.EffectDropDown.selected(DefaultEffectDropDownSelected);
			self.AddEffect(name);
		});
	}

	AddEffect(type)
	{
		if (EffectLookup[type] == null)
		{
			return;
		}

		let holder = select(`#Layer${this.LayerId}Effects`);


		let effect = new EffectLookup[type]();
		effect.Id = NumEffectsCreated;
		NumEffectsCreated += 1;

		let effectDiv = createDiv(effect.Name);
		effectDiv.class("effect")
		effectDiv.id(`effect${effect.Id}`)

		var self = this;

		let button = createButton('X');
		button.parent(effectDiv);
		button.mousePressed(function() {
			self.RemoveEffect(effect.Id);
		});

		effectDiv.parent(holder)


		this.LayerEffects.push(effect)
	}

	RemoveEffect(id)
	{
		for (let index = 0; index < this.LayerEffects.length; index++)
		{
			const effect = this.LayerEffects[index];
			if (effect.Id == id)
			{
				this.LayerEffects.splice(index, 1)
				break;
			}
		}
		let div = select(`#effect${id}`)
		div.remove();

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
