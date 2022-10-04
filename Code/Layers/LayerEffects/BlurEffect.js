class BlurEffect extends LayerEffect
{
	constructor()
	{
		super();
		this.Name = "Blur";
		this.Icon = "";

		this.BlurAmount = 2;
	}

	ApplyEffect(startImg)
	{
		startImg = super.ApplyEffect(startImg);

		startImg.filter(BLUR, this.BlurAmount * (startImg.width / CanvasWidth));
		return startImg;
	}
}