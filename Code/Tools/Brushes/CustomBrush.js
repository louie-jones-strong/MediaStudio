class CustomBrush extends Brush
{
	constructor(id, name="Custom Brush")
	{
		super();
		this.Name = name;
		this.Id = id + "_Custom_Brush";
		this.Icon = "";
	}

	Point(x, y)
	{
	}

	Line(x1, y1, x2, y2)
	{
	}
}