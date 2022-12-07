class MaskFromDeltaEffect extends LayerEffect
{
	constructor()
	{
		super();
		this.Name = " Delta Mask";
		this.Threshold = 1;
	}

	SetSelected(selected)
	{
		super.SetSelected(selected)
		if (selected)
		{
			var self = this;
			this.OtherLayerDropDown = this.AddDropDownOption(Layers.GetLayerDict("Select A Layer", null), 0, function()
			{
				let name = self.OtherLayerDropDown.value();
				self.OtherLayer = Layers.GetLayerDict()[name];
			});
		}
		else
		{
			this.OtherLayerDropDown = null;
		}
	}

	ApplyEffect(startImg)
	{
		let img = super.ApplyEffect(startImg);

		if (this.OtherLayer != null)
		{

			this.OtherLayer.PostEffectsImage.loadPixels();
			img.loadPixels();

			let density_OtherLayer = this.OtherLayer.PostEffectsImage.pixelDensity();
			let density_img =  img.pixelDensity();


			for (let x = 0; x < img.width; x += 1)
			{
				for (let y = 0; y < img.height; y += 1)
				{
					let thisLayerColour = Helpers.GetPixel(img, x, y, density_img)
					let otherLayerColour = Helpers.GetPixel(this.OtherLayer.PostEffectsImage, x, y, density_OtherLayer)
					let newMaskValue = this.ColourDelta(thisLayerColour, otherLayerColour)

					if (newMaskValue < this.Threshold)
					{
						newMaskValue = 0;
					}
					else
					{
						newMaskValue = min(max(newMaskValue, 0), 1)
						newMaskValue *= 255
					}

					Helpers.SetPixel(img, x, y, [newMaskValue, newMaskValue, newMaskValue, 255], density_img);
				}
			}

			this.OtherLayer.PostEffectsImage.updatePixels();
			img.updatePixels();
		}

		return img;
	}

	DistSquared3d(x1, y1, z1, x2, y2, z2)
	{
		var d = (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) + (z2-z1)*(z2-z1);
		return d / 3;
	}


	ColourDelta(c1, c2)
	{
		// let delta = DistSquared3d(hue(c1), saturation(c1), brightness(c1), hue(c2), saturation(c2), brightness(c2))
		// delta = 0
		let delta = this.DistSquared3d(c1[0], c1[1], c1[2], c2[0], c2[1], c2[2])
		// return delta
		// delta = Math.abs( hue(c1) - hue(c2))
		// delta = round(delta/10, 1)
		// delta += Math.abs( saturation(c1) - saturation(c2))
		// delta += Math.abs( brightness(c1) - brightness(c2)) * Math.abs( brightness(c1) - brightness(c2))
		return delta /255
	}
}