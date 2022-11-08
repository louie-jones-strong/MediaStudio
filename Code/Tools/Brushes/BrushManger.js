class BrushManger extends Selectable
{

	constructor()
	{
		super();
		this.Brushes = [];
		this.SelectedBrush = 0;

		this.Brushes.push(new SolidCircleBrush());
		this.Brushes.push(new CustomBrush(0, "assets/Brushes/Custom1.png"));
		this.Brushes.push(new CustomBrush(1, "assets/Brushes/SmoothCircle.png"));
	}

	SelectBrush(index)
	{
		this.SelectedBrush = 0;
	}

	DrawOptions()
	{
		var self = this
		for (let i = 0; i < this.Brushes.length; i++)
		{
			const item = this.Brushes[i];
			var index = i
			this.AddOption(item.Id, item.Icon, function(){self.SelectedBrush = index})
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