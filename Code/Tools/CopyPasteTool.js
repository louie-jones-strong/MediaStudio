const eCopyPasteState = {
	None: 0,
	Selecting: 1,
	Selected: 2,
	Stamp: 3
}

class CopyPasteTool extends Tool
{
	constructor()
	{
		super();
		//set an icon and a name for the object
		this.Name = "Copy Paste Tool";
		this.Id = "Copy_Paste_Tool";
		this.Icon = "assets/CopyPasteTool.png";
		this.ShowStrokeSettings = false;


		this.Reset();
	}

	GetFooterHtml()
	{
		let footerHtml = super.GetFooterHtml();

		if (this.State == eCopyPasteState.None ||
			this.State == eCopyPasteState.Selecting)
		{
			footerHtml += "<p>Click and drag to define rectangle</p>";
			footerHtml += "<p>Shift key to preserve aspect ratio</p>";
		}
		else
		{
			footerHtml += "<p>Select Cut icon to clear, or Stamp icon to paste</p>";
		}

		return footerHtml;
	}

	Reset()
	{
		this.CopiedImage = null;
		this.State = eCopyPasteState.None;

		this.SelectionStartX = -1;
		this.SelectionStartY = -1;
		this.SelectionWidth = -1;
		this.SelectionHeight = -1;
	}

	Draw()
	{
		super.Draw();

		switch (this.State)
		{
			case eCopyPasteState.None:
			case eCopyPasteState.Selecting:
			{
				this.Selecting();
				break;
			}
			case eCopyPasteState.Selected:
			{
				this.DrawSelection();
				break;
			}
			case eCopyPasteState.Stamp:
			{
				this.Stamp();
				break;
			}
			default:
			{
				console.error("Unexpected State: "+ this.State);
				break;
			}
		}
	}

	Selecting()
	{
		if(MouseLeftOrRightDown && Helpers.PosOnCanvas(MousePosX, MousePosY))
		{
			if(this.State == eCopyPasteState.None)
			{
				//set start point of the line to current mouse position
				this.SelectionStartX = MousePosX;
				this.SelectionStartY = MousePosY;
				this.SelectionWidth = 0;
				this.SelectionHeight = 0;
				this.SetState(eCopyPasteState.Selecting);

				//save current canvas state
				//this loads the pixels on the canvas in to the pixel array
				Layers.CurrentImg.loadPixels();
			}
			else
			{

				this.SelectionWidth = MousePosX-this.SelectionStartX;
				this.SelectionHeight = MousePosY-this.SelectionStartY;

				if (NormalizeAspectRatio)
				{
					let minValue = Math.min(Math.abs(this.SelectionWidth), Math.abs(this.SelectionHeight));
					if (minValue != 0)
					{
						this.SelectionWidth = ( this.SelectionWidth / Math.abs(this.SelectionWidth) ) * minValue;
						this.SelectionHeight = ( this.SelectionHeight / Math.abs(this.SelectionHeight) ) * minValue;
					}
				}

				this.DrawSelection();
			}
		}
		else if(!MouseLeftOrRightDown && this.State == eCopyPasteState.Selecting) //if the user has released the mouse while drawing we reset the tool
		{
			//reset canvas to last saved canvas
			//this updates the pixels on the canvas from the pixel array
			Layers.CurrentImg.updatePixels();
			this.CopiedImage = get(this.SelectionStartX, this.SelectionStartY, this.SelectionWidth, this.SelectionHeight);

			this.SetState(eCopyPasteState.Selected);
		}
	}

	Stamp()
	{
		//reset canvas to last saved canvas
		//this updates the pixels on the canvas from the pixel array
		Layers.CurrentImg.updatePixels();

		Layers.CurrentImg.image(this.CopiedImage, MousePosX - this.SelectionWidth/2, MousePosY - this.SelectionHeight/2)

		if(MouseLeftOrRightDown && Helpers.PosOnCanvas(MousePosX, MousePosY))
		{
			//save current canvas state
			//this loads the pixels on the canvas in to the pixel array
			Layers.CurrentImg.loadPixels();
		}
	}

	DrawSelection()
	{
		//reset canvas to last saved canvas
		//this updates the pixels on the canvas from the pixel array
		Layers.CurrentImg.updatePixels();

		//push the drawing state so that we can set the stroke weight and color
		Layers.CurrentImg.push();
		noStroke(0);
		fill(color(0, 0, 200, 100));

		//draw shape on top of the last saved state of the canvas
		Layers.CurrentImg.rect(this.SelectionStartX, this.SelectionStartY, this.SelectionWidth, this.SelectionHeight);

		//return to the original
		Layers.CurrentImg.pop();
	}

	Clear()
	{
		if (this.State != eCopyPasteState.Selected)
		{
			return;
		}

		//reset canvas to last saved canvas
		//this updates the pixels on the canvas from the pixel array
		Layers.CurrentImg.updatePixels();

		Layers.CurrentImg.push();
		noStroke(0);
		fill(color(255, 255, 255));

		//draw shape on top of the last saved state of the canvas
		Layers.CurrentImg.rect(this.SelectionStartX, this.SelectionStartY, this.SelectionWidth, this.SelectionHeight);

		//return to the original
		Layers.CurrentImg.pop();

		Layers.CurrentImg.loadPixels();
		this.SetState(eCopyPasteState.None);
	}

	SetState(state)
	{
		if (this.State == state)
		{
			return;
		}

		if (this.StartSelectionButton == null ||
			this.ClearOptionButton == null ||
			this.StampOptionButton == null)
		{
			return;
		}

		switch (state)
		{
			case eCopyPasteState.None:
			{
				Layers.CurrentImg.updatePixels();
				this.SetSelectedOptionSelected(this.StartSelectionButton, true);
				this.SetSelectedOptionSelected(this.StampOptionButton, false);

				this.SetOptionDisabled(this.ClearOptionButton, true);
				this.SetOptionDisabled(this.StampOptionButton, true);
			}
			case eCopyPasteState.Selecting:
			{
				this.SetSelectedOptionSelected(this.StartSelectionButton, true);
				this.SetSelectedOptionSelected(this.StampOptionButton, false);

				this.SetOptionDisabled(this.ClearOptionButton, true);
				this.SetOptionDisabled(this.StampOptionButton, true);
				break;
			}
			case eCopyPasteState.Selected:
			{
				this.SetSelectedOptionSelected(this.StartSelectionButton, false);
				this.SetSelectedOptionSelected(this.StampOptionButton, false);

				this.SetOptionDisabled(this.ClearOptionButton, false);
				this.SetOptionDisabled(this.StampOptionButton, false);
				break;
			}
			case eCopyPasteState.Stamp:
			{
				if (this.State != eCopyPasteState.Selected)
				{
					return;
				}
				this.SetSelectedOptionSelected(this.StartSelectionButton, false);
				this.SetSelectedOptionSelected(this.StampOptionButton, true);

				this.SetOptionDisabled(this.ClearOptionButton, true);
				this.SetOptionDisabled(this.StampOptionButton, false);
				break;
			}
			default:
			{
				console.error("Unexpected State: "+ this.State);
				break;
			}
		}

		this.State = state;
	}

	SelectTool()
	{
		super.SelectTool();

		var self = this;

		this.StartSelectionButton = this.AddButton("StartSelection", "assets/CopyPaste/Select.png")
		this.StartSelectionButton.mouseClicked(function(){self.SetState(eCopyPasteState.None);});

		this.ClearOptionButton = this.AddButton("ClearOption", "assets/CopyPaste/Clear.png")
		this.ClearOptionButton.mouseClicked(function(){self.Clear();});

		this.StampOptionButton = this.AddButton("StampOption", "assets/CopyPaste/Stamp.png")
		this.StampOptionButton.mouseClicked(function(){self.SetState(eCopyPasteState.Stamp)});

		this.SetSelectedOptionSelected(this.StartSelectionButton, true);
		this.SetSelectedOptionSelected(this.StampOptionButton, false);

		this.SetOptionDisabled(this.ClearOptionButton, true);
		this.SetOptionDisabled(this.StampOptionButton, true);
	}

	UnselectTool()
	{
		super.UnselectTool();
		this.Reset();
		//reset canvas to last saved canvas
		//this updates the pixels on the canvas from the pixel array
		Layers.CurrentImg.updatePixels();
	}
}