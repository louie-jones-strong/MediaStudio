class ChromaKeyEffect extends LayerEffect
{
	constructor()
	{
		super();
		this.Name = "Chroma Key";
		this.Icon = "";

		this.SelectedColour = color(0, 255, 0, 255);
		this.AllowedError = 0.1;
	}

	ApplyEffect(startImg)
	{
		startImg = super.ApplyEffect(startImg);


		return startImg;
	}
}