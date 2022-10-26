class VignetteEffect extends LayerEffect
{
	constructor()
	{
		super();
		this.Name = "Vignette";

		this.Distance = 100
		this.Amount = 0.4
	}

	Draw()
	{
		super.Draw();
		if (this.DistanceSlider != null)
		{
			this.Distance = this.DistanceSlider.Value;
			this.Amount = this.AmountSlider.Value
		}
	}

	SetSelected(selected)
	{
		super.SetSelected(selected)
		if (selected)
		{

			this.DistanceSlider = this.AddValueSlider("Distance", "Distance", 0, Math.max(CanvasWidth, CanvasHeight), this.Distance, 1);
			this.AmountSlider = this.AddValueSlider("Amount", "Amount", 0, 1, this.Amount, 0.001);
		}
		else
		{
			this.DistanceSlider = null;
			this.AmountSlider = null;
		}
	}

	ApplyEffect(startImg)
	{
		let img = super.ApplyEffect(startImg);

		img.loadPixels();

		let center = createVector(img.width / 2, img.height / 2);
		let maxDistance = createVector(0, 0).dist(center);

		for (var x = 0; x < img.width; x++)
		{
			for (var y = 0; y < img.height; y++)
			{
				let colour = Helpers.GetPixel(img, x, y);

				let pos = createVector(x, y);
				let distance = center.dist(pos);

				let dynLum = map(distance, maxDistance - this.Distance, maxDistance, 1, 1-this.Amount);
				dynLum = constrain(dynLum, 0, 1);

				colour[0] = colour[0] * dynLum;
				colour[1] = colour[1] * dynLum;
				colour[2] = colour[2] * dynLum;

				Helpers.SetPixel(img, x, y, colour);
			}
		}
		img.updatePixels();
		return img;
	}
}