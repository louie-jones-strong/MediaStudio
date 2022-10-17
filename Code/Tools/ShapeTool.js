const eShape = {
	Emoji: 0,
	Ellipse: 1,
	Rect: 2,
	Pentagon: 3,
	Hexagon: 4,
}


class ShapeTool extends Tool
{
	constructor()
	{
		super();
		//set an icon and a name for the object
		this.Name = "Shape Tool";
		this.Id = "Shape_Tool";
		this.Icon = "assets/shapeTool.png";
		this.ShowStrokeSettings = false;

		this.Shape = eShape.Ellipse;
		this.StartMouseX = -1;
		this.StartMouseY = -1;
		this.Drawing = false;

		this.EmojiImage = loadImage("assets/Shapes/Emoji.png");
	}

	Draw()
	{
		super.Draw();

		if(MouseLeftOrRightPressed)
		{
			if(!this.Drawing &&
				Helpers.PosOnCanvas(MousePosX, MousePosY))
			{
				//set start point of the line to current mouse position
				this.StartMouseX = MousePosX;
				this.StartMouseY = MousePosY;
				this.Drawing = true;

				//save current canvas state
				//this loads the pixels on the canvas in to the pixel array
				Layers.CurrentImg.loadPixels();
			}
			else if (this.Drawing)
			{
				//reset canvas to last saved canvas
				//this updates the pixels on the canvas from the pixel array
				Layers.CurrentImg.updatePixels();

				var size = this.GetWidthAndHeight();


				//draw shape on top of the last saved state of the canvas
				Layers.CurrentImg.push();
				Layers.CurrentImg.strokeWeight(0);

				switch (this.Shape)
				{
					case eShape.Rect:
					{
						Layers.CurrentImg.rect(this.StartMouseX, this.StartMouseY, size[0], size[1]);
						break;
					}
					case eShape.Ellipse:
					{
						Layers.CurrentImg.ellipse(this.StartMouseX, this.StartMouseY, size[0] * 2, size[1] * 2);
						break;
					}
					case eShape.Emoji:
					{
						Layers.CurrentImg.image(this.EmojiImage, this.StartMouseX, this.StartMouseY, size[0], size[1])
						break;
					}
					case eShape.Pentagon:
					{
						this.DrawVariableSidedShape(5, this.StartMouseX, this.StartMouseY, size[0], size[1])
						break;
					}
					case eShape.Hexagon:
					{
						this.DrawVariableSidedShape(6, this.StartMouseX, this.StartMouseY, size[0], size[1])
						break;
					}
					default:
					{
						console.error("Unexpected State: "+ this.Shape);
						break;
					}
				}
				Layers.CurrentImg.pop();
			}
		}
		else if(this.Drawing) //if the user has released the mouse while drawing we reset the tool
		{
			//reset tool now that we have finished drawing current line
			this.Drawing = false;
		}
	}

	GetWidthAndHeight()
	{
		if (this.StartMouseX < 0 ||
			this.StartMouseY < 0)
		{
			return [0, 0];
		}
		var width = MousePosX-this.StartMouseX;
		var height = MousePosY-this.StartMouseY;

		if (this.NormalizeAspectRatio)
		{
			var minValue = Math.min(Math.abs(width), Math.abs(height));
			if (minValue != 0)
			{
				width = ( width / Math.abs(width) ) * minValue;
				height = ( height / Math.abs(height) ) * minValue;
			}
		}

		return [width, height];
	}

	GetFooterHtml()
	{
		var footerHtml = super.GetFooterHtml();

		var size = this.GetWidthAndHeight();

		switch (this.Shape)
		{
			case eShape.Pentagon:
			case eShape.Hexagon:
			case eShape.Ellipse:
			{
				footerHtml += "<p>Radius: "+size[0]+", "+size[1]+"</p>";
				footerHtml += "<p>Click for centre, drag and release for size</p>";
				break;
			}
			case eShape.Rect:
			case eShape.Emoji:
			{
				footerHtml += "<p>Size: "+size[0]+", "+size[1]+"</p>";
				footerHtml += "<p>click for first corner, drag and release for opposite corner</p>";
				break;
			}
			default:
			{
				console.error("Unexpected State: "+ this.Shape);
				break;
			}
		}
		footerHtml += "<p>Shift key to preserve aspect ratio</p>";

		return footerHtml;
	}

	//adds a button and click handler to the ToolOptions area.
	SelectTool()
	{
		super.SelectTool();

		var self = this;

		for (const key in eShape)
		{
			this.AddToolOption(key, "assets/Shapes/"+key+".png", function(){self.Shape = eShape[key];});
		}
		this.SelectToolOption(Object.keys(eShape)[this.Shape]);
	}

	DrawVariableSidedShape(numSides, x, y, width, height)
	{
		Layers.CurrentImg.beginShape();
		for (let i = 0; i < numSides; i++)
		{
			var pointX = width * cos(2 * Math.PI * i / numSides) + x;
			var pointY = height * sin(2 * Math.PI * i / numSides) + y;

			Layers.CurrentImg.vertex(pointX, pointY);
		}
		Layers.CurrentImg.endShape(CLOSE);
	}
}