class FlipEffect extends LayerEffect
{
	constructor()
	{
		super();
		this.Name = "Flip";

		this.FlipX = true;
		this.FlipY = false;
	}

	ApplyEffect(startImg)
	{
		let img = super.ApplyEffect(startImg);

		let flippedImg = createGraphics(img.width, img.height);
		flippedImg.loadPixels();

		img.loadPixels();


		for (let x = 0; x < img.width; x += 1)
		{
			for (let y = 0; y < img.height; y += 1)
			{
				let colour = Helpers.GetPixel(img, x, y);

				let outX = x;
				let outY = y;
				if (this.FlipX)
				{
					outX = (img.width - x);
				}

				if (this.FlipY)
				{
					outY = (img.height - y);
				}

				Helpers.SetPixel(flippedImg, outX, outY, colour);
			}
		}
		flippedImg.updatePixels();
		return flippedImg;
	}
}