class NoiseEffect extends LayerEffect
{
	constructor()
	{
		super();
		this.Name = "Noise";
		this.Icon = "";

		this.NoiseScale = 0.1;
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
					let value = noise(x * this.NoiseScale, y * this.NoiseScale);
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