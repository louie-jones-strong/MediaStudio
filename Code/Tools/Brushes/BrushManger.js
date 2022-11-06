class BrushManger extends Selectable
{

	constructor()
	{
		super();
		this.Brushes = [];
		this.SelectedBrush = 0;

		this.Brushes.push(new SolidCircleBrush());
		this.Brushes.push(new CustomBrush());
	}

	SelectBrush(index)
	{
		this.SelectedBrush = 0;
	}

	DrawOptions()
	{
		for (let i = 0; i < this.Brushes.length; i++)
		{
			const item = this.Brushes[i];
			this.AddOption(item.Id, item.Icon, function(){})
		}

		this.SelectOption(this.Brushes[this.Brushes.length-1].Id);

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