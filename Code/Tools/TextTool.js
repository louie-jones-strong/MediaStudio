class TextTool extends Tool
{
	constructor()
	{
		super();
		//set an icon and a name for the object
		this.Name = "Text Tool";
		this.Icon = "assets/TextTool.png";
		this.ShowStrokeSettings = false;

		this.PosX = -1;
		this.PosY = -1;
		this.CurrentString = "";
		this.TextSize = 50;

		this.LineShowing = true;
		this.LineFlashTimer = Date.now();
	}

	GetFooterHtml()
	{
		var footerHtml = super.GetFooterHtml();

		if (this.PosX < 0)
		{
			footerHtml += "<p>Click on canvas to define start point</p>";
		}
		else
		{
			footerHtml += "<p>Type to enter text, or click canvas to start new text</p>";
		}

		return footerHtml;
	}

	Draw()
	{
		super.Draw();

		this.TextSize = this.Slider.Value;
		Layers.CurrentImg.textSize(this.TextSize);

		Layers.CurrentImg.updatePixels();
		if(mouseIsPressed && Helpers.PosOnCanvas(mouseX, mouseY))
		{
			this.FinishCurrentText();

			this.PosX = mouseX;
			this.PosY = mouseY;
		}

		Layers.CurrentImg.loadPixels();

		push();
		Layers.CurrentImg.strokeWeight(1);

		if(this.PosX >= 0)
		{
			Layers.CurrentImg.text(this.CurrentString, this.PosX, this.PosY);
		}

		//switch the state of the line showing every 400 mill seconds
		if (Date.now() >= this.LineFlashTimer + 400)
		{
			this.LineShowing = !this.LineShowing;
			this.LineFlashTimer = Date.now();
		}

		if (this.LineShowing)
		{
			var x = mouseX;
			var y = mouseY;
			if(this.PosX >= 0)
			{
				var x = this.PosX;
				var y = this.PosY;
			}

			Layers.CurrentImg.rect(x, y, 1, -this.Slider.Value);
		}

		pop();
	}

	KeyPressed()
	{
		super.KeyPressed();
		if (keyCode == 8)
		{
			this.CurrentString = this.CurrentString.substring(0, this.CurrentString.length - 1);
		}
	}

	KeyTyped()
	{
		super.KeyTyped();
		this.CurrentString += key;
	}

	UnselectTool()
	{
		super.UnselectTool();
		Layers.CurrentImg.updatePixels();
		this.FinishCurrentText();
		this.PosX = -1;
		this.PosY = -1;
	}

	FinishCurrentText()
	{
		push();
		Layers.CurrentImg.strokeWeight(1);
		Layers.CurrentImg.text(this.CurrentString, this.PosX, this.PosY);
		this.CurrentString = "";
		pop();
	}

	//adds a button and click handler to the ToolOptions area.
	SelectTool()
	{
		super.SelectTool();

		this.Slider = this.AddToolValueSlider("Text_Size", "Text Size", 5, 1000, this.TextSize);
	}
}