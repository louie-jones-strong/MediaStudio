class Draggable
{
	static Items = [];
	static LastPos = null;
	static LastMouseDown = false;
	static Selected = null;

	constructor(element, x, y)
	{
		this.Element = element

		Draggable.Items.push(this);
		this.SetPos(x, y)
		this.StartDragRange = 50;
	}

	static Update()
	{
		if (!Draggable.LastMouseDown && MouseLeftPressed)
		{
			// mouseJust pressed down
			let closestDist = 0;
			Draggable.Selected = null;

			for (let i = 0; i < Draggable.Items.length; i++)
			{
				const item = Draggable.Items[i];

				let dist = Math.sqrt( Math.pow((item.X-MousePosX), 2) + Math.pow((item.Y-MousePosY), 2) );
				if (dist < item.StartDragRange &&
					(Draggable.Selected == null || dist < closestDist))
				{
					closestDist = dist;
					Draggable.Selected = item;
				}
			}
		}
		else if (!MouseLeftPressed)
		{
			// mouse released
			// Draggable.Selected = null;
		}
		else if (Draggable.Selected != null)
		{
			// dragging
			Draggable.Selected.SetPos(MousePosX, MousePosY)
		}

		Draggable.LastMouseDown = MouseLeftPressed;
	}

	SetPos(x, y)
	{
		this.X = x;
		this.Y = y;
		this.Element.elt.style.left = `${this.X - 20}px`;
		this.Element.elt.style.top = `${this.Y + 30}px`;
	}
}