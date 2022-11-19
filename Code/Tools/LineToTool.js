class LineToTool extends Tool
{
	constructor()
	{
		super();
		//set an icon and a name for the object
		this.Icon = "assets/lineTool.png";
		this.Id = "Line_Tool";
		this.Name = "Line Tool";

		this.StartMouseX = -1;
		this.StartMouseY = -1;
		this.Drawing = false;
	}

	GetFooterHtml()
	{
		let footerHtml = super.GetFooterHtml();

		footerHtml += "<p>Click for first point, drag and release for end point</p>";
		footerHtml += "<p>Shift key to constrain angle</p>";

		return footerHtml;
	}

	SelectTool()
	{
		super.SelectTool();

		Brushes.DrawOptions();
	}

	Draw()
	{
		super.Draw();

		if(MouseLeftOrRightDown)
		{
			//check if this is the start of the line
			if(this.StartMouseX == -1)
			{
				//set start point of the line to current mouse position
				this.StartMouseX = MousePosX;
				this.StartMouseY = MousePosY;
				this.Drawing = true;

				//save current canvas state
				//this loads the pixels on the canvas in to the pixel array
				Layers.CurrentImg.loadPixels();
			}
			else
			{
				//reset canvas to last saved canvas
				//this updates the pixels on the canvas from the pixel array
				Layers.CurrentImg.updatePixels();

				let endX = MousePosX;
				let endY = MousePosY;

				if (NormalizeAspectRatio)
				{
					let deltaX = endX - this.StartMouseX;
					let deltaY = endY - this.StartMouseY;

					let maxDelta = Math.max(Math.abs(deltaX), Math.abs(deltaY));
					let minDelta = Math.min(Math.abs(deltaX), Math.abs(deltaY));
					let norDeltaX = Math.abs(deltaX) / maxDelta;
					let norDeltaY = Math.abs(deltaY) / maxDelta;


					if (Math.abs(norDeltaY - norDeltaX) <= 0.5)
					{
						if (deltaX < 0)
							endX = this.StartMouseX - minDelta;
						else
							endX = this.StartMouseX + minDelta;

						if (deltaY < 0)
							endY = this.StartMouseY - minDelta;
						else
							endY = this.StartMouseY + minDelta;

					}
					else
					{
						if (Math.abs(deltaX) > Math.abs(deltaY))
						{
							endY = this.StartMouseY;
						}
						else
						{
							endX = this.StartMouseX;
						}
					}
				}

				//draw line on top of the last saved state of the canvas
				Brushes.Line(this.StartMouseX, this.StartMouseY, endX, endY);
			}
		}
		else if(this.Drawing) //if the user has released the mouse while drawing we reset the tool
		{
			//reset tool now that we have finished drawing current line
			this.Drawing = false;
			this.StartMouseX = -1;
			this.StartMouseY = -1;
		}
	}
}
