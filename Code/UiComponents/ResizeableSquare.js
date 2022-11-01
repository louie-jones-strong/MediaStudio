class ResizeableSquare
{
	constructor(x, y, width, height)
	{
		this.X = x;
		this.Y = y;
		this.Width = width;
		this.Height = height;
		this.OgWidth = this.Width
		this.OgHeight = this.Height;

		this.Holder = select(`#content`);


		let topLeft = createDiv()
		topLeft.elt.classList.add("layerHandle")
		topLeft.id("topLeft")

		let topRight = createDiv()
		topRight.elt.classList.add("layerHandle")
		topRight.id("topRight")

		let bottomLeft = createDiv()
		bottomLeft.elt.classList.add("layerHandle")
		bottomLeft.id("bottomLeft")

		let bottomRight = createDiv()
		bottomRight.elt.classList.add("layerHandle")
		bottomRight.id("bottomRight")

		let moveHandle = createDiv()
		moveHandle.elt.classList.add("layerHandle")
		moveHandle.id("middle")

		this.BoxOutline = createDiv()
		this.BoxOutline.elt.classList.add("resizeableSquareOutline")
		this.BoxOutline.parent(this.Holder);



		this.TopLeftDrag = new Draggable(topLeft, this.X, this.Y)
		this.TopRightDrag = new Draggable(topRight, this.X + this.Width, this.Y)
		this.BottomLeftDrag = new Draggable(bottomLeft, this.X, this.Y + this.Height)
		this.BottomRightDrag = new Draggable(bottomRight, this.X + this.Width, this.Y + this.Height)
		this.MiddleMoveDrag = new Draggable(moveHandle, this.X + this.Width/2, this.Y + this.Height/2)

		this.LeftList = [this.TopLeftDrag, this.BottomLeftDrag]
		this.RightList = [this.TopRightDrag, this.BottomRightDrag]
		this.TopList = [this.TopLeftDrag, this.TopRightDrag]
		this.BottomList = [this.BottomLeftDrag, this.BottomRightDrag]

		this.AllList = [this.TopLeftDrag, this.TopRightDrag, this.BottomLeftDrag, this.BottomRightDrag]
	}

	Remove()
	{
		this.TopLeftDrag.Remove();
		this.TopRightDrag.Remove();
		this.BottomLeftDrag.Remove();
		this.BottomRightDrag.Remove();
		this.MiddleMoveDrag.Remove();

		this.BoxOutline.remove();
	}

	Update()
	{
		if (this.MiddleMoveDrag == Draggable.Selected)
		{
			let xDelta = this.MiddleMoveDrag.X - this.MiddleMoveDrag.LastX;
			let yDelta = this.MiddleMoveDrag.Y - this.MiddleMoveDrag.LastY;

			for (let i = 0; i < this.AllList.length; i++)
			{
				const item = this.AllList[i];
				item.SetPos(item.X + xDelta, item.Y + yDelta);
			}
		}

		this.UpdateList(this.LeftList, false, true);
		this.UpdateList(this.RightList, false, true);
		this.UpdateList(this.TopList, true, false);
		this.UpdateList(this.BottomList, true, false);

		this.X = this.TopLeftDrag.X;
		this.Y = this.TopLeftDrag.Y;

		this.Width = this.BottomRightDrag.X - this.X;
		this.Height = this.BottomRightDrag.Y - this.Y;

		if (NormalizeAspectRatio)
		{
			let ratio = Math.min(this.Width / this.OgWidth, this.Height / this.OgHeight)

			this.Width = ratio * this.OgWidth;
			this.Height = ratio * this.OgHeight;

			this.UpdateList(this.LeftList, false, true, this.X, this.Y);
			this.UpdateList(this.TopList, true, false, this.X, this.Y);

			this.UpdateList(this.RightList, false, true, this.Width + this.X, this.Height + this.Y);
			this.UpdateList(this.BottomList, true, false, this.Width + this.X, this.Height + this.Y);
		}





		this.UpdateOutline();

		if (this.MiddleMoveDrag != Draggable.Selected)
		{
			let x = this.X + this.Width / 2;
			let y = this.Y + this.Height / 2;
			this.MiddleMoveDrag.SetPos(x, y)
		}
	}

	UpdateOutline()
	{
		let boxX = this.X;
		let boxY = this.Y;
		let boxWidth = this.Width;
		let boxHeight = this.Height;

		if (boxWidth < 0)
		{
			boxX += boxWidth;
			boxWidth = Math.abs(boxWidth)
		}

		if (boxHeight < 0)
		{
			boxY += boxHeight;
			boxHeight = Math.abs(boxHeight)
		}

		let holderWidth = this.Holder.size().width;
		let holderHeight = this.Holder.size().height;

		let offsetX = (holderWidth - CanvasWidth * Zoom) / 2;
		let offsetY = (holderHeight - CanvasHeight * Zoom) / 2;

		this.BoxOutline.elt.style.left = `${boxX * Zoom + offsetX}px`;
		this.BoxOutline.elt.style.top = `${boxY * Zoom + offsetY}px`;
		this.BoxOutline.elt.style.width = `${boxWidth * Zoom}px`;
		this.BoxOutline.elt.style.height = `${boxHeight * Zoom}px`;
	}

	UpdateList(list, lockedX, lockedY, forcedX=null, forcedY=null)
	{
		let selectedItem = null;
		for (let i = 0; i < list.length; i++)
		{
			const item = list[i];
			if (item == Draggable.Selected)
			{
				selectedItem = item;
				break;
			}
		}

		if (selectedItem == null)
		{
			return;
		}

		let newX = selectedItem.X;
		let newY = selectedItem.Y;

		if ( forcedX != null)
		{
			newX = forcedX;
		}

		if (forcedY != null)
		{
			newY = forcedY;
		}

		for (let i = 0; i < list.length; i++)
		{
			const item = list[i];
			if (lockedX)
			{
				newX = item.X;
			}

			if (lockedY)
			{
				newY = item.Y;
			}

			item.SetPos(newX, newY);
		}

	}
}