class NoiseEffect extends LayerEffect
{
	constructor()
	{
		super();
		this.Name = "Noise";
		this.Icon = "";

		this.NoiseScale = 0.1;
		this.ScaleSlider = null;
	}

	Draw()
	{
		super.Draw();
		if (this.ScaleSlider != null)
		{
			this.NoiseScale = this.ScaleSlider.Value;
		}
	}

	SetSelected(selected)
	{
		super.SetSelected(selected)
		if (selected)
		{
			this.ScaleSlider = this.AddValueSlider("NoiseScale", "Noise Scale", 0, 400, this.NoiseScale);
		}
		else
		{
			this.ScaleSlider = null;
		}
	}

	ApplyEffect(startImg)
	{
		startImg = super.ApplyEffect(startImg);

		startImg.loadPixels();
		for (let x = 0; x < startImg.width; x += 1)
		{
			for (let y = 0; y < startImg.height; y += 1)
			{
				let colours = Helpers.GetPixel(startImg, x, y);

				if (colours[3]  > 0)
				{
					let scale = (startImg.width / CanvasWidth)

					let value = noise(x * this.NoiseScale / scale, y * this.NoiseScale / scale);
					value *= 255;

					colours[3] = (colours[3] + value) / 2;
					Helpers.SetPixel(startImg, x, y, colours);
				}
			}
		}
		startImg.updatePixels();

		return startImg;
	}
}