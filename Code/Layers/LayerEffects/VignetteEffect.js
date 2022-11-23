class VignetteEffect extends LayerEffect
{
	constructor()
	{
		super();
		this.Name = "Vignette";

		this.Distance = 250
		this.Amount = 1
	}

	Draw()
	{
		super.Draw();
		if (this.DistanceSlider != null)
		{
			this.Distance = this.DistanceSlider.Value;
			this.Amount = this.AmountSlider.Value;

			this.CachedOverlay = null
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

		let overlay = this.GetOverlayImg(img.width, img.height);

		img.image(overlay, 0, 0);
		return img
	}

	GetOverlayImg(width, height)
	{
		if (this.CachedOverlay == null ||
			this.CachedOverlay.width != width ||
			this.CachedOverlay.height != height)
		{

			this.CachedOverlay = this.GetCachedImage(width, height);

			this.CachedOverlay.background(0);
			this.CachedOverlay.loadPixels();

			let center = createVector(width / 2, height / 2);
			let maxDistance = createVector(0, 0).dist(center);

			for (var x = 0; x < width; x++)
			{
				for (var y = 0; y < height; y++)
				{

					let pos = createVector(x, y);
					let distance = center.dist(pos);

					let dynLum = map(distance, maxDistance - this.Distance, maxDistance, 1, 1-this.Amount);
					dynLum = constrain(dynLum, 0, 1);

					Helpers.SetPixel(this.CachedOverlay, x, y, [0,0,0,255 -( dynLum * 255)]);
				}
			}
			this.CachedOverlay.updatePixels();
		}

		return this.CachedOverlay;
	}
}