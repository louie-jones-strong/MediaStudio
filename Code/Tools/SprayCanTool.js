class SprayCanTool extends Tool
{

	constructor()
	{
		super();
		//set an icon and a name for the object
		this.Name = "Spray Can Tool";
		this.Id = "Spray_Can_Tool";
		this.Icon = "assets/sprayCanTool.png";

		this.Points =  5;
		this.Spread =  10;
		this.SpreadSlider = null;
	}

	GetFooterHtml()
	{
		let footerHtml = super.GetFooterHtml();

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
		if(MouseLeftOrRightPressed && Helpers.PosOnCanvas(MousePosX, MousePosY))
		{
			for(let i = 0; i < this.Points; i++)
			{
				let angle = random(0, Math.PI * 2);
				let distance = random(0, this.Spread);
				let x = MousePosX + Math.sin(angle) * distance;
				let y = MousePosY + Math.cos(angle) * distance;

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