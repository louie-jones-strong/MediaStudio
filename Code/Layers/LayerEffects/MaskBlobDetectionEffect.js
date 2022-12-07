class MaskBlobDetectionEffect extends LayerEffect
{
	constructor()
	{
		super();
		this.Name = "Blob Detection";
		this.BlobLayer = null;
		this.KernelRadius = 2;
		this.Threshold = 1;
	}

	SetSelected(selected)
	{
		super.SetSelected(selected)
		if (selected)
		{
			var self = this;
			this.LayerBlobDropDown = this.AddDropDownOption(Layers.GetLayerDict("Select A Layer", null), 0, function()
			{
				let name = self.LayerBlobDropDown.value();
				self.BlobLayer = Layers.GetLayerDict()[name];
			});
		}
		else
		{
			this.LayerBlobDropDown = null;
		}
	}

	ApplyEffect(startImg)
	{
		let img = super.ApplyEffect(startImg);

		if (this.BlobLayer != null)
		{


			let output = createGraphics(img.width, img.width);
			output.loadPixels();
			this.BlobLayer.PostEffectsImage.loadPixels();
			img.loadPixels();

			let density_output = output.pixelDensity();
			let density_blobLayer = this.BlobLayer.PostEffectsImage.pixelDensity();
			let density_img = img.pixelDensity();

			let kernel = this.GetKernel();


			for (let x = 0; x < img.width; x += 1)
			{
				for (let y = 0; y < img.height; y += 1)
				{
					let maskColour = Helpers.GetPixel(img, x, y, density_img)
					let maskValue = Helpers.RgbToBw(maskColour, true, true)
					if (maskValue <= 0)
					{
						continue
					}

					let newMaskValue = this.ApplyKernel(x, y, maskValue, kernel, density_blobLayer);
					Helpers.SetPixel(output, x, y, [newMaskValue, newMaskValue, newMaskValue, 255], density_output);
				}
			}




			output.updatePixels();
			this.BlobLayer.PostEffectsImage.updatePixels();
			img.updatePixels();
			return output;
		}

		return img;
	}

	ApplyKernel(x, y, maskValue, kernel, density_blobLayer)
	{
		let centerColour = Helpers.GetPixel(this.BlobLayer.PostEffectsImage, x, y, density_blobLayer)

		// make sure the kernel doesn't clip the edge of the image
		const xMin = max(x-this.KernelRadius, 0);
		const xMax = min(x+this.KernelRadius, image.width);
		const yMin = max(y-this.KernelRadius, 0);
		const yMax = min(y+this.KernelRadius, image.height);

		let newMaskValue = 0;
		for (let kX = xMin; kX <= xMax; kX++)
		{
			for (let kY = yMin; kY <= yMax; kY++)
			{
				let i = (kX - x) + this.KernelRadius
				let j = (kY - y) + this.KernelRadius
				let kValue = kernel[i][j]

				let kColour = Helpers.GetPixel(this.BlobLayer.PostEffectsImage, kX, kY, density_blobLayer);

				let delta = ColourDelta(
					centerColour,
					kColour)

				if (delta <= this.Threshold)
				{
					// do we want to get the avg?
					// let newValue = output.pixels[kIndex] + maskValue * kValue
					newMaskValue = max(newMaskValue, maskValue * kValue)
				}
			}
		}

		// do we want to get the avg?
		return newMaskValue;
	}

	GetKernel()
	{
		if (this.kernel != null && this.kernel.length == this.KernelRadius*2 + 1)
		{
			return this.kernel;
		}



		if (this.KernelRadius == 0)
		{
			this.kernel = [[1]]
			return this.kernel
		}


		this.kernel = [];
		let maxDist = this.DistSquared2d(0,0,this.KernelRadius, 0)
		maxDist *= maxDist

		let numValues = (this.KernelRadius*2+1)*(this.KernelRadius*2+1)
		let maxValue = 0
		for (let x = -this.KernelRadius; x <= this.KernelRadius; x++)
		{
			let row = []
			for (let y = -this.KernelRadius; y <= this.KernelRadius; y++)
			{
				let dist = this.DistSquared2d(0,0,x, y)
				dist *= dist
				let value = 1 - (dist / maxDist)
				row.push(value)
				maxValue = max(maxValue, value);
			}
			this.kernel.push(row)
		}

		for (let x = 0; x < this.kernel.length; x++)
		{
			for (let y = 0; y < this.kernel.length; y++)
			{
				this.kernel[x][y] = max(0, this.kernel[x][y] /maxValue)
			}
		}

		return this.kernel
	}

	DistSquared2d(x1, y1, x2, y2)
	{
		var d = (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1);
		return d / 2;
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