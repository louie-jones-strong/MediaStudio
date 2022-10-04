class ChromaKeyEffect extends LayerEffect
{
	constructor()
	{
		super();
		this.Name = "Chroma Key";
		this.Icon = "";

		this.SelectedColour = color(0, 255, 0, 255);
		this.ReplaceColor = color(0, 0, 0, 0)
		this.Threshold = 0.1;
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

				let delta = DistSquared(colours[0], colours[1], colours[2], this.SelectedColour.levels[0], this.SelectedColour.levels[1], this.SelectedColour.levels[2]);

				if (delta <= this.Threshold * this.Threshold)
				{
					Helpers.SetPixel(startImg, x, y, this.ReplaceColor);
				}
			}
		}
		startImg.updatePixels();

		return startImg;
	}
}

function DistSquared(x1, y1, z1, x2, y2, z2)
{
	return (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) + (z2-z1)*(z2-z1);
}