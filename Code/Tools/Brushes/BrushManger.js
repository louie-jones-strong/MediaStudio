class BrushManger extends Selectable
{

	constructor()
	{
		super();
		this.Brushes = {};
		this.SelectedBrush = 0;
		this.BrushesAdded = 0;

		this.AddBrush(new SolidCircleBrush());
		this.AddBrush(new CustomBrush(0, "assets/Brushes/Custom1.png"));
		this.AddBrush(new CustomBrush(1, "assets/Brushes/SmoothCircle.png"));
		this.AddBrush(new CustomBrush(2, "assets/Brushes/Arty.png"));
	}

	AddBrush(brush)
	{
		this.Brushes[this.BrushesAdded] = brush;

		this.BrushesAdded += 1;
	}

	DrawOptions()
	{
		var self = this
		for (const key in this.Brushes)
		{
			const item = this.Brushes[key];
			this.AddOption(item.Id, item.Icon, function(){self.SelectedBrush = key;})
		}

		this.SelectOption(this.Brushes[this.SelectedBrush].Id);

		// add option to add new brush
	}

	Point(x, y)
	{
		this.Brushes[this.SelectedBrush].Point(x, y)
	}

	Line(x1, y1, x2, y2)
	{
		this.Brushes[this.SelectedBrush].Line(x1, y1, x2, y2)
	}
}