class Draggable
{
	static Items = [];
	static LastPos = null;
	static LastMouseDown = false;
	static Selected = null;

	constructor(element, x, y, holderId="content")
	{
		this.Holder = select(`#${holderId}`)
		this.Element = element
		this.Element.parent(this.Holder);

		Draggable.Items.push(this);
		this.SetPos(x, y)
		this.StartDragRange = 50;
	}

	Remove()
	{
		this.Element.remove();
		// remove from Items array
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
			Draggable.Selected = null;
		}
		else if (Draggable.Selected != null)
		{
			// dragging
			Draggable.Selected.SetPos(MousePosX, MousePosY)
		}

		Draggable.LastMouseDown = MouseLeftPressed;

		for (let i = 0; i < Draggable.Items.length; i++)
		{
			const item = Draggable.Items[i];
			item.SetPos(item.X, item.Y)
		}
	}

	SetPos(x, y)
	{
		// CanvasWidth * Zoom
		this.X = x;
		this.Y = y;

		let holderWidth = this.Holder.size().width;
		let holderHeight = this.Holder.size().height;

		let offsetX = (holderWidth - CanvasWidth * Zoom) / 2;
		let offsetY = (holderHeight - CanvasHeight * Zoom) / 2;

		this.Element.elt.style.left = `${this.X * Zoom + offsetX - 25 * Zoom}px`;
		this.Element.elt.style.top = `${this.Y * Zoom + offsetY - 25 * Zoom}px`;
	}
}