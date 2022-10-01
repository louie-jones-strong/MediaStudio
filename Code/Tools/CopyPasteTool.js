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
		this.Icon = "assets/CopyPasteTool.png";
		this.ShowStrokeSettings = false;


		this.Reset();
	}

	GetFooterHtml()
	{
		var footerHtml = super.GetFooterHtml();

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
		if(mouseIsPressed && Helpers.PosOnCanvas(mouseX, mouseY))
		{
			if(this.State == eCopyPasteState.None)
			{
				//set start point of the line to current mouse position
				this.SelectionStartX = mouseX;
				this.SelectionStartY = mouseY;
				this.SelectionWidth = 0;
				this.SelectionHeight = 0;
				this.SetState(eCopyPasteState.Selecting);

				//save current canvas state
				//this loads the pixels on the canvas in to the pixel array
				Layers.CurrentImg.loadPixels();
			}
			else
			{

				this.SelectionWidth = mouseX-this.SelectionStartX;
				this.SelectionHeight = mouseY-this.SelectionStartY;

				if (this.NormalizeAspectRatio)
				{
					var minValue = Math.min(Math.abs(this.SelectionWidth), Math.abs(this.SelectionHeight));
					if (minValue != 0)
					{
						this.SelectionWidth = ( this.SelectionWidth / Math.abs(this.SelectionWidth) ) * minValue;
						this.SelectionHeight = ( this.SelectionHeight / Math.abs(this.SelectionHeight) ) * minValue;
					}
				}

				this.DrawSelection();
			}
		}
		else if(!mouseIsPressed && this.State == eCopyPasteState.Selecting) //if the user has released the mouse while drawing we reset the tool
		{
			//reset canvas to last saved canvas
			//this updates the pixels on the canvas from the pixel array
			updatePixels();
			this.CopiedImage = get(this.SelectionStartX, this.SelectionStartY, this.SelectionWidth, this.SelectionHeight);

			this.SetState(eCopyPasteState.Selected);
		}
	}

	Stamp()
	{
		//reset canvas to last saved canvas
		//this updates the pixels on the canvas from the pixel array
		updatePixels();

		image(this.CopiedImage, mouseX - this.SelectionWidth/2, mouseY - this.SelectionHeight/2)

		if(mouseIsPressed && Helpers.PosOnCanvas(mouseX, mouseY))
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
		updatePixels();

		//push the drawing state so that we can set the stroke weight and color
		push();
		noStroke(0);
		fill(color(0, 0, 200, 100));

		//draw shape on top of the last saved state of the canvas
		Layers.CurrentImg.rect(this.SelectionStartX, this.SelectionStartY, this.SelectionWidth, this.SelectionHeight);

		//return to the original
		pop();
	}

	Clear()
	{
		if (this.State != eCopyPasteState.Selected)
		{
			return;
		}

		//reset canvas to last saved canvas
		//this updates the pixels on the canvas from the pixel array
		updatePixels();

		push();
		noStroke(0);
		fill(color(255, 255, 255));

		//draw shape on top of the last saved state of the canvas
		Layers.CurrentImg.rect(this.SelectionStartX, this.SelectionStartY, this.SelectionWidth, this.SelectionHeight);

		//return to the original
		pop();

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
				updatePixels();
				this.SetToolOptionSelected(this.StartSelectionButton, true);
				this.SetToolOptionSelected(this.StampOptionButton, false);

				this.SetToolOptionDisabled(this.ClearOptionButton, true);
				this.SetToolOptionDisabled(this.StampOptionButton, true);
			}
			case eCopyPasteState.Selecting:
			{
				this.SetToolOptionSelected(this.StartSelectionButton, true);
				this.SetToolOptionSelected(this.StampOptionButton, false);

				this.SetToolOptionDisabled(this.ClearOptionButton, true);
				this.SetToolOptionDisabled(this.StampOptionButton, true);
				break;
			}
			case eCopyPasteState.Selected:
			{
				this.SetToolOptionSelected(this.StartSelectionButton, false);
				this.SetToolOptionSelected(this.StampOptionButton, false);

				this.SetToolOptionDisabled(this.ClearOptionButton, false);
				this.SetToolOptionDisabled(this.StampOptionButton, false);
				break;
			}
			case eCopyPasteState.Stamp:
			{
				if (this.State != eCopyPasteState.Selected)
				{
					return;
				}
				this.SetToolOptionSelected(this.StartSelectionButton, false);
				this.SetToolOptionSelected(this.StampOptionButton, true);

				this.SetToolOptionDisabled(this.ClearOptionButton, true);
				this.SetToolOptionDisabled(this.StampOptionButton, false);
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

		this.StartSelectionButton = this.AddToolButton("StartSelection", "assets/CopyPaste/Select.png")
		this.StartSelectionButton.mouseClicked(function(){self.SetState(eCopyPasteState.None);});

		this.ClearOptionButton = this.AddToolButton("ClearOption", "assets/CopyPaste/Clear.png")
		this.ClearOptionButton.mouseClicked(function(){self.Clear();});

		this.StampOptionButton = this.AddToolButton("StampOption", "assets/CopyPaste/Stamp.png")
		this.StampOptionButton.mouseClicked(function(){self.SetState(eCopyPasteState.Stamp)});

		this.SetToolOptionSelected(this.StartSelectionButton, true);
		this.SetToolOptionSelected(this.StampOptionButton, false);

		this.SetToolOptionDisabled(this.ClearOptionButton, true);
		this.SetToolOptionDisabled(this.StampOptionButton, true);
	}

	UnselectTool()
	{
		super.UnselectTool();
		this.Reset();
		//reset canvas to last saved canvas
		//this updates the pixels on the canvas from the pixel array
		updatePixels();
	}
}