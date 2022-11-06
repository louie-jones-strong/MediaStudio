class SolidCircleBrush extends Brush
{
	constructor()
	{
		super();
		this.Name = "Solid Circle Brush";
		this.Id = "Solid_Circle_Brush";
		this.Icon = "assets/Brushes/SolidCircle.png";
	}

	Point(x, y)
	{
		Layers.CurrentImg.point(x, y);
	}

	Line(x1, y1, x2, y2)
	{
		Layers.CurrentImg.line(x1, y1, x2, y2);
	}
}