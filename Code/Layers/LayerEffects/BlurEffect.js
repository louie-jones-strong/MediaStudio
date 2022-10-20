class BlurEffect extends LayerEffect
{
	constructor()
	{
		super();
		this.Name = "Blur";

		this.BlurAmount = 8;

		this.BlurSlider = null;
	}

	Draw()
	{
		super.Draw();
		if (this.BlurSlider != null)
		{
			this.BlurAmount = this.BlurSlider.Value;
		}
	}

	SetSelected(selected)
	{
		super.SetSelected(selected)
		if (selected)
		{
			this.BlurSlider = this.AddValueSlider("Blur", "Blur Amount", 1, 100, this.BlurAmount, 0.1);
		}
		else
		{
			this.BlurSlider = null;
		}
	}

	ApplyEffect(startImg)
	{
		startImg = super.ApplyEffect(startImg);

		startImg.filter(BLUR, this.BlurAmount * (startImg.width / CanvasWidth));
		return startImg;
	}

}