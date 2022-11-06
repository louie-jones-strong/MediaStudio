class CustomBrush extends Brush
{
	constructor(index, name="Custom Brush")
	{
		super();
		this.Name = name;
		this.Id = "_Custom_Brush_" + index;
		this.Icon = "assets/Brushes/Custom1.png";
		this.BrushImage = loadImage(this.Icon);
	}

	Point(x, y)
	{
		let size = Tool.StrokeWeight * 2

		x -= size / 2;
		y -= size / 2;


		push();
		let levels = ColorP.SelectedColor.levels
		Layers.CurrentImg.tint(levels[0], levels[1], levels[2], levels[3]);

		Layers.CurrentImg.image(this.BrushImage, x, y, size, size)
		pop();
	}

	Line(x1, y1, x2, y2)
	{
		let dist = createVector(x1, y1).dist(createVector(x2, y2));

		let step = createVector((x2 - x1) / dist, (y2 - y1) / dist)
		for (let i = 0; i < dist; i++)
		{
			this.Point(x1 + step.x * i, y1 + step.y * i)
		}
	}
}