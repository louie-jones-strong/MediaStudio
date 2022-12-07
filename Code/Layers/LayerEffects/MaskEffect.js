class MaskEffect extends LayerEffect
{
	constructor()
	{
		super();
		this.Name = "Mask";
		this.MaskLayer = null
	}

	SetSelected(selected)
	{
		super.SetSelected(selected)
		if (selected)
		{
			var self = this;
			this.LayerMaskDropDown = this.AddDropDownOption(Layers.GetLayerDict("Select A Layer", null), 0, function()
			{
				let name = self.LayerMaskDropDown.value();
				self.MaskLayer = Layers.GetLayerDict()[name];
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


		if (this.MaskLayer != null)
		{
			img.loadPixels();
			this.MaskLayer.PostEffectsImage.loadPixels();

			let density_Mask = this.MaskLayer.PostEffectsImage.pixelDensity();
			let density_Img = img.pixelDensity();


			for (let x = 0; x < img.width; x += 1)
			{
				for (let y = 0; y < img.height; y += 1)
				{
					let alpha = Helpers.GetMaskValue(this.MaskLayer.PostEffectsImage, x, y, density_Mask)

					let colour = Helpers.GetPixel(img, x, y, density_Img);
					colour[3] *= alpha

					Helpers.SetPixel(img, x, y, colour, density_Img);
				}
			}
			img.updatePixels();
			this.MaskLayer.PostEffectsImage.updatePixels();
		}
		return img;
	}
}