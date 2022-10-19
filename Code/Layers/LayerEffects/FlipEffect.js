class FlipEffect extends LayerEffect
{
	constructor()
	{
		super();
		this.Name = "Flip";
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
				Helpers.SetPixel(flippedImg, (img.width-x), y, colour);
			}
		}
		flippedImg.updatePixels();
		return flippedImg;
	}
}