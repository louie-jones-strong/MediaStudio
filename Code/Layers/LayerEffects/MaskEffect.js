class MaskEffect extends LayerEffect
{
	constructor()
	{
		super();
		this.Name = "Mask";

		this.Mask = null
	}

	SetSelected(selected)
	{
		super.SetSelected(selected)
		if (selected)
		{
			var self = this;
			this.LayerMaskDropDown = this.AddDropDownOption(Layers.GetLayerDict(), 0, function()
			{
				let name = self.LayerMaskDropDown.value();
				this.MaskLayer = Layers.GetLayerDict()[name];
			});
		}
		else
		{
			this.LayerMaskDropDown = null;
		}
	}

	ApplyEffect(startImg)
	{
		let img = super.ApplyEffect(startImg);


		if (this.Mask != null)
		{
			img.loadPixels();


			for (let x = 0; x < img.width; x += 1)
			{
				for (let y = 0; y < img.height; y += 1)
				{
					let alpha = Helpers.RgbToBw(Helpers.GetPixel(this.Mask, x, y), true)

					let colour = Helpers.GetPixel(img, x, y);
					colour[3] *= alpha

					Helpers.SetPixel(img, (img.width-x), y, colour);
				}
			}
			img.updatePixels();
		}


		return img;
	}
}