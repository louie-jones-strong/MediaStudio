const eAxis = {
	XAxis: 0,
	YAxis: 1
}

class MirrorDrawTool extends Tool
{

	constructor()
	{
		super();
		this.Name = "Mirror Draw Tool";
		this.Icon = "assets/mirrorDrawTool.png";

		//which axis is being mirrored (x or y) x is default
		this.Axis = eAxis.XAxis;

		//where was the mouse on the last time draw was called.
		//set it to -1 to begin with
		this.PreviousMouseX = -1;
		this.PreviousMouseY = -1;

		//mouse coordinates for the other side of the Line of symmetry.
		this.PreviousOppositeMouseX = -1;
		this.PreviousOppositeMouseY = -1;
	}

	GetFooterHtml()
	{
		var footerHtml = super.GetFooterHtml();

		footerHtml += "<p>Freehand tool, mirrored about the selected axis</p>";

		return footerHtml;
	}

	Draw()
	{
		super.Draw();

		//display the last save state of pixels
		updatePixels();

		//do the drawing if the mouse is pressed
		if (mouseIsPressed)
		{
			//if the previous values are -1 set them to the current mouse location
			//and mirrored positions
			if (this.PreviousMouseX == -1)
			{
				this.PreviousMouseX = mouseX;
				this.PreviousMouseY = mouseY;
				this.PreviousOppositeMouseX = this.CalculateOpposite(mouseX, eAxis.XAxis);
				this.PreviousOppositeMouseY = this.CalculateOpposite(mouseY, eAxis.YAxis);
			}
			else
			{
				//if there are values in the previous locations
				//draw a line between them and the current positions
				Layers.CurrentImg.line(this.PreviousMouseX, this.PreviousMouseY, mouseX, mouseY);
				this.PreviousMouseX = mouseX;
				this.PreviousMouseY = mouseY;

				//these are for the mirrored drawing the other side of the
				//line of symmetry
				var oX = this.CalculateOpposite(mouseX, eAxis.XAxis);
				var oY = this.CalculateOpposite(mouseY, eAxis.YAxis);
				Layers.CurrentImg.line(this.PreviousOppositeMouseX, this.PreviousOppositeMouseY, oX, oY);
				this.PreviousOppositeMouseX = oX;
				this.PreviousOppositeMouseY = oY;
			}
		}
		else //if the mouse isn't pressed reset the previous values to -1
		{
			this.PreviousMouseX = -1;
			this.PreviousMouseY = -1;

			this.PreviousOppositeMouseX = -1;
			this.PreviousOppositeMouseY = -1;
		}

		//after the drawing is done save the pixel state. We don't want the
		//line of symmetry to be part of our drawing

		Layers.CurrentImg.loadPixels();

		//push the drawing state so that we can set the stroke weight and color
		push();
		Layers.CurrentImg.strokeWeight(3);
		stroke("red");

		//draw the line of symmetry
		if (this.Axis == eAxis.XAxis)
		{
			Layers.CurrentImg.line(width / 2, 0, width / 2, height);
		}
		else
		{
			Layers.CurrentImg.line(0, height / 2, width, height / 2);
		}

		//return to the original stroke
		pop();

	}

	/*calculate an opposite coordinate the other side of the
	 *symmetry line.
	 *@param n number: location for either x or y coordinate
	 *@param a [x,y]: the axis of the coordinate (y or y)
	 *@return number: the opposite coordinate
	 */
	CalculateOpposite(n, a)
	{
		//if the axis isn't the one being mirrored return the same
		//value
		if (a != this.Axis)
		{
			return n;
		}

		var lineOfSymmetry = 0;
		switch (this.Axis)
		{
			case eAxis.XAxis:
				lineOfSymmetry = width / 2;
				break;
			case eAxis.YAxis:
				lineOfSymmetry = height / 2;
				break;
			default:
				break;
		}

		//if n is less than the line of symmetry return a coorindate
		//that is far greater than the line of symmetry by the distance from
		//n to that line.
		if (n < lineOfSymmetry)
		{
			return lineOfSymmetry + (lineOfSymmetry - n);
		}
		else
		{
			//otherwise a coordinate that is smaller than the line of symmetry
			//by the distance between it and n.
			return lineOfSymmetry - (n - lineOfSymmetry);
		}
	}

	//adds a button and click handler to the ToolOptions area. When clicked
	//toggle the line of symmetry between horizontal to vertical
	SelectTool()
	{
		super.SelectTool();

		var self = this;

		for (const key in eAxis)
		{
			this.AddToolOption(key, "assets/MirrorAxis/"+key+".png", function(){self.Axis = eAxis[key];})
		}
		this.SelectToolOption(Object.keys(eAxis)[this.Axis]);
	}

	UnselectTool()
	{
		super.UnselectTool();
		updatePixels();
	}
}