class BlurEffect extends LayerEffect
{
	constructor()
	{
		super();
		this.Name = "Blur";
		this.Icon = "";
	}

	ApplyEffect(startImg)
	{
		startImg = super.ApplyEffect(startImg);

		startImg.filter(BLUR, 2);
		return startImg;
	}
}