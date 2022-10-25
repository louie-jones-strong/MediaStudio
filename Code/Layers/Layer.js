const FastEffectScaleFactor = 4;

const DefaultEffectDropDownSelected ='Select Effect';
const EffectLookup = {};
EffectLookup["Chroma Key"] = ChromaKeyEffect;
EffectLookup["Blur"] = BlurEffect;
EffectLookup["Noise"] = NoiseEffect;
EffectLookup["Flip"] = FlipEffect;

const DisplaySource = {
	Drawing: 0,
	Graphic: 1,
	Webcam: 2,
};

const DisplaySourceLookup = {};
DisplaySourceLookup["Drawing"] = DisplaySource.Drawing;
DisplaySourceLookup["Graphic"] = DisplaySource.Graphic;
DisplaySourceLookup["Webcam"] = DisplaySource.Webcam;



class Layer extends Selectable
{
	static NumEffectsCreated = 0;
	constructor(layerId, layerName, graphic,
		resizeAnchorX=0, resizeAnchorY=0, resizeWidth=-1, resizeHeight=-1,
		displaySource=DisplaySource.Drawing)
	{
		super();
		this.LayerId = layerId;
		this.LayerName = layerName;
		this.Name = `Layer: ${this.LayerName}`;

		this.Canvas = null;
		this.P5 = new p5(s);

		this.Show = true;
		this.Alpha = 1;

		this.LayerEffects = [];
		this.MuteEffects = false;
		this.UseFastEffect = false;

		// resizing Style
		this.ResizeAnchorX = resizeAnchorX;
		this.ResizeAnchorY = resizeAnchorY;
		this.ResizePivotX = this.ResizeAnchorX;
		this.ResizePivotY = this.ResizeAnchorY;
		this.ResizeWidth = resizeWidth;
		this.ResizeHeight = resizeHeight;
		this.XOffset = 0;
		this.YOffset = 0;

		this.DisplaySource = displaySource;

		this.Resize(CanvasWidth, CanvasHeight, graphic)
	}

	Resize(width, height, graphic)
	{
		this.LayerImage = createGraphics(width, height);

		if (graphic != null)
		{
			if (this.ResizeWidth < 0 && this.ResizeHeight < 0)
			{
				let ratio = Math.max(width / graphic.width, height / graphic.height)

				this.ResizeWidth = ratio * graphic.width / width;
				this.ResizeHeight = ratio * graphic.height / height;
			}


		// 	if (this.ResizeWidth > 0)
		// 		imgWidth = floor(this.ResizeWidth * width)
		// 	if (this.ResizeHeight > 0)
		// 		imgHeight = floor(this.ResizeHeight * height)


		// 	let x = floor((this.ResizeAnchorX * width) - (this.ResizeAnchorX * imgWidth));
		// 	let y = floor((this.ResizeAnchorY * height) - (this.ResizeAnchorY * imgHeight));

			this.LayerImage.image(graphic, 0, 0, CanvasWidth, CanvasHeight);
		}

		this.AffectEffectsCache = createGraphics(width, height);
		this.FastEffectsCache = createGraphics(floor(width / FastEffectScaleFactor), floor(height / FastEffectScaleFactor));
		this.ForceEffectRefresh = true;
	}

	AddLayerUiHtml(holder, onClick)
	{
		let layer = createDiv(``);

		// layer header
		let layerHeader = createDiv(`<h3>${this.LayerName }</h3>Show
			<input type="checkbox" id="Layer${this.LayerId}ShowToggle" checked>`);

		layerHeader.parent(layer);
		layerHeader.class("layerHeader");

		var self = this;

		let editButton = createButton(`<span class="material-icons">edit</span>`);
		editButton.parent(layerHeader);
		editButton.mousePressed(function() {
			ToolManager.SelectTool(null);
			self.SetSelected(true);
		});


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

	SetSelected(selected)
	{
		super.SetSelected(selected)
		if (selected)
		{
			var self = this;
			this.DisplaySourceDropDown = this.AddDropDownOption(DisplaySourceLookup, 0, function()
			{
				let name = self.DisplaySourceDropDown.value();
				self.DisplaySource = DisplaySourceLookup[name];
			});

			this.AlphaSlider = this.AddValueSlider("Alpha", "Alpha", 0, 1, this.Alpha, 0.01);

			let x = this.ResizeAnchorX * CanvasWidth - (CanvasWidth * this.ResizeWidth) / 2
			let y = this.ResizeAnchorY * CanvasHeight - (CanvasHeight * this.ResizeHeight) / 2
			this.ResizeSquare = new ResizeableSquare(x, y, CanvasWidth * this.ResizeWidth, CanvasHeight * this.ResizeHeight)
		}
		else
		{
			this.DisplaySourceDropDown = null;
			this.AlphaSlider = null;

			this.ResizeSquare.Remove();
			this.ResizeSquare = null;
		}
	}

//#region Effects
	AddEffect(type)
	{
		if (EffectLookup[type] == null)
		{
			return;
		}

		let holder = select(`#Layer${this.LayerId}Effects`);


		let effect = new EffectLookup[type]();
		effect.Id = Layer.NumEffectsCreated;
		Layer.NumEffectsCreated += 1;

		let effectDiv = createDiv(effect.Name);
		effectDiv.class("effect")
		effectDiv.id(`effect${effect.Id}`)

		var self = this;

		let removeButton = createButton('X');
		removeButton.parent(effectDiv);
		removeButton.mousePressed(function() {
			self.RemoveEffect(effect.Id);
		});

		let editButton = createButton(`<span class="material-icons">edit</span>`);
		editButton.parent(effectDiv);
		editButton.mousePressed(function() {
			self.EditEffect(effect.Id);
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

	EditEffect(id)
	{
		for (let index = 0; index < this.LayerEffects.length; index++)
		{
			const effect = this.LayerEffects[index];
			if (effect.Id == id)
			{
				effect.SetSelected(true);
				break;
			}
		}
	}
//#endregion

	SetCurrentLayer(selected)
	{

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

	Draw()
	{
		super.Draw();

		if (this.IsSelected())
		{
			this.ResizeSquare.Update()

			this.XOffset = this.ResizeSquare.X / CanvasWidth
			this.YOffset = this.ResizeSquare.Y / CanvasHeight
			this.ResizeAnchorX = 0;
			this.ResizeAnchorY = 0;
			this.ResizePivotX = 0;
			this.ResizePivotY = 0;
			this.ResizeWidth = this.ResizeSquare.Width / CanvasWidth
			this.ResizeHeight = this.ResizeSquare.Height / CanvasHeight


			this.Alpha = this.AlphaSlider.Value;
		}


		let showCheckBox = document.getElementById(`Layer${this.LayerId}ShowToggle`);
		this.Show = showCheckBox.checked;

		let muteEffectsCheckBox = document.getElementById(`Layer${this.LayerId}EffectsToggle`);
		this.MuteEffects = !muteEffectsCheckBox.checked;


		if (!this.Show)
		{
			return;
		}

		let afterEffectsImg = this.ApplyEffects();

		push();
		if (this.Alpha < 1)
		{
			tint(255, this.Alpha * 255);
		}


		let x = (this.ResizeAnchorX * CanvasWidth) - ((this.ResizePivotX * CanvasWidth ) * this.ResizeWidth)+ this.XOffset * CanvasWidth;
		let y = (this.ResizeAnchorY * CanvasHeight) - ((this.ResizePivotY * CanvasHeight ) * this.ResizeHeight) + this.YOffset * CanvasHeight;
		image(afterEffectsImg, x, y, CanvasWidth * this.ResizeWidth, CanvasHeight * this.ResizeHeight);
		pop();

		this.P5.clear()
		x = (this.ResizeAnchorX * this.P5.width) - ((this.ResizePivotX * this.P5.width ) * this.ResizeWidth)+ this.XOffset * this.P5.width;
		y = (this.ResizeAnchorY * this.P5.height) - ((this.ResizePivotY * this.P5.height ) * this.ResizeHeight) + this.YOffset * this.P5.height;
		this.P5.image(afterEffectsImg, x, y, this.P5.width * this.ResizeWidth, this.P5.height * this.ResizeHeight);


		for (let i = 0; i < this.LayerEffects.length; i++)
		{
			const effect = this.LayerEffects[i];
			effect.Draw();
		}
	}

	UpdateLayerImage()
	{
		switch (this.DisplaySource)
		{
			case DisplaySource.Drawing:
			case DisplaySource.Graphic:
			{
				break;
			}
			case DisplaySource.Webcam:
			{
				if (this.Video == null)
				{
					this.Video = createCapture(VIDEO);
					this.Video.hide();
				}

				this.LayerImage.image(this.Video, 0, 0, this.LayerImage.width, this.LayerImage.height);

				break;
			}
			default:
			{
				console.log("unknown source: " + this.DisplaySource);
				break;
			}
		}
	}

	ApplyEffects()
	{
		this.UpdateLayerImage();

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
