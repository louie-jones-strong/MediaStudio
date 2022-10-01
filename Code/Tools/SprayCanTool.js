class SprayCanTool extends Tool
{

	constructor()
	{
		super();
		//set an icon and a name for the object
		this.Name = "Spray Can Tool";
		this.Icon = "assets/sprayCanTool.png";

		this.Points =  5;
		this.Spread =  10;
		this.SpreadSlider = null;
	}

	GetFooterHtml()
	{
		var footerHtml = super.GetFooterHtml();

		footerHtml += "<p>Click and drag on the canvas to spray</p>";

		return footerHtml;
	}

	Draw()
	{
		super.Draw();

		this.Spread = this.SpreadSlider.Value;

		//if the mouse is pressed paint on the canvas
		//spread describes how far to spread the paint from the mouse pointer
		//points holds how many pixels of paint for each mouse press.
		if(mouseIsPressed && Helpers.PosOnCanvas(mouseX, mouseY))
		{
			for(var i = 0; i < this.Points; i++)
			{
				var angle = random(0, Math.PI * 2);
				var distance = random(0, this.Spread);
				var x = mouseX + Math.sin(angle) * distance;
				var y = mouseY + Math.cos(angle) * distance;

				Layers.CurrentImg.point(x, y);
			}
		}
	}

	//adds a button and click handler to the ToolOptions area.
	SelectTool()
	{
		super.SelectTool();

		this.SpreadSlider = this.AddToolValueSlider("Spread", "Spread", 10, 300, this.Spread);
	}
}